import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help For Advertisement",
  description: `How to advertise on ${SITE.name} — creating a listing, how review works, and what to do if a listing is rejected.`,
};

export default function AdvertisePage() {
  return (
    <InfoPage
      title="Help For Advertisement"
      intro="Everything about getting your service listed — from creating an account to what happens after you submit."
    >
      <h2>How it works</h2>
      <ol>
        <li>
          <strong>Create an account.</strong>{" "}
          <Link href="/signup">Sign up</Link> with your name and email. Free, and
          takes a minute.
        </li>
        <li>
          <strong>Write your listing.</strong> Go to{" "}
          <strong>Post a listing</strong> and fill in your title, category,
          description, city, rates and availability, then add photographs.
        </li>
        <li>
          <strong>Submit for review.</strong> The listing is saved as{" "}
          <strong>Pending</strong>. It is not public yet.
        </li>
        <li>
          <strong>A moderator reads it.</strong> They either approve it — at
          which point it appears on the homepage and gets its own page — or
          reject it with a written reason.
        </li>
        <li>
          <strong>Edit and resubmit</strong> as often as you need. Edits to a
          live listing go back through review.
        </li>
      </ol>

      <h2>What it costs</h2>
      <p>
        Posting is currently free. There are no listing fees, no commission on
        bookings, and no paid placement — approved listings are ordered by when
        they were reviewed, not by payment. If that changes we will say so
        clearly before it affects you.
      </p>

      <h2>How long review takes</h2>
      <p>
        Listings are read by a person, not a filter, so allow up to 48 hours.
        Submitting the same listing repeatedly does not speed it up — it just
        adds to the queue.
      </p>

      <h2>Getting approved first time</h2>
      <ul>
        <li>
          <strong>Be specific in the title.</strong> &ldquo;Bridal makeup and
          hair styling in Bangalore&rdquo; beats &ldquo;Best service&rdquo;.
        </li>
        <li>
          <strong>Describe the actual service</strong> — what you do, how long
          it takes, what is included, how much experience you have.
        </li>
        <li>
          <strong>Give honest rates.</strong> Pick the unit that matches how you
          really charge: per hour, per day, per session or per project.
        </li>
        <li>
          <strong>Set real availability.</strong> Enquiries outside your hours
          waste everyone&apos;s time.
        </li>
        <li>
          <strong>Use your own photographs</strong> — of you, or of work you
          did. Stock images and photos taken from elsewhere are rejected.
        </li>
      </ul>
      <p>
        The <Link href="/posting-guide">Posting Guide</Link> goes into more
        detail, including the rejection reasons we issue most often.
      </p>

      <h2>If your listing is rejected</h2>
      <p>
        Open the listing in your dashboard — the moderator&apos;s reason is
        shown on it. Fix what it points at and resubmit. A rejection is not a
        ban, and most rejected listings are approved on the second attempt.
      </p>
      <p>
        If you think a decision was wrong, write to {SITE.email.advertising}{" "}
        with a link to the listing and we will look again.
      </p>

      <h2>What gets an account suspended</h2>
      <p>
        Rejections are routine. Suspension is reserved for serious cases:
        advertising sexual services, content involving anyone under 18,
        impersonating another person, or repeatedly resubmitting content that
        has already been rejected. See the{" "}
        <Link href="/terms">Terms and Conditions</Link> for the full list.
      </p>

      <h2>Still stuck?</h2>
      <p>
        Email {SITE.email.advertising} with your account email and a link to the
        listing, or use <Link href="/contact">Contact Us</Link>.
      </p>
    </InfoPage>
  );
}
