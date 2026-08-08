import { SITE } from "@/lib/site";

/**
 * Shared shell for the legal, support and security pages. Keeps one place to
 * change the reading width, heading treatment and "last updated" line rather
 * than repeating it across a dozen near-identical files.
 */
export default function InfoPage({
  title,
  intro,
  showUpdated = false,
  children,
}: {
  title: string;
  intro?: string;
  /** Policy pages show a revision date; support pages generally should not. */
  showUpdated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="border-b border-ink-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 text-ink-300">{intro}</p>}
        {showUpdated && (
          <p className="mt-4 text-xs text-ink-400">
            Last updated {SITE.lastUpdated}
          </p>
        )}
      </header>

      <div className="prose-page mt-8">{children}</div>
    </div>
  );
}
