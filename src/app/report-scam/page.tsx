import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to report a scam",
  description: `How to spot and report a scam on ${SITE.name}, and what to do if you have already lost money.`,
};

export default function ReportScamPage() {
  return (
    <InfoPage
      title="How to report a scam"
      intro="How to recognise a scam, how to report it to us, and what to do if you have already paid someone."
    >
      <h2>Report it to us</h2>
      <p>
        Email <strong>{SITE.email.abuse}</strong> with:
      </p>
      <ul>
        <li>The link to the listing.</li>
        <li>What happened, in date order.</li>
        <li>
          Screenshots of the messages — including the account name or number you
          were asked to pay.
        </li>
        <li>Any amount you sent, and how.</li>
      </ul>
      <p>
        Abuse reports are triaged ahead of general support. We can unpublish a
        listing and suspend an account quickly, and we do so while we
        investigate rather than after.
      </p>

      <h2>Warning signs</h2>
      <ul>
        <li>
          <strong>A deposit before you have met.</strong> This is the single
          most common scam on listing sites. Nobody on {SITE.name} needs money
          up front to hold a slot.
        </li>
        <li>
          <strong>Pressure to move off-site immediately</strong> — to a
          messaging app, before any normal conversation.
        </li>
        <li>
          <strong>Payment by gift card, crypto, or to a third party.</strong>{" "}
          Legitimate businesses do not ask for these, and they are near
          impossible to reverse.
        </li>
        <li>
          <strong>Rates far below everyone else.</strong> If it is well under
          the going rate, ask why.
        </li>
        <li>
          <strong>Photographs that look like stock or a model portfolio.</strong>{" "}
          Run a reverse image search — if the same picture appears on twenty
          sites, it is not theirs.
        </li>
        <li>
          <strong>Refusal to answer plain questions</strong> about
          qualifications, address or what is included.
        </li>
        <li>
          <strong>A story that creates urgency</strong> — an emergency, a slot
          about to be taken, a one-time discount expiring today.
        </li>
      </ul>

      <h2>Staying safe</h2>
      <ul>
        <li>Do not send deposits or advance payments to someone you have not met.</li>
        <li>
          Meet in a public place first where the service allows it, or at a
          registered business address.
        </li>
        <li>Tell someone where you are going and when you expect to be back.</li>
        <li>
          Keep the conversation on record. Screenshots are what let us act.
        </li>
        <li>
          Never share your password, OTP or banking credentials. We will never
          ask for them, and neither will a legitimate advertiser.
        </li>
        <li>
          Verify independently — a real business has a traceable address, phone
          number or registration.
        </li>
      </ul>

      <h2>If you have already paid</h2>
      <ol>
        <li>
          <strong>Contact your bank immediately.</strong> Speed decides whether
          a transfer can be recalled.
        </li>
        <li>
          <strong>Report to the national cybercrime helpline on 1930</strong>{" "}
          (India), or file a complaint at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            cybercrime.gov.in
          </a>
          . The first 24 hours matter most.
        </li>
        <li>
          <strong>Keep every record</strong> — screenshots, transaction IDs,
          phone numbers, the listing URL.
        </li>
        <li>
          <strong>Tell us too</strong>, at {SITE.email.abuse}, so we can remove
          the listing and stop it happening to someone else.
        </li>
      </ol>

      <h2>What we can and cannot do</h2>
      <p>
        We can unpublish listings, suspend accounts, preserve records, and
        cooperate with law enforcement requests. We cannot recover money,
        compel a refund, or act as an arbitrator between you and an advertiser —
        we are not a party to your dealings. See{" "}
        <Link href="/terms">Terms and Conditions</Link> for the detail.
      </p>

      <h2>False reports</h2>
      <p>
        Reporting a competitor to have their listing removed is itself a
        violation and puts your own account at risk. Report what you have
        evidence for.
      </p>
    </InfoPage>
  );
}
