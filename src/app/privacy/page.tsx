import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal";
import { CLUB, SITE } from "@/data/club";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "What ENSIA Tech Community collects when you apply to the club, why, who sees it, and how to have it deleted.",
};

const SECTIONS: LegalSection[] = [
    {
        id: "who",
        title: "Who we are",
        body: (
            <p>
                {SITE.fullName} ({SITE.name}) is a student scientific club of ENSIA, the National
                School of Artificial Intelligence, in Sidi Abdellah, Algiers. ETC is run by student
                volunteers. For anything in this policy, contact us at{" "}
                <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>.
            </p>
        ),
    },
    {
        id: "collect",
        title: "What we collect",
        body: (
            <>
                <p>
                    Browsing the site does not require an account and we collect nothing about you.
                    We only collect personal data when you apply to join the club:
                </p>
                <ul>
                    <li>
                        <b>From your Google account</b>, when you sign in: your name, email address
                        and profile picture. We never see your Google password.
                    </li>
                    <li>
                        <b>From the form</b>: first and last name, school, year of study, phone
                        number, Discord username (optional), up to two links to your work
                        (optional), the cells you rank and why, and your written answers.
                    </li>
                    <li>
                        <b>Added automatically</b>: the date you applied and the season it is for.
                    </li>
                    <li>
                        <b>Added by our team</b> while reviewing: the status of your application,
                        the cell you are assigned to and internal review notes.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "why",
        title: "Why we use it",
        body: (
            <>
                <p>We use your data only to run the recruitment of the club:</p>
                <ul>
                    <li>to read and review your application and choose the right cell for you;</li>
                    <li>to contact you about your application, by email or phone;</li>
                    <li>to make sure each person applies once per season;</li>
                    <li>if you are accepted, to welcome you and organise the work of your cell.</li>
                </ul>
                <p>
                    We do not sell your data, rent it, use it for advertising, or share it with
                    sponsors or partners. We do not use it to make automated decisions about you:
                    every application is read by a person.
                </p>
            </>
        ),
    },
    {
        id: "who-sees",
        title: "Who can see it",
        body: (
            <>
                <p>
                    Your application is visible only to the ETC board and the managers who review
                    applications. Other applicants and visitors cannot see it. Once you are signed
                    in, you can only see whether you have already applied, not other people&apos;s
                    data.
                </p>
                <p>We rely on a few services to run the site:</p>
                <ul>
                    <li>
                        <b>Google</b> handles sign-in.
                    </li>
                    <li>
                        <b>Supabase</b> stores the applications in a protected database.
                    </li>
                    <li>
                        <b>Vercel</b> hosts the website.
                    </li>
                </ul>
                <p>
                    These providers process data on our behalf and may store it on servers outside
                    Algeria.
                </p>
            </>
        ),
    },
    {
        id: "keep",
        title: "How long we keep it",
        body: (
            <p>
                Applications are kept for the season they were sent for and deleted after it ends.
                If you are accepted, we keep your name, contact details and cell for as long as you
                are a member of the club. You can ask us to delete your data sooner at any time.
            </p>
        ),
    },
    {
        id: "browser",
        title: "Cookies and your browser",
        body: (
            <>
                <p>
                    We do not use advertising or analytics cookies, and we do not track you across
                    other sites. The site only stores what it needs to work:
                </p>
                <ul>
                    <li>
                        <b>Sign-in cookies</b>, set when you sign in with Google, to keep you signed
                        in while you fill the form.
                    </li>
                    <li>
                        <b>A draft of your application</b>, saved in your own browser so you do not
                        lose your answers if you leave the page. It never leaves your device until
                        you send the application, and it is cleared once you do.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "rights",
        title: "Your rights",
        body: (
            <>
                <p>You can ask us at any time to:</p>
                <ul>
                    <li>tell you what data we hold about you and send you a copy;</li>
                    <li>correct anything that is wrong;</li>
                    <li>delete your application and your account;</li>
                    <li>stop contacting you.</li>
                </ul>
                <p>
                    Write to <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a> from the address you
                    applied with, and we will answer within 30 days. These rights are also granted
                    by Algerian Law No. 18-07 of 10 June 2018 on the protection of natural persons
                    in the processing of personal data.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "How we protect it",
        body: (
            <p>
                Applications are stored in a database where access rules are enforced on the server:
                an applicant can only write their own application, and only the review team can read
                them. Connections to the site are encrypted. No system is perfectly secure, but if
                we ever learn of a problem affecting your data, we will tell you.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        body: (
            <p>
                If we change how we use your data, we will update this page and the date at the top.
                For significant changes, we will also tell applicants by email. The{" "}
                <Link href="/terms">Terms of Service</Link> cover the rules for using the site.
            </p>
        ),
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="Privacy Policy"
            title={
                <>
                    Your data, <span className="gtext">plainly</span>
                </>
            }
            intro="What we collect when you apply to ETC, why we need it, who sees it, and how to have it deleted. Short version: only what recruitment needs, never sold, never used for ads."
            updated="12 October 2026"
            sections={SECTIONS}
            other={{ href: "/terms", label: "Terms of Service" }}
        />
    );
}
