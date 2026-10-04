"use client";
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DOME, DOME_BASE, GRID } from "@/components/mascot";
import { Arrow, Icon, Lockup, Social } from "@/components/ui";
import { CELLS } from "@/data/cells";
import { NAV } from "@/data/club";
import type { EventMeta as UniverseEvent } from "@/data/events";
import { CREW_GROUPS, type Crew, type Member } from "@/lib/data";

/* ------------------------------------------------------------------ menu */
export function MobileMenu({
    discord,
    instagram,
    github,
}: {
    discord: string;
    instagram: string;
    github: string;
}) {
    const [open, setOpen] = useState(false);
    const first = useRef<HTMLAnchorElement>(null);
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        first.current?.focus();
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);
    return (
        <>
            <button
                className="sq menu-btn"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                >
                    <path d="M4 8h16M4 16h16" />
                </svg>
            </button>
            {open && (
                <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
                    <div
                        className="wrap header-in"
                        style={{ borderBottom: "1px solid var(--line)" }}
                    >
                        <Lockup emblem={40} word={12} />
                        <button
                            className="sq"
                            aria-label="Close menu"
                            onClick={() => setOpen(false)}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                aria-hidden="true"
                            >
                                <path d="M6 6l12 12M18 6 6 18" />
                            </svg>
                        </button>
                    </div>
                    <nav
                        aria-label="Primary"
                        className="wrap"
                        style={{ paddingTop: 36, display: "flex", flexDirection: "column" }}
                    >
                        {NAV.map((l, i) => (
                            <a
                                key={l.href}
                                ref={i === 0 ? first : undefined}
                                className={`menu-link${i === NAV.length - 1 ? " gtext" : ""}`}
                                href={l.href}
                                onClick={() => setOpen(false)}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <div
                        className="wrap"
                        style={{
                            marginTop: "auto",
                            paddingBottom: 28,
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                        }}
                    >
                        <Link className="btn btn-glow chamfer" href="/registrations">
                            Join ETC
                        </Link>
                        <div style={{ display: "flex", gap: 6 }}>
                            <a className="sq" href={instagram} aria-label="Instagram">
                                <Social name="instagram" />
                            </a>
                            <a className="sq" href={discord} aria-label="Discord">
                                <Social name="discord" />
                            </a>
                            <a className="sq" href={github} aria-label="GitHub">
                                <Social name="github" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* -------------------------------------------------------------- universe */
const RIM_Y = 252;
/** Emblem dome scale; its stroke keeps the emblem's proportions (16 units ≈ 7.7px). */
const DOME_SCALE = 0.48;
/** Tentacle roots span the emblem's outer tentacles (x 378 and 822 in emblem units). */
const ROOT_HALF = (DOME_BASE.x - 378) * DOME_SCALE;
function layout(n: number) {
    return Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const x = 120 + t * 960;
        const u = (x - 600) / 480;
        const y = 420 + (1 - u * u) * 280;
        const sx = Math.round(600 + (t - 0.5) * 2 * ROOT_HALF);
        const ey = y - 38;
        const d =
            Math.abs(x - sx) < 1
                ? `M${sx} ${RIM_Y - 12}V${ey}`
                : `M${sx} ${RIM_Y - 12}C${sx} ${RIM_Y + 0.45 * (ey - RIM_Y)} ${x} ${ey - 0.5 * (ey - RIM_Y)} ${x} ${ey}`;
        return {
            left: `${(x / 1200) * 100}%`,
            top: `${(y / 800) * 100}%`,
            d,
            delay: `${((i * 0.7) % 2.6).toFixed(1)}s`,
        };
    });
}

function Orb({ ev, size }: { ev: UniverseEvent; size: number }) {
    return (
        <span className="orb" style={{ width: size, height: size }}>
            {ev.cover ? (
                <Image src={ev.cover} alt="" fill sizes={`${size}px`} />
            ) : (
                <Icon name={ev.icon ?? "events"} size={Math.round(size * 0.45)} />
            )}
        </span>
    );
}

export function Universe({ events, discord }: { events: UniverseEvent[]; discord: string }) {
    const initial = Math.max(
        0,
        events.findIndex((e) => e.key === "etcode"),
    );
    const [active, setActive] = useState(initial);
    const [openRow, setOpenRow] = useState<number | null>(initial);
    const pos = layout(events.length);
    const cur = events[active] ?? events[0];
    return (
        <>
            <div className="stage" style={{ marginTop: 24 }}>
                <svg viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <linearGradient
                            id="ug"
                            x1="0"
                            y1="0"
                            x2="1200"
                            y2="800"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#19F08B" />
                            <stop offset="1" stopColor="#12C2F0" />
                        </linearGradient>
                        {/* emblem gradient, in emblem coordinates (used inside the scaled dome) */}
                        <linearGradient
                            id="ug-dome"
                            x1="420"
                            y1="190"
                            x2="780"
                            y2="900"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#05E6A2" />
                            <stop offset="1" stopColor="#00B2E4" />
                        </linearGradient>
                        <radialGradient
                            id="ug-halo"
                            cx="600"
                            cy="190"
                            r="300"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#12C2F0" stopOpacity=".16" />
                            <stop offset=".55" stopColor="#12C2F0" stopOpacity=".05" />
                            <stop offset="1" stopColor="#12C2F0" stopOpacity="0" />
                        </radialGradient>
                        <filter id="ug-glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
                            <feColorMatrix
                                in="b"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .55 0"
                            />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="600" cy="190" r="300" fill="url(#ug-halo)" />
                    <g fill="none" stroke="url(#ug)" strokeWidth="6" strokeLinecap="round">
                        {pos.map((p) => (
                            <path key={p.d} className="tdraw" pathLength={100} d={p.d} />
                        ))}
                    </g>
                    <g fill="none" stroke="#E9F3F1" strokeWidth="6" strokeLinecap="round">
                        {pos.map((p) => (
                            <path
                                key={p.d}
                                className="pulse"
                                pathLength={100}
                                style={{ animationDelay: p.delay }}
                                d={p.d}
                            />
                        ))}
                    </g>
                    <g
                        transform={`translate(600 ${RIM_Y}) scale(${DOME_SCALE}) translate(${-DOME_BASE.x} ${-DOME_BASE.y})`}
                        fill="none"
                        stroke="url(#ug-dome)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#ug-glow)"
                    >
                        <path d={DOME} fill="#06171c" />
                        {GRID.map((d) => (
                            <path key={d} d={d} />
                        ))}
                    </g>
                </svg>
                {events.map((ev, i) => (
                    <button
                        key={ev.key}
                        className="enode"
                        style={{ left: pos[i].left, top: pos[i].top }}
                        aria-pressed={i === active}
                        onClick={() => setActive(i)}
                    >
                        <Orb ev={ev} size={76} />
                        <span className="nm">{ev.name}</span>
                    </button>
                ))}
            </div>

            <div className="ev-list">
                {events.map((ev, i) => (
                    <div key={ev.key}>
                        <button
                            className="ev-row"
                            aria-expanded={openRow === i}
                            onClick={() => {
                                setOpenRow(openRow === i ? null : i);
                                setActive(i);
                            }}
                        >
                            <Orb ev={ev} size={52} />
                            <span className="nm">{ev.name}</span>
                            <span className="mono fog">{ev.kind}</span>
                        </button>
                        {openRow === i && (
                            <div
                                style={{
                                    padding: "14px 0 20px 66px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    borderBottom: "1px solid var(--line)",
                                }}
                            >
                                <p className="fog" style={{ margin: 0 }}>
                                    {ev.desc}
                                </p>
                                {ev.href && (
                                    <Link
                                        href={ev.href}
                                        style={{
                                            color: ev.accent,
                                            fontWeight: 700,
                                            textDecoration: "none",
                                        }}
                                    >
                                        Open {ev.name} →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <article className="panel" aria-live="polite">
                <span className="panel-bar" aria-hidden="true" style={{ background: cur.accent }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <span className="mono" style={{ color: cur.accent }}>
                        {cur.kind}
                    </span>
                    <h3
                        className="xp"
                        style={{ margin: 0, fontSize: "clamp(36px,4vw,60px)", lineHeight: 1 }}
                    >
                        {cur.name}
                    </h3>
                    <p className="lead" style={{ margin: 0, maxWidth: "48ch" }}>
                        {cur.desc}
                    </p>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 15 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name="calendar" size={18} />
                            {cur.when}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name="pin" size={18} />
                            ENSIA, Sidi Abdellah
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                        {cur.href ? (
                            <Link className="btn btn-glow chamfer" href={cur.href}>
                                Open {cur.name} <Arrow color="#04140D" />
                            </Link>
                        ) : (
                            <a className="btn btn-line" href={discord}>
                                Get notified on Discord
                            </a>
                        )}
                    </div>
                </div>
                <div
                    className="panel-media cut"
                    style={{
                        background: `radial-gradient(60% 60% at 50% 45%, ${cur.glow}, transparent 70%), var(--abyss)`,
                    }}
                >
                    {cur.photo ? (
                        <Image
                            src={cur.photo.src}
                            alt={cur.photo.alt}
                            fill
                            sizes="(max-width: 900px) 100vw, 600px"
                            style={{ objectFit: "cover" }}
                        />
                    ) : cur.cover ? (
                        <span
                            style={{
                                position: "relative",
                                // Event logos are small rasters; cap the size so they stay sharp.
                                width: "min(46%, 180px)",
                                aspectRatio: "1",
                                borderRadius: "50%",
                                overflow: "hidden",
                                boxShadow: "0 0 0 2px var(--line-2), 0 30px 80px rgba(0,0,0,.5)",
                            }}
                        >
                            <Image
                                src={cur.cover}
                                alt={`${cur.name} logo`}
                                fill
                                sizes="300px"
                                style={{ objectFit: "cover" }}
                            />
                        </span>
                    ) : (
                        <Icon
                            name={cur.icon ?? "events"}
                            variant="g"
                            size={200}
                            style={{ width: "38%", height: "auto" }}
                        />
                    )}
                </div>
            </article>
        </>
    );
}

/* ----------------------------------------------------------------- cells */
export function Cells() {
    const [open, setOpen] = useState(0);
    return (
        <div className="divs">
            {CELLS.map((d, i) => (
                <button
                    key={d.key}
                    className="dv"
                    aria-expanded={open === i}
                    onClick={() => setOpen(i)}
                >
                    <Image
                        className="ph"
                        src={d.photo}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 800px"
                        style={{ objectFit: "cover" }}
                    />
                    <span className="veil" aria-hidden="true" />
                    <span className="in">
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 12,
                            }}
                        >
                            <span className="ring">
                                <Icon name={d.icon} variant="g" size={30} />
                            </span>
                            <span className="mono fog dtag">{d.tag}</span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <span className="dname">{d.name}</span>
                            {open === i && (
                                <span
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 16,
                                        maxWidth: "48ch",
                                    }}
                                >
                                    <span style={{ fontSize: 18, lineHeight: 1.5 }}>{d.desc}</span>
                                    <span style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {d.does.map((w) => (
                                            <span key={w} className="chip">
                                                {w}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            )}
                        </span>
                    </span>
                </button>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ crew */
function MemberCard({
    m,
    big = false,
    socials = true,
}: {
    m: Member;
    big?: boolean;
    socials?: boolean;
}) {
    return (
        <article
            className={`mcard${big ? " pres" : ""}`}
            style={big ? { alignItems: "center", textAlign: "center" } : undefined}
        >
            <div className="port" style={{ width: "100%" }}>
                {m.photo ? (
                    <img
                        className="photo"
                        src={m.photo}
                        alt={m.name}
                        loading="lazy"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                    />
                ) : (
                    <>
                        <Icon
                            name="jelly"
                            variant="g"
                            size={big ? 88 : 52}
                            style={{ opacity: 0.45 }}
                        />
                        <span
                            className="mono fog"
                            style={{ position: "absolute", left: 14, bottom: 14 }}
                        >
                            [Portrait]
                        </span>
                    </>
                )}
                <span className="badge">
                    <Icon name={m.icon} size={20} />
                </span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: big ? "center" : "flex-start",
                }}
            >
                <span className="mono" style={{ color: "var(--cyan)" }}>
                    {m.role}
                </span>
                <h3 className="xp" style={{ margin: 0, fontSize: big ? 32 : 20, lineHeight: 1.1 }}>
                    {m.name}
                </h3>
                <span className="fog" style={{ fontSize: 15 }}>
                    {m.level}
                </span>
            </div>
            {socials && (m.linkedin || m.github) && (
                <div style={{ display: "flex", gap: 6 }}>
                    {m.linkedin && (
                        <a className="sq" href={m.linkedin} aria-label={`${m.name} on LinkedIn`}>
                            <Social name="linkedin" />
                        </a>
                    )}
                    {m.github && (
                        <a className="sq" href={m.github} aria-label={`${m.name} on GitHub`}>
                            <Social name="github" />
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}

export function CrewSection({ crew }: { crew: Crew }) {
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(0);
    const groups = CREW_GROUPS.filter((g) => crew.managers.some((m) => m.group === g.key));
    const filters = [
        { key: "all", label: "All" },
        { key: "board", label: "Board" },
        ...groups.filter((g) => g.key !== "other").map((g) => ({ key: g.key, label: g.label })),
    ];
    const showBoard = filter === "all" || filter === "board";
    const list =
        filter === "board"
            ? []
            : crew.managers.filter((m) => filter === "all" || m.group === filter);
    const per = 4;
    const pages = Math.max(1, Math.ceil(list.length / per));
    const p = Math.min(page, pages - 1);
    const pad = (n: number) => String(n).padStart(2, "0");

    // Autoplay: advance a page (desktop) or a card (mobile scroll rail) every few seconds.
    // Pauses while hovered, off screen, or for a while after the visitor touches it.
    const railRef = useRef<HTMLDivElement>(null);
    const hold = useRef({ hover: false, inView: false, until: 0 });
    useEffect(() => {
        const rail = railRef.current;
        if (!rail || list.length <= 1) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const io = new IntersectionObserver(([e]) => (hold.current.inView = e.isIntersecting));
        io.observe(rail);
        const id = setInterval(() => {
            const h = hold.current;
            if (document.hidden || h.hover || !h.inView || Date.now() < h.until) return;
            if (getComputedStyle(rail).overflowX === "auto") {
                const card = rail.querySelector<HTMLElement>(".mcard");
                const step = (card?.offsetWidth ?? rail.clientWidth) + 16;
                const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
                rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + step, behavior: "smooth" });
            } else {
                setPage((x) => (Math.min(x, pages - 1) + 1) % pages);
            }
        }, 4000);
        return () => {
            clearInterval(id);
            io.disconnect();
        };
    }, [list.length, pages]);
    const interact = () => (hold.current.until = Date.now() + 8000);

    return (
        <>
            <div
                role="group"
                aria-label="Filter the crew by cell"
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
                {filters.map((f) => (
                    <button
                        key={f.key}
                        className="fchip"
                        aria-pressed={filter === f.key}
                        onClick={() => {
                            setFilter(f.key);
                            setPage(0);
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            {showBoard && crew.president && (
                <div className="board">
                    <MemberCard m={crew.president} big />
                    {crew.keys.length > 0 && (
                        <>
                            <svg
                                className="branch"
                                viewBox="0 0 980 72"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <defs>
                                    <linearGradient
                                        id="brg"
                                        x1="0"
                                        y1="0"
                                        x2="980"
                                        y2="0"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0" stopColor="#19F08B" />
                                        <stop offset="1" stopColor="#12C2F0" />
                                    </linearGradient>
                                </defs>
                                <g fill="none" stroke="url(#brg)" strokeWidth="2">
                                    <path
                                        d="M490 0V24C490 40 163 32 163 72"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                    <path d="M490 0V72" vectorEffect="non-scaling-stroke" />
                                    <path
                                        d="M490 0V24C490 40 817 32 817 72"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </g>
                            </svg>
                            <div className="keys">
                                {crew.keys.map((m) => (
                                    <MemberCard key={m.id} m={m} socials={false} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
            {list.length > 0 && (
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}
                    onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") hold.current.hover = true;
                    }}
                    onPointerLeave={() => (hold.current.hover = false)}
                    onPointerDown={interact}
                    onFocus={interact}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <h3 className="xp" style={{ margin: 0, fontSize: 26 }}>
                            Managers{" "}
                            <span className="fog" style={{ fontWeight: 500, fontStretch: "100%" }}>
                                {list.length}
                            </span>
                        </h3>
                        <div
                            className="rail-ctrl"
                            style={{ display: "flex", alignItems: "center", gap: 10 }}
                        >
                            <span className="mono fog" aria-live="polite">
                                {pad(p * per + 1)}-{pad(Math.min(list.length, (p + 1) * per))} /{" "}
                                {pad(list.length)}
                            </span>
                            <button
                                className="sq"
                                disabled={p === 0}
                                aria-label="Previous managers"
                                onClick={() => setPage(p - 1)}
                            >
                                <Arrow back />
                            </button>
                            <button
                                className="sq"
                                disabled={p >= pages - 1}
                                aria-label="Next managers"
                                onClick={() => setPage(p + 1)}
                            >
                                <Arrow />
                            </button>
                        </div>
                    </div>
                    <div
                        ref={railRef}
                        className="mrail"
                        role="region"
                        aria-label="Managers"
                        onTouchStart={interact}
                    >
                        <div
                            className="mtrack"
                            style={{ transform: `translateX(calc(${-p} * (100% + 16px)))` }}
                        >
                            {list.map((m) => (
                                <MemberCard key={m.id} m={m} />
                            ))}
                        </div>
                    </div>
                    <div className="mprog" aria-hidden="true">
                        <span style={{ width: `${Math.round(((p + 1) / pages) * 100)}%` }} />
                    </div>
                </div>
            )}
        </>
    );
}

/* ------------------------------------------------------------------- faq */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
    const [open, setOpen] = useState(0);
    return (
        <div style={{ borderTop: "1px solid var(--line)" }}>
            {items.map((f, i) => (
                <div key={f.q} style={{ borderBottom: "1px solid var(--line)" }}>
                    <button
                        className="faq-q"
                        aria-expanded={open === i}
                        aria-controls={`faq-${i}`}
                        onClick={() => setOpen(open === i ? -1 : i)}
                    >
                        <span className="faq-t">{f.q}</span>
                        <span className="sq" aria-hidden="true" style={{ fontSize: 22 }}>
                            {open === i ? "−" : "+"}
                        </span>
                    </button>
                    {open === i && (
                        <p
                            id={`faq-${i}`}
                            className="fog"
                            style={{
                                margin: 0,
                                padding: "0 64px 28px 0",
                                fontSize: 18,
                                maxWidth: "60ch",
                            }}
                        >
                            {f.a}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
