import { useEffect, useRef } from "react";

const COLOR = "#c2181a";
const RING_SIZE = 44;
const DOT_SIZE = 10;

/**
 * Crisp SVG cursor with two layers:
 *  - a solid dot that tracks the mouse 1:1
 *  - a hollow ring that lerps toward the dot for a trailing effect
 *
 * Hidden on touch / coarse pointers.
 * On interactive elements the cursor brightens to stand out against same-colour buttons.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const scale = useRef(1);
  const targetScale = useRef(1);
  const hovering = useRef(0);
  const targetHover = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const isInteractive = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      return !!node?.closest?.(
        'a, button, [role="button"], input, textarea, select, label, summary, .cursor-pointer',
      );
    };
    const onOver = (e: MouseEvent) => {
      const active = isInteractive(e.target);
      targetScale.current = active ? 1.6 : 1;
      targetHover.current = active;
    };
    const onDown = () => (targetScale.current = 0.75);
    const onUp = (e: MouseEvent) => {
      const active = isInteractive(e.target);
      targetScale.current = active ? 1.6 : 1;
      targetHover.current = active;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      // Ring lags behind (delay/trailing)
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      scale.current += (targetScale.current - scale.current) * 0.2;
      hovering.current += ((targetHover.current ? 1 : 0) - hovering.current) * 0.2;

      const brightness = 1 + hovering.current * 0.35;
      const glow = 6 + hovering.current * 12;
      const ringGlow = 4 + hovering.current * 10;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${glow}px ${COLOR})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale.current})`;
        ringRef.current.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${ringGlow}px ${COLOR})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity: 0,
          transition: "opacity .2s ease",
          willChange: "transform, opacity, filter",
        }}
      >
        <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} width={RING_SIZE} height={RING_SIZE}>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_SIZE / 2 - 2}
            fill="none"
            stroke={COLOR}
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity: 0,
          transition: "opacity .2s ease",
          willChange: "transform, opacity, filter",
        }}
      >
        <svg viewBox={`0 0 ${DOT_SIZE} ${DOT_SIZE}`} width={DOT_SIZE} height={DOT_SIZE}>
          <circle cx={DOT_SIZE / 2} cy={DOT_SIZE / 2} r={DOT_SIZE / 2 - 1} fill={COLOR} />
        </svg>
      </div>
    </>
  );
}
