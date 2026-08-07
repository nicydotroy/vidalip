import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// The stored extension comes from this table, never from the uploaded
// filename — that keeps a "photo.html" or "../../evil" out of storage.
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Magic-number check so the declared MIME type cannot lie about the payload. */
function sniff(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  const b = bytes;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  const ascii = (i: number, s: string) =>
    String.fromCharCode(...b.slice(i, i + s.length)) === s;
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  if (ascii(4, "ftyp") && ascii(8, "avif")) return "image/avif";
  return null;
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "The file is empty" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Images must be 5 MB or smaller" },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = sniff(bytes);

  if (!detected || !ALLOWED[detected]) {
    return NextResponse.json(
      { error: "Upload a JPG, PNG, WebP, GIF or AVIF image" },
      { status: 415 },
    );
  }

  const name = `${randomUUID()}.${ALLOWED[detected]}`;

  // Serverless hosts have an ephemeral, read-only filesystem, so anything
  // written to public/uploads disappears on the next deploy. When a Blob token
  // is configured we upload there; otherwise we fall back to local disk so
  // `npm run dev` works with no extra setup.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`listings/${name}`, Buffer.from(bytes), {
        access: "public",
        contentType: detected,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("upload: blob storage failed", err);
      return NextResponse.json(
        { error: "Could not store the image. Try again." },
        { status: 502 },
      );
    }
  }

  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error("upload: local write failed", err);
    return NextResponse.json(
      {
        error:
          "Could not store the image. On a serverless host, set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 },
    );
  }
}
