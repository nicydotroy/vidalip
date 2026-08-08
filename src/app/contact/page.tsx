import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `How to reach the ${SITE.name} team — support, privacy, advertising and complaints.`,
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Us"
      intro="Pick the address that matches what you need — it reaches the right person faster than a general enquiry."
    >
      <h2>Where to write</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              General support — accounts, logging in, problems with a listing
            </td>
            <td>{SITE.email.support}</td>
          </tr>
          <tr>
            <td>
              Advertising — posting, approvals, rejected listings
            </td>
            <td>{SITE.email.advertising}</td>
          </tr>
          <tr>
            <td>
              Privacy — access, correction or deletion of your data
            </td>
            <td>{SITE.email.privacy}</td>
          </tr>
          <tr>
            <td>
              Abuse and safety — scams, impersonation, illegal content
            </td>
            <td>{SITE.email.abuse}</td>
          </tr>
        </tbody>
      </table>

      <h2>Complaints</h2>
      <p>
        If you are not satisfied with how we have handled something, our
        grievance officer is:
      </p>
      <ul>
        <li>{SITE.grievanceOfficer.name}</li>
        <li>{SITE.grievanceOfficer.email}</li>
        <li>{SITE.grievanceOfficer.phone}</li>
      </ul>
      <p>
        We acknowledge complaints within 24 hours and aim to resolve them within
        15 days, in line with the IT Rules 2021.
      </p>

      <h2>Postal address</h2>
      <p>
        {SITE.legalEntity}
        <br />
        {SITE.address}
      </p>

      <h2>Before you write</h2>
      <p>A few things answer themselves faster than we can:</p>
      <ul>
        <li>
          <strong>Listing rejected?</strong> The rejection reason is shown on
          the listing in your dashboard. The{" "}
          <Link href="/posting-guide">Posting Guide</Link> covers the common
          causes.
        </li>
        <li>
          <strong>Listing still pending?</strong> Every listing is read by a
          person, so allow up to 48 hours before chasing.
        </li>
        <li>
          <strong>Think something is a scam?</strong> Use the{" "}
          <Link href="/report-scam">scam reporting steps</Link> — those reports
          are triaged ahead of general support.
        </li>
        <li>
          <strong>Want your data or account deleted?</strong> See{" "}
          <Link href="/privacy">Privacy Policy</Link> or, if you are in the EU
          or UK, the <Link href="/gdpr">GDPR page</Link>.
        </li>
      </ul>

      <p>
        When you write, include your account email and a link to the listing if
        there is one. It saves a round trip.
      </p>
    </InfoPage>
  );
}
