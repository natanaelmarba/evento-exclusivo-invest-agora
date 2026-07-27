import { useEffect, useRef } from "react";

const COLOR = "#c2181a";

/**
 * Crisp SVG cursor with two layers:
 *  - a solid dot that tracks the mouse 1:1
 *  - a hollow ring that lerps toward the dot for a trailing effect
 *
 * Hidden on touch / coarse pointers.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const scale = useRef(1);
  const targetScale = useRef(1);

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
      targetScale.current = isInteractive(e.target) ? 1.6 : 1;
    };
    const onDown = () => (targetScale.current = 0.75);
    const onUp = (e: MouseEvent) =>
      (targetScale.current = isInteractive(e.target) ? 1.6 : 1);

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

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale.current})`;
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
          width: 34,
          height: 34,
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity: 0,
          transition: "opacity .2s ease",
          willChange: "transform, opacity",
        }}
      >
        <svg viewBox="0 0 34 34" width="34" height="34">
          <circle
            cx="17"
            cy="17"
            r="15.25"
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
          width: 10,
          height: 10,
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity: 0,
          transition: "opacity .2s ease",
          willChange: "transform, opacity",
          filter: `drop-shadow(0 0 6px ${COLOR}55)`,
        }}
      >
        <svg viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="4" fill={COLOR} />
        </svg>
      </div>
    </>
  );
}
