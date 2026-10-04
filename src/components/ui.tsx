/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** Custom ETC icon set (24px grid, 1.6 stroke, node-ring terminals). Files live in /public/icons. */
export type IconName =
    | "ai"
    | "arrow-ne"
    | "arrow-r"
    | "bloch"
    | "bolt"
    | "book"
    | "calendar"
    | "check"
    | "chip"
    | "design"
    | "dev"
    | "events"
    | "globe"
    | "idea"
    | "jelly"
    | "leaf"
    | "library"
    | "marketing"
    | "media"
    | "mic"
    | "pin"
    | "plus"
    | "trophy"
    | "users"
    | "workshop";

/** f = foam (light), g = brand gradient, i = ink (on gradient). Not every icon has every variant. */
export function Icon({
    name,
    variant = "f",
    size = 24,
    className,
    style,
}: {
    name: IconName;
    variant?: "f" | "g" | "i";
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <img
            src={`/icons/${name}-${variant}.svg`}
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            className={className}
            style={style}
        />
    );
}

export type SocialName =
    | "instagram"
    | "discord"
    | "google"
    | "github"
    | "linkedin"
    | "x"
    | "facebook"
    | "tiktok"
    | "youtube";

/** Official platform marks (Simple Icons), never redrawn. */
export function Social({ name, size = 18 }: { name: SocialName; size?: number }) {
    return (
        <img
            src={`/brand/social/${name}.svg`}
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
        />
    );
}

export function Arrow({
    color = "currentColor",
    size = 18,
    back = false,
}: {
    color?: string;
    size?: number;
    back?: boolean;
}) {
    return (
        <svg
            className="arr"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d={back ? "M20 12H5M11 6l-6 6 6 6" : "M4 12h15M13 6l6 6-6 6"} />
        </svg>
    );
}

export function Check({ size = 14 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#04140D"
            strokeWidth="3"
            aria-hidden="true"
        >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    );
}

/** Emblem + ETC CLUB wordmark: the horizontal lockup used in navigation. */
export function Lockup({
    href = "/",
    emblem = 46,
    word = 16,
    label = "ETC Club - ENSIA Tech Community, home",
}: {
    href?: string;
    emblem?: number;
    word?: number;
    label?: string;
}) {
    return (
        <Link href={href} aria-label={label} className="lockup">
            <img
                src="/brand/etc-emblem.webp"
                alt=""
                width={emblem}
                height={emblem}
                style={{ objectFit: "contain" }}
            />
            <img
                src="/brand/etc-wordmark.svg"
                alt=""
                height={word}
                style={{ height: word, width: "auto" }}
            />
        </Link>
    );
}
