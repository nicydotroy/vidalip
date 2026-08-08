import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `News, advice and platform updates from ${SITE.name}.`,
};

/**
 * Posts are a static list for now — there is no post model in the database, so
 * a blog entry is added by appending here and creating the matching page.
 *
 * If this grows past a handful of entries it is worth moving to a Post table
 * with its own admin screens, the same way listings work.
 */
type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string;
};

const POSTS: Post[] = [];

export default function BlogPage() {
  return (
    <InfoPage
      title="Blog"
      intro="Advice for advertisers, safety guidance, and updates to how the platform works."
    >
      {POSTS.length === 0 ? (
        <>
          <p>
            We haven&apos;t published any posts yet. In the meantime, the most
            useful reading is already on the site:
          </p>
          <ul>
            <li>
              <Link href="/posting-guide">Posting Guide</Link> — how to write a
              listing that gets approved first time, with the exact field limits
              and the most common rejection reasons.
            </li>
            <li>
              <Link href="/advertise">Help For Advertisement</Link> — how
              advertising works end to end, what it costs, and what to do about
              a rejected listing.
            </li>
            <li>
              <Link href="/report-scam">How to report a scam</Link> — warning
              signs, staying safe, and what to do if you have already paid
              someone.
            </li>
            <li>
              <Link href="/about">About {SITE.name}</Link> — who we are and why
              every listing is reviewed.
            </li>
          </ul>
          <p>
            Want us to cover something? Email {SITE.email.support} and tell us
            what would help.
          </p>
        </>
      ) : (
        <ul className="not-prose space-y-4">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <p className="mt-1 text-sm text-ink-400">{post.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </InfoPage>
  );
}
