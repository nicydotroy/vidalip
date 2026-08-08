import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE, MIN_AGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Posting Guide",
  description: `A practical guide to writing a listing that gets approved on ${SITE.name} — limits, photo rules and the most common rejection reasons.`,
};

export default function PostingGuidePage() {
  return (
    <InfoPage
      title="Posting Guide"
      intro="What a good listing looks like, the exact limits the form enforces, and the reasons listings get rejected most often."
    >
      <h2>The limits, exactly</h2>
      <p>
        The form rejects anything outside these before it ever reaches a
        moderator, so it is worth knowing them up front.
      </p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Limit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Title</td>
            <td>3–120 characters</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>30–5,000 characters</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>2–120 characters</td>
          </tr>
          <tr>
            <td>Photographs</td>
            <td>Up to 12</td>
          </tr>
          <tr>
            <td>Availability slots</td>
            <td>Up to 21</td>
          </tr>
          <tr>
            <td>Rate</td>
            <td>A positive number, in your chosen currency and unit</td>
          </tr>
        </tbody>
      </table>

      <h2>Writing the title</h2>
      <p>
        The title is what people see on the homepage and in search results. Say
        what you do and where.
      </p>
      <ul>
        <li>
          <strong>Good:</strong> Bridal makeup and hair styling in Bangalore
        </li>
        <li>
          <strong>Good:</strong> Deep tissue massage therapist, Koramangala
        </li>
        <li>
          <strong>Weak:</strong> Best service, low price — says nothing
        </li>
        <li>
          <strong>Rejected:</strong> ALL CAPS, strings of emoji, or a phone
          number instead of a title
        </li>
      </ul>

      <h2>Writing the description</h2>
      <p>Thirty characters is the floor, not the target. Cover:</p>
      <ul>
        <li>What the service actually involves, step by step.</li>
        <li>How long a typical session or booking takes.</li>
        <li>What is included in the rate, and what costs extra.</li>
        <li>Your experience, training or certification.</li>
        <li>Where you work — your premises, the client&apos;s, or both.</li>
      </ul>
      <p>
        Write it as prose. Keyword lists like{" "}
        <em>massage massage best massage Bangalore massage</em> read as spam and
        get rejected.
      </p>

      <h2>Photographs</h2>
      <ul>
        <li>Up to 12 per listing. The first is your cover image.</li>
        <li>
          They must be <strong>yours</strong> — of you, or of work you did.
        </li>
        <li>
          No stock photography, no images taken from other websites or social
          media, no photographs of other people without their consent.
        </li>
        <li>
          Clear and recent beats heavily filtered. People are deciding whether
          to contact you.
        </li>
        <li>No nudity, and nothing sexually suggestive.</li>
      </ul>

      <h2>Rates and availability</h2>
      <p>
        Choose the unit that matches how you genuinely charge — per hour, per
        day, per session or per project. A per-session rate shown as an hourly
        one leads to arguments later, and to complaints we have to act on.
      </p>
      <p>
        Set availability to hours you will actually answer. You can add up to 21
        slots across the week.
      </p>

      <h2>Why listings get rejected</h2>
      <p>In rough order of frequency:</p>
      <ol>
        <li>
          <strong>Description too thin</strong> — a line or two that does not
          describe the service.
        </li>
        <li>
          <strong>Photographs that are not yours</strong> — stock or lifted
          images.
        </li>
        <li>
          <strong>Contact details in the title or description</strong> — put
          them in the contact fields, which is where people expect them.
        </li>
        <li>
          <strong>Wrong category</strong> — a parlor service filed under Model.
        </li>
        <li>
          <strong>Rates that do not add up</strong> — an amount that contradicts
          the description.
        </li>
        <li>
          <strong>Sexual content or implication.</strong> This is not a
          rejection you can edit your way out of — it suspends the account. See{" "}
          <Link href="/terms">Terms and Conditions</Link>.
        </li>
      </ol>

      <h2>After you submit</h2>
      <p>
        Your listing sits at <strong>Pending</strong> until a moderator reads
        it, normally within 48 hours. Approved listings go live immediately.
        Rejected ones show the moderator&apos;s reason in your dashboard — fix
        what it names and resubmit. Editing a live listing sends it back through
        review, so it briefly returns to Pending.
      </p>

      <h2>Ground rules</h2>
      <ul>
        <li>You must be {MIN_AGE} or older to advertise.</li>
        <li>Advertise only services you are lawfully able to provide.</li>
        <li>One listing per service. Do not post duplicates to gain position.</li>
        <li>Keep it accurate — update or remove it when things change.</li>
      </ul>

      <p>
        Practical questions about the process are covered in{" "}
        <Link href="/advertise">Help For Advertisement</Link>. Anything else,{" "}
        <Link href="/contact">get in touch</Link>.
      </p>
    </InfoPage>
  );
}
