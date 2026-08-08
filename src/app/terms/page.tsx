import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE, MIN_AGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `The terms governing use of ${SITE.name}, for members, advertisers and visitors.`,
};

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms and Conditions"
      intro={`These terms govern your use of ${SITE.name}. By registering, posting a listing or browsing the site, you agree to them.`}
      showUpdated
    >
      <h2>1. Who we are</h2>
      <p>
        {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated by{" "}
        {SITE.legalEntity}, {SITE.address}. We run a directory that lets service
        professionals publish listings and lets visitors browse them.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least {MIN_AGE} years old to create an account, post a
        listing, or contact an advertiser. By using the site you confirm that
        you are. We close accounts where we have reason to believe the holder is
        under {MIN_AGE}.
      </p>

      <h2>3. Accounts</h2>
      <ul>
        <li>
          Give accurate registration details and keep your password to yourself.
        </li>
        <li>
          You are responsible for everything done through your account. Tell us
          immediately if you think someone else has access.
        </li>
        <li>One person, one account. Do not register on someone else&apos;s behalf.</li>
      </ul>

      <h2>4. Listings and review</h2>
      <p>
        Listings do not publish automatically. Every submission enters a review
        queue and is read by a moderator, who either approves it or rejects it
        with a reason. We may also unpublish a listing that is already live.
      </p>
      <p>
        We decide what to approve at our discretion, and we are not obliged to
        publish any listing or to explain a decision beyond the reason given.
        Review is a check against our rules — it is not verification of
        identity, qualifications or licensing, and it is not an endorsement.
      </p>

      <h2>5. What you may not post</h2>
      <p>You may not submit content that:</p>
      <ul>
        <li>
          offers, advertises, solicits or implies sexual services in exchange
          for payment;
        </li>
        <li>
          involves anyone under {MIN_AGE}, or depicts a person in a sexualised
          way;
        </li>
        <li>
          is not yours to post — photographs of other people, copied listing
          text, or images you do not hold the rights to;
        </li>
        <li>
          misstates rates, availability, location, or who is actually providing
          the service;
        </li>
        <li>
          harasses, threatens, defames or discriminates against anyone;
        </li>
        <li>
          promotes illegal goods or services, or is intended to defraud;
        </li>
        <li>
          contains malware, or is used to scrape, overload or interfere with the
          site.
        </li>
      </ul>
      <p>
        Breaching this section results in removal of the listing and, in serious
        or repeated cases, suspension of the account. Where the law requires it,
        we report content to the authorities.
      </p>

      <h2>6. Your content</h2>
      <p>
        You keep ownership of what you post. You grant us a non-exclusive,
        royalty-free licence to host, display, resize and distribute it for the
        purpose of operating and promoting the site. This licence ends when you
        delete the content, except for copies retained in backups or where we
        must keep records by law.
      </p>
      <p>
        You confirm you have the rights to everything you upload, including the
        consent of anyone appearing in a photograph.
      </p>

      <h2>7. Our role</h2>
      <p>
        We are an intermediary. Listings are written by their advertisers, and
        any dealing, booking, payment or meeting that follows is a contract
        between you and them — we are not a party to it. We do not process
        payments between users, and we take no commission on bookings.
      </p>
      <p>
        Take the ordinary precautions you would with any stranger: meet in a
        public place first, do not send deposits to someone you have not met,
        and see our <Link href="/report-scam">scam reporting guide</Link>.
      </p>

      <h2>8. No warranty</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. We do not warrant that
        listings are accurate, that advertisers are qualified or available, or
        that the site will be uninterrupted or error-free.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect or
        consequential loss, lost profits, or loss arising from your dealings
        with another user. Nothing here excludes liability that cannot lawfully
        be excluded, including for death or personal injury caused by our
        negligence, or for fraud.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        You may delete your account at any time. We may suspend or close an
        account that breaches these terms, and we may do so without notice where
        the breach is serious or where the law requires it.
      </p>

      <h2>11. Grievance officer</h2>
      <p>
        In line with the Information Technology (Intermediary Guidelines and
        Digital Media Ethics Code) Rules, 2021, complaints may be sent to:
      </p>
      <ul>
        <li>{SITE.grievanceOfficer.name}</li>
        <li>{SITE.grievanceOfficer.email}</li>
        <li>{SITE.grievanceOfficer.phone}</li>
      </ul>
      <p>
        We acknowledge complaints within 24 hours and aim to resolve them within
        15 days.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these terms. The revision date at the top of this page
        changes when we do, and continued use of the site after that means you
        accept the update.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These terms are governed by the laws of {SITE.country}, and the courts
        at [CITY OF JURISDICTION] have exclusive jurisdiction.
      </p>

      <h2>14. Contact</h2>
      <p>
        Write to <Link href="/contact">Contact Us</Link> or email{" "}
        {SITE.email.support}.
      </p>
    </InfoPage>
  );
}
