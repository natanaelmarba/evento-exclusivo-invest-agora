import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  y?: number;
  delay?: number;
  stagger?: boolean;
  duration?: number;
};

// Editorial reveal: long fade + subtle upward drift. Respects reduced motion.
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 28,
  delay = 0,
  stagger = false,
  duration = 1.1,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = stagger ? Array.from(el.children) : [el];
    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(targets, { opacity: 0, y });
    const anim = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      stagger: stagger ? 0.12 : 0,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [y, delay, duration, stagger]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
