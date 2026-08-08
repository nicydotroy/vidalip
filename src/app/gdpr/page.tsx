import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "GDPR",
  description: `How ${SITE.name} handles GDPR rights and requests from users in the EU, EEA and UK.`,
};

export default function GdprPage() {
  return (
    <InfoPage
      title="GDPR"
      intro="If you are in the EU, EEA or UK, this page explains your rights over your personal data and how to exercise them."
      showUpdated
    >
      <h2>Does the GDPR apply to us?</h2>
      <p>
        {SITE.name} is operated from {SITE.country} and aimed primarily at
        Indian cities. Where we monitor or offer services to people in the EU,
        EEA or UK, the GDPR applies to that processing, and we honour the rights
        below regardless of where you are.
      </p>

      <h2>Controller</h2>
      <p>
        {SITE.legalEntity}, {SITE.address}, is the controller. Requests go to{" "}
        {SITE.email.privacy}.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>
          <strong>Access</strong> — a copy of the personal data we hold about
          you.
        </li>
        <li>
          <strong>Rectification</strong> — correction of anything inaccurate or
          incomplete.
        </li>
        <li>
          <strong>Erasure</strong> — deletion, where we have no overriding
          reason to keep it.
        </li>
        <li>
          <strong>Restriction</strong> — pause our use of your data while a
          dispute is resolved.
        </li>
        <li>
          <strong>Portability</strong> — your data in a structured,
          machine-readable format.
        </li>
        <li>
          <strong>Objection</strong> — object to processing based on legitimate
          interests.
        </li>
        <li>
          <strong>Withdraw consent</strong> — at any time, where consent is the
          basis we rely on.
        </li>
      </ul>

      <h2>Legal bases we rely on</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Running your account and publishing your listings</td>
            <td>Contract — Article 6(1)(b)</td>
          </tr>
          <tr>
            <td>Reviewing listings, enforcing rules, preventing abuse</td>
            <td>Legitimate interests — Article 6(1)(f)</td>
          </tr>
          <tr>
            <td>Retaining or disclosing records where the law requires it</td>
            <td>Legal obligation — Article 6(1)(c)</td>
          </tr>
        </tbody>
      </table>

      <h2>Making a request</h2>
      <p>
        Email {SITE.email.privacy} from the address on your account, and say
        which right you are exercising. We respond within one month. That can be
        extended by two further months for complex requests, and we will tell
        you if it is.
      </p>
      <p>
        We may ask you to confirm your identity before acting — this protects
        you from someone else requesting your data. There is no charge unless a
        request is manifestly unfounded or excessive.
      </p>

      <h2>Deleting your account</h2>
      <p>
        Closing your account removes your listings from public view immediately.
        Account data is deleted or anonymised within 90 days. We retain
        moderation and abuse records for up to 3 years where we have a
        legitimate interest in recognising repeat offenders, and we retain
        anything the law requires us to keep.
      </p>

      <h2>International transfers</h2>
      <p>
        Our hosting, database and image storage providers may process data
        outside the EEA and UK. Where they do, transfers are covered by the
        safeguards those providers offer, such as standard contractual clauses.
      </p>

      <h2>Complaints</h2>
      <p>
        Please raise concerns with us first at {SITE.email.privacy} — most are
        resolved quickly. You also have the right to complain to your national
        data protection authority, or to the Information Commissioner&apos;s
        Office if you are in the UK.
      </p>
      <p>
        Our full practices are set out in the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </InfoPage>
  );
}
