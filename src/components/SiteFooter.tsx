import Link from "next/link";
import { SITE } from "@/lib/site";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] =
  [
    {
      heading: "Legal",
      links: [
        { href: "/terms", label: "Terms and Conditions" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/about", label: "About" },
      ],
    },
    {
      heading: "Support",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/advertise", label: "Help For Advertisement" },
        { href: "/blog", label: "Blog" },
        { href: "/posting-guide", label: "Posting Guide" },
      ],
    },
    {
      heading: "Security",
      links: [
        { href: "/report-scam", label: "How to report a scam" },
        { href: "/gdpr", label: "GDPR" },
      ],
    },
  ];

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-semibold text-ink-100">
                {column.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 transition hover:text-ink-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-semibold text-ink-100">Company</h2>
            <p className="mt-3 text-sm text-ink-400">{SITE.legalEntity}</p>
            <p className="mt-2 text-sm text-ink-400">{SITE.email.support}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-6 text-sm text-ink-400">
          <p>
            © {new Date().getFullYear()} {SITE.legalEntity}. All listings are
            reviewed before they go live.
          </p>
          <p className="mt-2">
            {SITE.name} is a listings directory, not an agency. We are not a
            party to any arrangement made between users.
          </p>
        </div>
      </div>
    </footer>
  );
}
