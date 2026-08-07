"use client";

import Image from "next/image";
import { useRef, useState } from "react";

async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

/** Single image slot — used for the cover photo and the social preview image. */
export function SingleImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>

      {value ? (
        <div className="relative h-44 w-full overflow-hidden rounded-lg border border-ink-700">
          <Image src={value} alt="" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-md bg-ink-950/80 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-ink-950"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-44 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-700 bg-ink-850 text-sm text-ink-400 transition hover:border-brand-500 hover:text-ink-100 disabled:opacity-60"
        >
          <span className="text-2xl">＋</span>
          {busy ? "Uploading…" : "Choose an image"}
          <span className="text-xs text-ink-600">JPG, PNG, WebP · max 5 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {hint && <p className="hint">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

/** Multi-image gallery with add/remove. */
export function GalleryField({
  value,
  onChange,
  max = 12,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);

    const room = max - value.length;
    const picked = Array.from(files).slice(0, Math.max(room, 0));
    const uploaded: string[] = [];

    for (const file of picked) {
      try {
        uploaded.push(await uploadFile(file));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    if (uploaded.length) onChange([...value, ...uploaded]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="label">Gallery ({value.length}/{max})</span>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-ink-700"
          >
            <Image src={url} alt="" fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded bg-ink-950/85 px-1.5 py-0.5 text-xs font-semibold text-red-300"
            >
              ✕
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="grid aspect-square place-items-center rounded-lg border border-dashed border-ink-700 bg-ink-850 text-sm text-ink-400 transition hover:border-brand-500 hover:text-ink-100 disabled:opacity-60"
          >
            {busy ? "…" : "＋"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
