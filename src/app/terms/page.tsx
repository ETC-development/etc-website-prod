import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal";
import { CLUB, SITE } from "@/data/club";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "The rules for using the ENSIA Tech Community website and applying to join the club.",
};

const SECTIONS: LegalSection[] = [
    {
        id: "about",
        title: "About these terms",
        body: (
            <p>
                This website is run by {SITE.fullName} ({SITE.name}), a student scientific club of
                ENSIA, the National School of Artificial Intelligence, in Sidi Abdellah, Algiers. By
                using the site or applying to join the club, you agree to these terms. If you do not
                agree, please do not use the site.
            </p>
        ),
    },
    {
        id: "site",
        title: "Using the site",
        body: (
            <>
                <p>You can browse the site freely. When you use it, you agree not to:</p>
                <ul>
                    <li>try to access data, accounts or parts of the site that are not yours;</li>
                    <li>disrupt the site, overload it, or probe it for weaknesses;</li>
                    <li>collect data from it automatically, or send spam through it;</li>
                    <li>pretend to be someone else, or use the site for anything unlawful.</li>
                </ul>
                <p>
                    If you find a security problem, please tell us at{" "}
                    <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a> instead of using it.
                </p>
            </>
        ),
    },
    {
        id: "signin",
        title: "Signing in with Google",
        body: (
            <p>
                To apply, you sign in with a Google account. You are responsible for the account you
                use and for what is sent from it. Use an account you control, and sign out on shared
                computers. We only use your sign-in to identify your application, as explained in
                the <Link href="/privacy">Privacy Policy</Link>.
            </p>
        ),
    },
    {
        id: "applying",
        title: "Applying to the club",
        body: (
            <ul>
                <li>
                    <b>One application per person per season.</b> Applications can only be sent
                    while registrations are open.
                </li>
                <li>
                    <b>Your answers must be your own and true.</b> Applications that copy someone
                    else&apos;s work or contain false information may be rejected.
                </li>
                <li>
                    <b>Applying does not guarantee a place.</b> The team reads every application and
                    decides who joins and in which cell. Decisions are final for the season, and you
                    are welcome to apply again the next one.
                </li>
                <li>
                    <b>We may contact you</b> by email or phone about your application, for example
                    to invite you to an interview.
                </li>
            </ul>
        ),
    },
    {
        id: "content",
        title: "What you send us",
        body: (
            <p>
                Your answers and the links you share stay yours. By sending them, you allow the ETC
                team to store and read them in order to review your application, and nothing else.
                Please do not send anything you are not allowed to share, or anything offensive.
            </p>
        ),
    },
    {
        id: "ours",
        title: "Our content",
        body: (
            <p>
                The ETC name, logos, mascots, illustrations, photos and texts on this site belong to
                the club or to the people who made them. You may share links to the site and talk
                about the club, but please ask us before reusing our visual identity or content.
                Partner and sponsor logos belong to their owners. Links to other websites are
                provided for convenience and we are not responsible for their content.
            </p>
        ),
    },
    {
        id: "warranty",
        title: "No guarantees",
        body: (
            <p>
                ETC is run by student volunteers. We do our best to keep the site accurate and
                available, but it is provided as it is, without guarantees. Event dates, programmes
                and openings can change. To the extent the law allows, the club is not liable for
                losses that come from using the site or from it being unavailable.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes and contact",
        body: (
            <p>
                We may update these terms, for example when the application process changes. The
                date at the top shows the latest version. These terms are governed by Algerian law.
                For any question, write to <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>.
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            eyebrow="Terms of Service"
            title={
                <>
                    The <span className="gtext">ground rules</span>
                </>
            }
            intro="The rules for using this site and applying to ETC. Short version: be honest in your application, one application per season, and do not try to break the site."
            updated="12 October 2026"
            sections={SECTIONS}
            other={{ href: "/privacy", label: "Privacy Policy" }}
        />
    );
}
