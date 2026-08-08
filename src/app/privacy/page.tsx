import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE, MIN_AGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects personal data.`,
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="What we collect, why we collect it, how long we keep it, and what you can ask us to do with it."
      showUpdated
    >
      <h2>Who is responsible</h2>
      <p>
        {SITE.legalEntity}, {SITE.address}, is the data fiduciary (under
        India&apos;s Digital Personal Data Protection Act, 2023) and data
        controller (under the GDPR) for personal data processed through{" "}
        {SITE.name}. Privacy questions go to {SITE.email.privacy}.
      </p>

      <h2>What we collect</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Where it comes from</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name, email address, password (stored hashed, never in plain text)</td>
            <td>You, at registration</td>
          </tr>
          <tr>
            <td>
              Listing content — title, description, category, location, rates,
              availability, photographs
            </td>
            <td>You, when you post</td>
          </tr>
          <tr>
            <td>Moderation record — approval or rejection, reason, reviewer, timestamp</td>
            <td>Generated when a moderator reviews your listing</td>
          </tr>
          <tr>
            <td>Session cookie</td>
            <td>Set when you log in</td>
          </tr>
          <tr>
            <td>Server logs — IP address, browser, pages requested, timestamps</td>
            <td>Automatically, when you use the site</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not collect payment card details, because we do not process
        payments. We do not knowingly collect data from anyone under {MIN_AGE}.
      </p>

      <h2>Why we use it, and on what basis</h2>
      <ul>
        <li>
          <strong>To run your account and publish your listings</strong> —
          performance of our contract with you.
        </li>
        <li>
          <strong>To review listings and enforce our rules</strong> — our
          legitimate interest in keeping the directory safe and lawful.
        </li>
        <li>
          <strong>To keep the service secure and investigate abuse</strong> —
          legitimate interest, and legal obligation where we must retain or
          disclose records.
        </li>
        <li>
          <strong>To respond when you contact us</strong> — legitimate interest
          in answering you.
        </li>
      </ul>
      <p>
        We do not sell personal data, and we do not use it for automated
        decision-making that produces legal effects.
      </p>

      <h2>What is public</h2>
      <p>
        An approved listing is public. Its title, description, category,
        location, rates, availability, photographs and the display name of its
        owner are visible to anyone, and can be indexed by search engines. Your
        email address and password are never shown publicly. Treat anything you
        type into a listing as published.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Hosting and infrastructure</strong> — our application host and
          database provider, who process data on our instructions.
        </li>
        <li>
          <strong>Image storage</strong> — uploaded photographs are stored with
          our file storage provider.
        </li>
        <li>
          <strong>Authorities</strong> — where we are legally required to
          disclose, or where disclosure is necessary to protect someone from
          harm.
        </li>
      </ul>
      <p>
        Some providers operate outside {SITE.country}. Where data leaves the
        country we rely on the transfer safeguards those providers offer, such
        as standard contractual clauses.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          <strong>Account data</strong> — while your account is open, then
          deleted or anonymised within 90 days of closure.
        </li>
        <li>
          <strong>Listings</strong> — until you delete them or your account
          closes.
        </li>
        <li>
          <strong>Moderation and abuse records</strong> — up to 3 years, so that
          repeat offenders can be recognised.
        </li>
        <li>
          <strong>Server logs</strong> — typically 30 to 90 days.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Passwords are hashed with bcrypt and are not recoverable by us or by
        anyone with database access. Traffic is served over HTTPS, and database
        connections are encrypted. Administrative functions are restricted to
        moderator accounts, and every approval and rejection is attributed to
        the moderator who made it. No system is perfectly secure, so please use
        a password you do not reuse elsewhere.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to give you a copy of your data, correct it, delete it,
        restrict or object to how we use it, or provide it in a portable format.
        Where we rely on consent, you can withdraw it at any time. Under the
        DPDP Act you may also nominate someone to exercise these rights on your
        behalf if you die or become incapacitated.
      </p>
      <p>
        Email {SITE.email.privacy} and we will respond within 30 days. If you
        are in the EU or UK, see our <Link href="/gdpr">GDPR page</Link> for how
        these rights apply and how to complain to a supervisory authority.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of cookies, described in our{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>Complaints</h2>
      <p>
        Our grievance officer is {SITE.grievanceOfficer.name}, reachable at{" "}
        {SITE.grievanceOfficer.email} or {SITE.grievanceOfficer.phone}. We
        acknowledge complaints within 24 hours and aim to resolve them within 15
        days.
      </p>

      <h2>Changes</h2>
      <p>
        We will update this page when our practices change and revise the date
        at the top. Material changes will be announced on the site.
      </p>
    </InfoPage>
  );
}
