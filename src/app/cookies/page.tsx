import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `The cookies ${SITE.name} sets, what each one does, and how to control them.`,
};

export default function CookiesPage() {
  return (
    <InfoPage
      title="Cookie Policy"
      intro="We use a small number of cookies, all of them necessary to run the site. We do not use advertising or tracking cookies."
      showUpdated
    >
      <h2>What cookies are</h2>
      <p>
        A cookie is a small text file a website stores in your browser. It lets
        the site recognise your browser on the next request — which is how you
        stay logged in as you move between pages.
      </p>

      <h2>The cookies we set</h2>
      <p>
        All of these are <strong>strictly necessary</strong>. The site cannot
        keep you signed in or protect your forms without them.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session token</td>
            <td>
              Keeps you signed in and identifies your account on each request.
              Set only after you log in.
            </td>
            <td>30 days</td>
          </tr>
          <tr>
            <td>CSRF token</td>
            <td>
              Protects login and account forms against cross-site request
              forgery.
            </td>
            <td>Session</td>
          </tr>
          <tr>
            <td>Callback URL</td>
            <td>
              Remembers where to return you after signing in.
            </td>
            <td>Session</td>
          </tr>
        </tbody>
      </table>

      <h2>What we do not use</h2>
      <ul>
        <li>No advertising or retargeting cookies.</li>
        <li>No third-party analytics or tracking pixels.</li>
        <li>No social media embeds that set cookies.</li>
        <li>No cross-site profiling of any kind.</li>
      </ul>
      <p>
        Because we only set strictly necessary cookies, we do not show a consent
        banner — under both the GDPR and the ePrivacy rules, cookies essential
        to a service the user has requested do not require consent. If we ever
        add analytics, we will ask first and update this page.
      </p>

      <h2>Controlling cookies</h2>
      <p>
        You can delete or block cookies in your browser settings. Blocking ours
        will not stop you browsing listings, but you will not be able to stay
        logged in, post a listing or use the moderation tools.
      </p>
      <p>
        Signing out clears your session cookie immediately.
      </p>

      <h2>Related</h2>
      <p>
        For the wider picture of what we collect and why, see our{" "}
        <Link href="/privacy">Privacy Policy</Link>. Questions to{" "}
        {SITE.email.privacy}.
      </p>
    </InfoPage>
  );
}
