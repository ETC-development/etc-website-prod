"use client";
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/*
 * Geometry traced from the official emblem (etc logo full color.svg rendered at 1200px),
 * jellyfish only: the badge ring, wordmark and side circuits are left out.
 */
const VIEWBOX = "180 160 840 760";
const STROKE = 23;
/** The dome base line in emblem coordinates; tentacles hang from here. */
export const DOME_BASE = { x: 600, y: 575 };
const NODE_R = 35;

export const DOME = "M221 540A379 346 0 0 1 979 540A35 35 0 0 1 944 575H256A35 35 0 0 1 221 540Z";
export const GRID = [
    "M236 553Q600 344 964 553",
    "M600 196V575",
    "M580 203C470 300 385 420 378 575",
    "M620 203C730 300 815 420 822 575",
];
const TENTACLES = [
    "M378 550V705",
    "M514 550V686Q514 700 505 712L419 830",
    "M600 550V783",
    "M686 550V686Q686 700 695 712L781 830",
    "M822 550V705",
];
const NODES: [number, number][] = [
    [378, 740],
    [398, 858],
    [600, 818],
    [802, 858],
    [822, 740],
];
/** Order the signals fire in: centre first, then outwards. */
const FIRE_ORDER = [2, 1, 0, 1, 2];

const BG = "#040d12";
/** Opaque dome body: hides the tentacle roots behind it when the jelly tilts. */
const BODY = "#06171c";
/** How far the dome floats in front of the tentacles. */
const DOME_Z = 24;
const PULSE = 3.6;
/** Extrusion slices behind each front layer, in px of depth. */
const SLICES = [3, 6, 9, 12, 15, 18];

function Layer({
    z,
    children,
    breathe,
    origin,
    style,
}: {
    z: number;
    children: ReactNode;
    breathe?: { scaleX?: number[]; scaleY?: number[]; delay?: number } | false;
    origin: string;
    style?: React.CSSProperties;
}) {
    return (
        <motion.div
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                transformOrigin: origin,
                z,
                ...style,
            }}
            animate={breathe ? { scaleX: breathe.scaleX, scaleY: breathe.scaleY } : undefined}
            transition={
                breathe
                    ? {
                          duration: PULSE,
                          delay: breathe.delay ?? 0,
                          repeat: Infinity,
                          ease: "easeInOut",
                      }
                    : undefined
            }
        >
            <svg
                viewBox={VIEWBOX}
                width="100%"
                height="100%"
                style={{ overflow: "visible", display: "block" }}
            >
                {children}
            </svg>
        </motion.div>
    );
}

function DomeShape({ stroke, fill = "none" }: { stroke: string; fill?: string }) {
    return (
        <g fill="none" stroke={stroke} strokeWidth={STROKE} strokeLinecap="round">
            <path d={DOME} fill={fill} strokeLinejoin="round" />
            {GRID.map((d) => (
                <path key={d} d={d} />
            ))}
        </g>
    );
}

function TentacleShape({ stroke, fill }: { stroke: string; fill: string }) {
    return (
        <g stroke={stroke} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
            <g fill="none">
                {TENTACLES.map((d) => (
                    <path key={d} d={d} />
                ))}
            </g>
            <g fill={fill}>
                {NODES.map(([cx, cy]) => (
                    <circle key={cx + "-" + cy} cx={cx} cy={cy} r={NODE_R} />
                ))}
            </g>
        </g>
    );
}

/** Pointer position relative to the element, -1..1 on each axis, springy. */
function usePointerTilt(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const active = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 70, damping: 18 });
    const sy = useSpring(py, { stiffness: 70, damping: 18 });
    const sa = useSpring(active, { stiffness: 40, damping: 20 });

    useEffect(() => {
        if (!enabled) return;
        let idle: ReturnType<typeof setTimeout> | undefined;
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || !ref.current) return;
            const r = ref.current.getBoundingClientRect();
            px.set(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
            py.set(clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
            active.set(1);
            clearTimeout(idle);
            idle = setTimeout(() => {
                px.set(0);
                py.set(0);
                active.set(0);
            }, 2500);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            clearTimeout(idle);
        };
    }, [enabled, ref, px, py, active]);

    return { sx, sy, sa };
}

/** The ETC jellyfish, faithful to the emblem, with real CSS 3D depth. */
export function Mascot() {
    const uid = useId().replace(/:/g, "");
    const reduce = useReducedMotion() ?? false;
    const ref = useRef<HTMLDivElement>(null);
    const { sx, sy, sa } = usePointerTilt(ref, !reduce);

    // Idle sway so the depth reads on touch screens and when the mouse rests.
    const t = useMotionValue(0);
    useAnimationFrame((time) => {
        if (!reduce) t.set(time / 1000);
    });
    const rotateY: MotionValue<number> = useTransform([sx, sa, t], ([x, a, s]: number[]) => {
        const sway = Math.sin(s * 0.55) * 14 * (1 - a);
        return x * 26 + sway;
    });
    const rotateX: MotionValue<number> = useTransform([sy, sa, t], ([y, a, s]: number[]) => {
        const sway = Math.sin(s * 0.4 + 1) * 6 * (1 - a);
        return -y * 16 + 6 + sway;
    });

    const grad = `url(#${uid}-g)`;
    const domeBreath = reduce ? false : { scaleX: [1, 1.035, 1], scaleY: [1, 0.94, 1] };
    const tentBreath = reduce ? false : { scaleY: [1, 1.05, 1], scaleX: [1, 0.97, 1], delay: 0.25 };
    // Dome pulses from its base, tentacles hang from the same line (y=575 in the viewBox).
    const domeOrigin = "50% 54%";
    const tentOrigin = "50% 54%";

    return (
        <div
            ref={ref}
            role="img"
            aria-label="The ETC jellyfish, the club emblem as a living circuit creature"
            style={{ width: "100%", aspectRatio: "840 / 760", perspective: 1400 }}
        >
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                <defs>
                    <linearGradient
                        id={`${uid}-g`}
                        x1="420"
                        y1="190"
                        x2="780"
                        y2="900"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#05E6A2" />
                        <stop offset="1" stopColor="#00B2E4" />
                    </linearGradient>
                    <radialGradient id={`${uid}-h`} cx="50%" cy="45%" r="50%">
                        <stop offset="0" stopColor="#12C2F0" stopOpacity=".28" />
                        <stop offset=".6" stopColor="#12C2F0" stopOpacity=".07" />
                        <stop offset="1" stopColor="#12C2F0" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
            <motion.div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    rotateX: reduce ? 6 : rotateX,
                    rotateY: reduce ? 0 : rotateY,
                }}
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* halo, far behind */}
                <Layer z={-120} origin="50% 50%">
                    <ellipse cx="600" cy="460" rx="430" ry="380" fill={`url(#${uid}-h)`} />
                </Layer>

                {/* tentacles: extruded body, then the lit face */}
                {SLICES.slice()
                    .reverse()
                    .map((d) => (
                        <Layer key={"t" + d} z={-d} origin={tentOrigin} breathe={tentBreath}>
                            <TentacleShape
                                stroke={d === SLICES[SLICES.length - 1] ? "#03262b" : "#0a4a4d"}
                                fill={BG}
                            />
                        </Layer>
                    ))}
                <Layer
                    z={0}
                    origin={tentOrigin}
                    breathe={tentBreath}
                    style={{ filter: "drop-shadow(0 0 14px rgba(18, 194, 240, 0.45))" }}
                >
                    <TentacleShape stroke={grad} fill={BG} />
                    {!reduce && <Signals />}
                </Layer>

                {/* dome sits in front of the tentacles */}
                {SLICES.slice()
                    .reverse()
                    .map((d) => (
                        <Layer
                            key={"d" + d}
                            z={DOME_Z - d}
                            origin={domeOrigin}
                            breathe={domeBreath}
                        >
                            <DomeShape
                                stroke={d === SLICES[SLICES.length - 1] ? "#03262b" : "#0a4a4d"}
                            />
                        </Layer>
                    ))}
                <Layer
                    z={DOME_Z}
                    origin={domeOrigin}
                    breathe={domeBreath}
                    style={{ filter: "drop-shadow(0 0 18px rgba(5, 230, 162, 0.4))" }}
                >
                    <DomeShape stroke={grad} fill={BODY} />
                </Layer>
            </motion.div>
        </div>
    );
}

/** Light pulses travelling down each tentacle; the node flares as one lands. */
function Signals() {
    const travel = 1.1;
    return (
        <g>
            {TENTACLES.map((d, i) => {
                const delay = 0.5 + FIRE_ORDER[i] * 0.22;
                return (
                    <motion.path
                        key={d}
                        d={d}
                        pathLength={1}
                        fill="none"
                        stroke="#E6FFF6"
                        strokeWidth={STROKE * 0.45}
                        strokeLinecap="round"
                        strokeDasharray="0.16 1.2"
                        initial={{ strokeDashoffset: 0.16, opacity: 0 }}
                        animate={{ strokeDashoffset: [0.16, -1], opacity: [0, 1, 1, 0] }}
                        transition={{
                            duration: travel,
                            delay,
                            repeat: Infinity,
                            repeatDelay: PULSE * 2 - travel,
                            ease: "easeIn",
                            opacity: { times: [0, 0.1, 0.85, 1] },
                        }}
                    />
                );
            })}
            {NODES.map(([cx, cy], i) => (
                <motion.circle
                    key={cx + "-" + cy}
                    cx={cx}
                    cy={cy}
                    r={NODE_R - STROKE / 2}
                    fill="#7CFFD4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0] }}
                    transition={{
                        duration: 0.9,
                        delay: 0.5 + FIRE_ORDER[i] * 0.22 + travel * 0.85,
                        repeat: Infinity,
                        repeatDelay: PULSE * 2 - 0.9,
                        ease: "easeOut",
                    }}
                />
            ))}
        </g>
    );
}
