import Link from "next/link";
import { Footer, Header } from "@/components/sections";
import { CLUB } from "@/data/club";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for /privacy and /terms: title, contents list, numbered sections. */
export function LegalPage({
    eyebrow,
    title,
    intro,
    updated,
    sections,
    other,
}: {
    eyebrow: string;
    title: React.ReactNode;
    intro: React.ReactNode;
    /** Shown as "Last updated", e.g. "12 October 2026". */
    updated: string;
    sections: LegalSection[];
    /** The sibling legal page, linked at the end. */
    other: { href: string; label: string };
}) {
    return (
        <>
            <Header club={CLUB} />
            <main id="main">
                <section
                    style={{
                        background:
                            "radial-gradient(50% 70% at 85% 0%, rgba(18,194,240,.12), transparent 70%)",
                    }}
                >
                    <div
                        className="wrap"
                        style={{
                            paddingTop: 64,
                            paddingBottom: 48,
                            display: "flex",
                            flexDirection: "column",
                            gap: 22,
                        }}
                    >
                        <span className="mono" style={{ color: "var(--cyan)" }}>
                            {eyebrow}
                        </span>
                        <h1
                            className="az"
                            style={{ margin: 0, fontSize: "clamp(40px, 6vw, 84px)" }}
                        >
                            {title}
                        </h1>
                        <p className="lead" style={{ margin: 0, maxWidth: "60ch" }}>
                            {intro}
                        </p>
                        <span className="mono fog">Last updated {updated}</span>
                    </div>
                </section>
                <div className="wrap legal">
                    <nav aria-label="On this page" className="legal-toc">
                        <span className="mono fog">On this page</span>
                        <ol>
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`}>{s.title}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <div className="legal-body">
                        {sections.map((s, i) => (
                            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                                <h2 id={`${s.id}-h`}>
                                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                                    {s.title}
                                </h2>
                                {s.body}
                            </section>
                        ))}
                        <p className="fog legal-end">
                            Questions about this page? Write to{" "}
                            <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>. See also our{" "}
                            <Link href={other.href}>{other.label}</Link>.
                        </p>
                    </div>
                </div>
            </main>
            <Footer club={CLUB} />
        </>
    );
}
