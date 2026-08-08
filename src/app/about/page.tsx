import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE, MIN_AGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — a reviewed directory of models, massage and parlor service professionals across India.`,
};

export default function AboutPage() {
  return (
    <InfoPage
      title="About Vidalip"
      intro="A directory where every listing is checked by a person before it goes live."
    >
      <h2>What we do</h2>
      <p>
        {SITE.name} connects people looking for professional services with the
        people who provide them. We cover three categories — models, massage
        services and parlor services — across Bangalore, Hyderabad, Mumbai,
        Delhi, Pune and other Indian cities.
      </p>
      <p>
        We are a listings platform, not an agency. We do not employ, represent,
        supervise or take a commission from the professionals listed here. Every
        arrangement is made directly between the advertiser and the person
        contacting them.
      </p>

      <h2>Why listings are reviewed</h2>
      <p>
        Anyone can register and submit a listing, but nothing appears publicly
        until a moderator has read it. A submission sits in a{" "}
        <strong>Pending</strong> queue, and a moderator either approves it or
        rejects it with a written reason the advertiser can see and act on.
      </p>
      <p>
        Review is a filter, not a guarantee. We check that a listing follows our
        rules and looks plausible. We do not verify professional
        qualifications, licences or identity documents, and an approved listing
        should not be read as an endorsement.
      </p>

      <h2>Our rules, in short</h2>
      <ul>
        <li>
          Advertisers and members must be {MIN_AGE} or older. No exceptions.
        </li>
        <li>
          Listings must describe a lawful professional service, with honest
          rates and availability.
        </li>
        <li>
          Photographs must be of the advertiser and must be ones they hold the
          rights to.
        </li>
        <li>
          No sexual services, no content suggesting them, and no content
          involving minors. Listings of this kind are removed and the account is
          suspended.
        </li>
      </ul>
      <p>
        The full version lives in our{" "}
        <Link href="/terms">Terms and Conditions</Link>, and the practical guide
        to getting approved is in the{" "}
        <Link href="/posting-guide">Posting Guide</Link>.
      </p>

      <h2>Who runs it</h2>
      <p>
        {SITE.name} is operated by {SITE.legalEntity}, {SITE.address}.
      </p>
      <p>
        Questions go to <Link href="/contact">Contact Us</Link>. If something on
        the site looks like a scam, please{" "}
        <Link href="/report-scam">report it</Link> — those reports are how we
        find the listings our review missed.
      </p>
    </InfoPage>
  );
}
