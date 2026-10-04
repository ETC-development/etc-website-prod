"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import { Arrow, Check, Icon, Lockup, Social } from "@/components/ui";
import { APPLY_CELLS, LEVELS, SCHOOLS, type Level, type School } from "@/data/cells";
import { REGISTRATION, SITE } from "@/data/club";

type Form = {
    first: string;
    last: string;
    school: School | "";
    schoolOther: string;
    level: Level | "";
    phone: string;
    discord: string;
    link1: string;
    link2: string;
    ranks: number[];
    mot: Record<number, string>;
    made: string;
    about: string;
    why: string;
    agreed: boolean;
};
const EMPTY: Form = {
    first: "",
    last: "",
    school: "",
    schoolOther: "",
    level: "",
    phone: "",
    discord: "",
    link1: "",
    link2: "",
    ranks: [],
    mot: {},
    made: "",
    about: "",
    why: "",
    agreed: false,
};
const DRAFT_KEY = "etc-application-draft-2026";

// Every rule below is repeated as a CHECK constraint in supabase/applications.sql.
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const wordsBetween = (s: string, min: number) => words(s) >= min && words(s) <= 300;
const cleanText = (s: string) => s.normalize("NFC").trim().replace(/\s+/g, " ");
const okName = (s: string) => /^\p{L}[\p{L}' -]{1,39}$/u.test(cleanText(s));
const okSchoolOther = (s: string) => cleanText(s).length >= 2 && cleanText(s).length <= 120;
const normPhone = (s: string) => s.replace(/[\s.-]/g, "");
const okPhone = (s: string) => /^0[567]\d{8}$/.test(normPhone(s));
const okDiscord = (s: string) => !s.trim() || (s.trim().length >= 2 && s.trim().length <= 40);
const normUrl = (s: string) => (/^https?:\/\//i.test(s.trim()) ? s.trim() : `https://${s.trim()}`);
const okUrl = (s: string) => {
    if (!s.trim()) return true;
    try {
        const u = new URL(normUrl(s));
        return u.hostname.includes(".") && !/\s/.test(s.trim()) && normUrl(s).length <= 300;
    } catch {
        return false;
    }
};

const STEPS = [
    ["You", "Google, name, school, contact"],
    ["Cells", "Rank up to three"],
    ["Your work", "Three short answers"],
    ["Review", "Check and send"],
];
const TIPS = [
    "Hi! Sign in with Google. Your student email is best if you have one.",
    "Your first choice counts most. A second and third are optional.",
    "We decide from what you write, so be specific: name a project, an event, a design.",
    "Last check. You can still go back and edit before you send.",
];
const BOTS = [
    "/mascots/bot-hi.svg",
    "/mascots/bot-card.svg",
    "/mascots/bot-phone.svg",
    "/mascots/bot-card.svg",
];

const supabaseReady = () =>
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function RegisterFlow({ discordInvite }: { discordInvite: string }) {
    const [step, setStep] = useState(1);
    const [f, setF] = useState<Form>(EMPTY);
    const [tried, setTried] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [applied, setApplied] = useState(false);
    const [authError, setAuthError] = useState("");
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState("");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(DRAFT_KEY);
            // Restored after mount on purpose: reading storage during render breaks hydration.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setF({ ...EMPTY, ...JSON.parse(saved) });
        } catch {
            /* private mode: start empty */
        }
        if (!supabaseReady()) return;
        const supabase = createClientSupabaseClient();
        supabase.auth
            .getUser()
            .then(async ({ data }) => {
                setUser(data.user);
                if (!data.user) return;
                // One application per person per season: send returning applicants to the end.
                const [{ data: settings }, { data: mine }] = await Promise.all([
                    supabase.from("registration_settings").select("season").maybeSingle(),
                    supabase.from("applications").select("season"),
                ]);
                if (settings && mine?.some((a) => a.season === settings.season)) setApplied(true);
            })
            .catch(() => setUser(null));
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
        } catch {
            /* ignore */
        }
    }, [f]);

    const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

    const err = {
        google: tried && !user,
        first: tried && !okName(f.first),
        last: tried && !okName(f.last),
        school: tried && !f.school,
        schoolOther: tried && f.school === "Other" && !okSchoolOther(f.schoolOther),
        level: tried && !f.level,
        phone: tried && !okPhone(f.phone),
        discord: tried && !okDiscord(f.discord),
        link1: tried && !okUrl(f.link1),
        link2: tried && !okUrl(f.link2),
        ranks: tried && f.ranks.length < 1,
        mot: (i: number) => tried && !wordsBetween(f.mot[f.ranks[i]] ?? "", 10),
        made: tried && !wordsBetween(f.made, 15),
        about: tried && !wordsBetween(f.about, 15),
        why: tried && !wordsBetween(f.why, 15),
        agreed: tried && !f.agreed,
    };
    const valid = (s: number) =>
        s === 1
            ? Boolean(user) &&
              okName(f.first) &&
              okName(f.last) &&
              Boolean(f.school) &&
              (f.school !== "Other" || okSchoolOther(f.schoolOther)) &&
              Boolean(f.level) &&
              okPhone(f.phone) &&
              okDiscord(f.discord) &&
              okUrl(f.link1) &&
              okUrl(f.link2)
            : s === 2
              ? f.ranks.length >= 1 && f.ranks.every((r) => wordsBetween(f.mot[r] ?? "", 10))
              : s === 3
                ? wordsBetween(f.made, 15) && wordsBetween(f.about, 15) && wordsBetween(f.why, 15)
                : f.agreed;

    async function signIn() {
        setAuthError("");
        if (!supabaseReady()) return setAuthError("Sign-in is not configured on this environment.");
        const { error } = await createClientSupabaseClient().auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                // Always show the account picker, so people can choose their student account.
                queryParams: { prompt: "select_account" },
            },
        });
        if (error) setAuthError("Google sign-in failed. Please try again.");
    }
    async function signOut() {
        if (supabaseReady()) await createClientSupabaseClient().auth.signOut();
        setUser(null);
        setApplied(false);
    }

    async function submit() {
        setSending(true);
        setSendError("");
        const cell = (i: number) => (i < f.ranks.length ? APPLY_CELLS[f.ranks[i]].key : null);
        const mot = (i: number) => (i < f.ranks.length ? (f.mot[f.ranks[i]] ?? "").trim() : null);
        const link = (s: string) => (s.trim() ? normUrl(s) : null);
        const row: Database["public"]["Tables"]["applications"]["Insert"] = {
            first_name: cleanText(f.first),
            last_name: cleanText(f.last).toUpperCase(),
            school: f.school as School,
            school_other: f.school === "Other" ? cleanText(f.schoolOther) : null,
            level: f.level as Level,
            phone: normPhone(f.phone),
            discord: f.discord.trim() || null,
            link_1: link(f.link1),
            link_2: link(f.link2),
            choice_1: cell(0)!,
            motivation_1: mot(0)!,
            choice_2: cell(1),
            motivation_2: mot(1),
            choice_3: cell(2),
            motivation_3: mot(2),
            made: f.made.trim(),
            about: f.about.trim(),
            why: f.why.trim(),
        };
        try {
            const { error } = await createClientSupabaseClient().from("applications").insert(row);
            if (error) {
                console.error("Application error:", error);
                setSendError(
                    error.code === "23505"
                        ? "You have already applied this season."
                        : error.code === "42501"
                          ? "Applications are closed right now."
                          : error.code === "23514"
                            ? "One of your answers did not pass our checks. Go back through the steps and try again."
                            : "We could not send your application. Please try again.",
                );
            } else {
                localStorage.removeItem(DRAFT_KEY);
                setStep(5);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (e) {
            console.error(e);
            setSendError("We could not reach the server. Check your connection and try again.");
        }
        setSending(false);
    }

    function next() {
        if (!valid(step)) {
            setTried(true);
            return;
        }
        setTried(false);
        if (step === 4) submit();
        else {
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
    const go = (s: number) => {
        setTried(false);
        setStep(s);
    };

    if (applied) return <Done email={user?.email ?? ""} discordInvite={discordInvite} already />;
    if (step === 5) return <Done email={user?.email ?? ""} discordInvite={discordInvite} />;

    const sidx = step - 1;
    const avatar = (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) as
        string | undefined;
    return (
        <div className="rg-grid">
            <aside className="aside" aria-label="Registration progress">
                <img
                    src="/brand/etc-emblem.webp"
                    alt=""
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        right: -140,
                        bottom: -120,
                        width: 420,
                        opacity: 0.06,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 36,
                        position: "relative",
                    }}
                >
                    <div
                        className="intro"
                        style={{ display: "flex", flexDirection: "column", gap: 10 }}
                    >
                        <span className="az" style={{ fontSize: 30 }}>
                            Join <span className="gtext">ETC</span>
                        </span>
                        <span className="fog" style={{ fontSize: 15 }}>
                            About 10 minutes. Your answers save on this device as you go.
                        </span>
                    </div>
                    <ol className="steps">
                        {STEPS.map(([t, s], i) => (
                            <li
                                key={t}
                                className="st"
                                data-state={i < sidx ? "done" : i === sidx ? "now" : "todo"}
                                aria-current={i === sidx ? "step" : undefined}
                            >
                                <span className="bar" aria-hidden="true" />
                                <span className="dot" aria-hidden="true">
                                    {i < sidx && <Check />}
                                </span>
                                <span style={{ display: "flex", flexDirection: "column" }}>
                                    <span className="t">{t}</span>
                                    <span className="s">{s}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
                <div
                    className="bot-zone"
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        alignItems: "flex-start",
                    }}
                >
                    <p className="tip">{TIPS[sidx]}</p>
                    <img
                        className="bot bob"
                        src={BOTS[sidx]}
                        alt=""
                        style={{ width: 170, height: "auto", marginLeft: 12 }}
                    />
                </div>
            </aside>

            <main id="main" className="rg-main">
                {step === 1 && (
                    <div
                        className="rise"
                        style={{ display: "flex", flexDirection: "column", gap: 32 }}
                    >
                        <Heading n={1} a="Who are" b="you?" />
                        <div className="fld">
                            <span className="lbl">Google account</span>
                            {user ? (
                                <div className="connect" data-ok="true">
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            minWidth: 0,
                                        }}
                                    >
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt=""
                                                width={44}
                                                height={44}
                                                referrerPolicy="no-referrer"
                                                style={{ borderRadius: "50%" }}
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    width: 44,
                                                    height: 44,
                                                    flex: "none",
                                                    borderRadius: "50%",
                                                    background: "var(--grad)",
                                                }}
                                            />
                                        )}
                                        <span
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                minWidth: 0,
                                            }}
                                        >
                                            <b style={{ overflowWrap: "anywhere" }}>{user.email}</b>
                                            <span
                                                className="help"
                                                style={{ color: "var(--signal)" }}
                                            >
                                                Signed in
                                            </span>
                                        </span>
                                    </span>
                                    <button
                                        className="btn btn-line"
                                        style={{ minHeight: 44 }}
                                        onClick={signOut}
                                    >
                                        Switch account
                                    </button>
                                </div>
                            ) : (
                                <div className="connect">
                                    <span
                                        style={{ display: "flex", flexDirection: "column", gap: 4 }}
                                    >
                                        <b>Sign in with Google</b>
                                        <span className="help">
                                            Use your student email if you have one. Students from
                                            every school can apply.
                                        </span>
                                    </span>
                                    <button className="btn btn-google" onClick={signIn}>
                                        <Social name="google" size={20} />
                                        Sign in
                                    </button>
                                </div>
                            )}
                            {(err.google || authError) && (
                                <span className="err" role="alert">
                                    {authError || "Sign in with Google to continue."}
                                </span>
                            )}
                        </div>
                        <div className="g2">
                            <Field
                                id="f-first"
                                label="First name"
                                value={f.first}
                                onChange={(v) => set("first", v)}
                                bad={err.first}
                                error="Enter your first name, letters only."
                                autoComplete="given-name"
                            />
                            <Field
                                id="f-last"
                                label="Family name"
                                value={f.last}
                                onChange={(v) => set("last", v.toUpperCase())}
                                bad={err.last}
                                error="Enter your family name, letters only."
                                autoComplete="family-name"
                            />
                        </div>
                        <Choice
                            id="school"
                            label="Your school"
                            options={SCHOOLS}
                            value={f.school}
                            onChange={(v) => set("school", v)}
                            bad={err.school}
                            error="Pick your school."
                        />
                        {f.school === "Other" && (
                            <Field
                                id="f-school"
                                label="School name"
                                value={f.schoolOther}
                                onChange={(v) => set("schoolOther", v)}
                                bad={err.schoolOther}
                                error="Enter the name of your school."
                                autoComplete="organization"
                            />
                        )}
                        <Choice
                            id="level"
                            label="Your year"
                            options={LEVELS}
                            value={f.level}
                            onChange={(v) => set("level", v)}
                            bad={err.level}
                            error="Pick your year."
                        />
                        <div className="g2">
                            <Field
                                id="f-phone"
                                label="Phone number"
                                type="tel"
                                inputMode="tel"
                                value={f.phone}
                                onChange={(v) => set("phone", v)}
                                bad={err.phone}
                                error="Use a mobile number: 05, 06 or 07 followed by 8 digits."
                                help="05, 06 or 07 followed by 8 digits."
                                placeholder="0555 12 34 56"
                                autoComplete="tel-national"
                            />
                            <Field
                                id="f-discord"
                                label="Discord username (optional)"
                                value={f.discord}
                                onChange={(v) => set("discord", v)}
                                bad={err.discord}
                                error="Between 2 and 40 characters."
                                placeholder="yourname"
                            />
                        </div>
                        <div className="g2">
                            <Field
                                id="f-link1"
                                label="Link 1 (optional)"
                                type="url"
                                inputMode="url"
                                value={f.link1}
                                onChange={(v) => set("link1", v)}
                                bad={err.link1}
                                error="Enter a full link, like github.com/yourname."
                                help="GitHub, LinkedIn, Behance, a portfolio..."
                                placeholder="github.com/yourname"
                            />
                            <Field
                                id="f-link2"
                                label="Link 2 (optional)"
                                type="url"
                                inputMode="url"
                                value={f.link2}
                                onChange={(v) => set("link2", v)}
                                bad={err.link2}
                                error="Enter a full link, like linkedin.com/in/yourname."
                                placeholder="linkedin.com/in/yourname"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div
                        className="rise"
                        style={{ display: "flex", flexDirection: "column", gap: 32 }}
                    >
                        <Heading
                            n={2}
                            a="Pick your"
                            b="cells"
                            sub="Tap up to three in order of preference. Only the first is required. Tap again to remove one."
                        />
                        <div className="dgrid">
                            {APPLY_CELLS.map((d, i) => {
                                const r = f.ranks.indexOf(i);
                                return (
                                    <button
                                        key={d.key}
                                        className="dc"
                                        aria-pressed={r >= 0}
                                        aria-label={`${d.name}${r >= 0 ? `, choice ${r + 1}` : ""}`}
                                        onClick={() =>
                                            set(
                                                "ranks",
                                                r >= 0
                                                    ? f.ranks.filter((x) => x !== i)
                                                    : f.ranks.length < 3
                                                      ? [...f.ranks, i]
                                                      : f.ranks,
                                            )
                                        }
                                    >
                                        <Icon name={d.icon} variant="g" size={36} />
                                        <span
                                            style={{
                                                fontWeight: 800,
                                                fontSize: 17,
                                                fontStretch: "110%",
                                            }}
                                        >
                                            {d.name}
                                        </span>
                                        <span className="help" style={{ fontSize: 13 }}>
                                            {d.tag}
                                        </span>
                                        {r >= 0 && <span className="rk">{r + 1}</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {err.ranks && (
                            <span className="err" role="alert">
                                Pick at least one cell to continue.
                            </span>
                        )}
                        {f.ranks.map((di, k) => (
                            <Field
                                key={di}
                                id={`mot-${di}`}
                                area
                                label={`Choice ${k + 1}: why ${APPLY_CELLS[di].name}?`}
                                value={f.mot[di] ?? ""}
                                onChange={(v) => set("mot", { ...f.mot, [di]: v })}
                                bad={err.mot(k)}
                                error="Write between 10 and 300 words."
                                placeholder={`What would you like to do in ${APPLY_CELLS[di].name}?`}
                                help="A few honest sentences beat a long essay. 10 words minimum."
                                count
                            />
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div
                        className="rise"
                        style={{ display: "flex", flexDirection: "column", gap: 32 }}
                    >
                        <Heading
                            n={3}
                            a="Show us"
                            b="your work"
                            sub="We decide from these answers alone, so be concrete. 15 words minimum each."
                        />
                        <Field
                            id="f-made"
                            area
                            label="Something you made"
                            value={f.made}
                            onChange={(v) => set("made", v)}
                            bad={err.made}
                            error="Write between 15 and 300 words."
                            placeholder="A project, an event, a design, a video... What was it, and what was your part?"
                            help="School projects count. Put a link in step 1 if there is one."
                            count
                        />
                        <Field
                            id="f-about"
                            area
                            label="Describe yourself"
                            value={f.about}
                            onChange={(v) => set("about", v)}
                            bad={err.about}
                            error="Write between 15 and 300 words."
                            placeholder="What do you like doing? What are you learning right now?"
                            help="Clubs, hobbies, side projects: all of it counts."
                            count
                        />
                        <Field
                            id="f-why"
                            area
                            label="Why should we pick you?"
                            value={f.why}
                            onChange={(v) => set("why", v)}
                            bad={err.why}
                            error="Write between 15 and 300 words."
                            placeholder="What will you bring to ETC this season?"
                            help="Be specific. Name an event, a project or a skill."
                            count
                        />
                    </div>
                )}

                {step === 4 && (
                    <div
                        className="rise"
                        style={{ display: "flex", flexDirection: "column", gap: 28 }}
                    >
                        <Heading n={4} a="One last" b="look" />
                        <div style={{ borderTop: "1px solid var(--line)" }}>
                            <Review label="Identity" onEdit={() => go(1)}>
                                <b>
                                    {cleanText(f.first)} {cleanText(f.last).toUpperCase()}
                                </b>
                                <span className="fog" style={{ overflowWrap: "anywhere" }}>
                                    {user?.email}
                                </span>
                                <span className="fog">
                                    {f.school === "Other" ? cleanText(f.schoolOther) : f.school},{" "}
                                    {f.level}, {normPhone(f.phone)}
                                </span>
                                {f.discord.trim() && (
                                    <span className="fog">Discord: {f.discord.trim()}</span>
                                )}
                                {[f.link1, f.link2]
                                    .filter((l) => l.trim())
                                    .map((l) => (
                                        <span
                                            key={l}
                                            className="fog"
                                            style={{ overflowWrap: "anywhere" }}
                                        >
                                            {normUrl(l)}
                                        </span>
                                    ))}
                            </Review>
                            <Review label="Cells" onEdit={() => go(2)}>
                                <span style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {f.ranks.map((di, k) => (
                                        <span
                                            key={di}
                                            className="chip"
                                            style={{ fontSize: 14, minHeight: 36 }}
                                        >
                                            <span
                                                className="az gtext"
                                                style={{ fontSize: 13, marginRight: 8 }}
                                            >
                                                {k + 1}
                                            </span>
                                            {APPLY_CELLS[di].name}
                                        </span>
                                    ))}
                                </span>
                            </Review>
                            <Review label="Your work" onEdit={() => go(3)}>
                                <span
                                    className="fog"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {f.made}
                                </span>
                            </Review>
                        </div>
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <button
                                className="box"
                                role="checkbox"
                                aria-checked={f.agreed}
                                aria-labelledby="agree-l"
                                onClick={() => set("agreed", !f.agreed)}
                            >
                                {f.agreed && <Check />}
                            </button>
                            <span id="agree-l" style={{ fontSize: 15, paddingTop: 3 }}>
                                These answers are my own. I agree that the ETC team reviews them and
                                contacts me by email or phone about my application.
                            </span>
                        </div>
                        {err.agreed && (
                            <span className="err" role="alert">
                                Tick the box to send your application.
                            </span>
                        )}
                        {sendError && (
                            <p className="alert" role="alert">
                                {sendError}
                            </p>
                        )}
                    </div>
                )}

                <div className="rg-foot">
                    {step > 1 ? (
                        <button className="btn btn-line" onClick={() => go(step - 1)}>
                            Back
                        </button>
                    ) : (
                        <Link className="btn btn-line" href="/">
                            Cancel
                        </Link>
                    )}
                    <button className="btn btn-glow chamfer" onClick={next} disabled={sending}>
                        {step === 4 ? (sending ? "Sending" : "Send application") : "Continue"}{" "}
                        <Arrow color="#04140D" />
                    </button>
                </div>
            </main>
        </div>
    );
}

/** A required single choice shown as chips (school, year). */
function Choice<T extends string>({
    id,
    label,
    options,
    value,
    onChange,
    bad,
    error,
}: {
    id: string;
    label: string;
    options: readonly T[];
    value: T | "";
    onChange: (v: T) => void;
    bad?: boolean;
    error: string;
}) {
    return (
        <div className="fld">
            <span className="lbl" id={`${id}-l`}>
                {label}
            </span>
            <div
                role="radiogroup"
                aria-labelledby={`${id}-l`}
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
                {options.map((o) => (
                    <button
                        key={o}
                        className="lv"
                        role="radio"
                        aria-checked={value === o}
                        onClick={() => onChange(o)}
                    >
                        {o}
                    </button>
                ))}
            </div>
            {bad && (
                <span className="err" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

function Heading({ n, a, b, sub }: { n: number; a: string; b: string; sub?: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="mono" style={{ color: "var(--cyan)" }}>
                Step {n} of 4
            </span>
            <h1 className="az" style={{ margin: 0, fontSize: "clamp(30px, 3.6vw, 52px)" }}>
                {a} <span className="gtext">{b}</span>
            </h1>
            {sub && (
                <p className="fog" style={{ margin: 0, maxWidth: "56ch" }}>
                    {sub}
                </p>
            )}
        </div>
    );
}

function Field({
    id,
    label,
    value,
    onChange,
    bad,
    error,
    help,
    placeholder,
    type = "text",
    inputMode,
    autoComplete,
    area,
    count,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    bad?: boolean;
    error?: string;
    help?: string;
    placeholder?: string;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
    area?: boolean;
    count?: boolean;
}) {
    const describedBy = bad ? `${id}-err` : help ? `${id}-help` : undefined;
    const common = {
        id,
        className: "inp",
        value,
        placeholder,
        "aria-invalid": bad || undefined,
        "aria-describedby": describedBy,
    };
    return (
        <div className="fld">
            <label className="lbl" htmlFor={id}>
                {label}
            </label>
            {area ? (
                <textarea {...common} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input
                    {...common}
                    type={type}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {bad && error && (
                <span id={`${id}-err`} className="err" role="alert">
                    {error}
                </span>
            )}
            {!bad && help && (
                <span
                    id={`${id}-help`}
                    className="help"
                    style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                >
                    <span>{help}</span>
                    {count && <span>{words(value)} words</span>}
                </span>
            )}
        </div>
    );
}

function Review({
    label,
    onEdit,
    children,
}: {
    label: string;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rv">
            <span className="mono fog rvl">{label}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                {children}
            </span>
            <button
                className="btn btn-line"
                style={{ minHeight: 44, padding: "0 16px" }}
                onClick={onEdit}
            >
                Edit
            </button>
        </div>
    );
}

function Done({
    email,
    discordInvite,
    already = false,
}: {
    email: string;
    discordInvite: string;
    /** The signed-in account already applied this season. */
    already?: boolean;
}) {
    return (
        <main
            id="main"
            className="split"
            style={{
                gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)",
                background:
                    "radial-gradient(45% 60% at 25% 50%, rgba(25,240,139,.14), transparent 70%)",
            }}
        >
            <div className="botcol" style={{ display: "flex", justifyContent: "center" }}>
                <img
                    className="bot bob"
                    src="/mascots/bot-hi.svg"
                    alt="The ETC robot mascot waving"
                    style={{ width: "min(340px, 70%)", height: "auto" }}
                />
            </div>
            <div className="rise" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <span className="mono" style={{ color: "var(--signal)" }}>
                    {already ? "Already applied this season" : "Application received"}
                </span>
                <h1
                    className="az"
                    style={{ margin: 0, fontSize: "clamp(38px, 5.4vw, 80px)", lineHeight: 0.95 }}
                >
                    You&apos;re in
                    <br />
                    the <span className="gtext">signal</span>
                </h1>
                <p className="fog" style={{ margin: 0, maxWidth: "44ch", fontSize: 19 }}>
                    {already
                        ? `You already applied this season${email ? ` with ${email}` : ""}. One application per person.`
                        : `We received your application${email ? ` for ${email}` : ""}.`}{" "}
                    Here is what happens next.
                </p>
                <ol
                    style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                    }}
                >
                    {[
                        ["Application sent", already ? "Earlier this season" : "Today", "done"],
                        ["The team reads every application", REGISTRATION.reviewWindow, "next"],
                        ["Results by email", REGISTRATION.resultsDate, "todo"],
                    ].map(([t, d, s]) => (
                        <li
                            key={t}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "28px minmax(0,1fr)",
                                gap: 16,
                            }}
                        >
                            <span
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: s === "done" ? "var(--grad)" : "transparent",
                                    boxShadow:
                                        s === "done"
                                            ? "none"
                                            : `inset 0 0 0 2px ${s === "next" ? "var(--cyan)" : "var(--line-2)"}`,
                                }}
                            >
                                {s === "done" && <Check />}
                            </span>
                            <span>
                                <b style={{ display: "block" }}>{t}</b>
                                <span className="fog" style={{ fontSize: 15 }}>
                                    {d}
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a className="btn btn-discord" href={discordInvite}>
                        <Social name="discord" size={20} />
                        Join the Discord
                    </a>
                    <Link className="btn btn-line" href="/">
                        Back to ETC
                    </Link>
                </div>
            </div>
        </main>
    );
}

export function RegisterClosed({ discordInvite }: { discordInvite: string }) {
    return (
        <main
            id="main"
            className="split"
            style={{
                background:
                    "radial-gradient(50% 60% at 75% 50%, rgba(18,194,240,.14), transparent 70%)",
            }}
        >
            <div className="rise" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <span className="mono" style={{ color: "var(--cyan)" }}>
                    Registrations closed for now
                </span>
                <h1
                    className="az"
                    style={{ margin: 0, fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.95 }}
                >
                    The doors
                    <br />
                    open <span className="gtext">soon</span>
                </h1>
                <p className="fog" style={{ margin: 0, maxWidth: "42ch", fontSize: 19 }}>
                    The {SITE.season} registrations open{" "}
                    {REGISTRATION.opensAt
                        ? `on ${new Date(REGISTRATION.opensAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`
                        : "soon"}
                    . Turn on Discord notifications and you will hear it first.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a className="btn btn-discord" href={discordInvite}>
                        <Social name="discord" size={20} />
                        Notify me on Discord
                    </a>
                    <Link className="btn btn-line" href="/">
                        Explore ETC meanwhile
                    </Link>
                </div>
            </div>
            <div className="botcol" style={{ display: "flex", justifyContent: "center" }}>
                <img
                    className="bot bob"
                    src="/mascots/bot-phone.svg"
                    alt="The ETC robot mascot checking its phone"
                    style={{ width: "min(320px, 70%)", height: "auto" }}
                />
            </div>
        </main>
    );
}

export function RegisterHeader() {
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                height: 72,
                padding: "0 clamp(16px,3vw,40px)",
                borderBottom: "1px solid var(--line)",
            }}
        >
            <Lockup emblem={42} word={15} label="Back to ETC home" />
            <span className="mono fog top-meta">Registrations, season {SITE.season}</span>
            <Link
                href="/"
                className="fog"
                style={{ fontWeight: 600, fontSize: 15, textDecoration: "none", padding: "12px 0" }}
            >
                Save and exit
            </Link>
        </header>
    );
}
