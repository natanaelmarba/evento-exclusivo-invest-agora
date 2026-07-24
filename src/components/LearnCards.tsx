import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

const items = [
  { title: "Alavancagem patrimonial", desc: "Estruture crescimento com solidez, previsibilidade e proteção de longo prazo." },
  { title: "Investimento e aplicação", desc: "Estratégias claras para alocação eficiente de capital em diferentes cenários." },
  { title: "Oportunidades com leilão", desc: "Panorama sobre um dos caminhos mais estratégicos para expansão patrimonial." },
  { title: "Crescimento familiar e empresarial", desc: "Planejamento que integra o futuro da empresa e o legado da família." },
];

export function LearnCards() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    // anime.js: microinterações hover
    cards.forEach((c) => {
      const icon = c.querySelector<HTMLElement>("[data-icon]");
      c.addEventListener("mouseenter", () => {
        animate(c, { translateY: -6, duration: 350, ease: "outCubic" });
        if (icon) animate(icon, { rotate: 8, scale: 1.08, duration: 400, ease: "outElastic(1, .6)" });
      });
      c.addEventListener("mouseleave", () => {
        animate(c, { translateY: 0, duration: 350, ease: "outCubic" });
        if (icon) animate(icon, { rotate: 0, scale: 1, duration: 350, ease: "outCubic" });
      });
    });
  }, []);

  return (
    <div ref={rootRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.title}
          data-card
          className="group relative flex flex-col rounded-2xl border bg-white p-6 shadow-[var(--shadow-card)] transition will-change-transform"
        >
          <div
            data-icon
            className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-brand text-white shadow-[var(--shadow-brand)]"
          >
            <span className="text-lg font-bold">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="text-lg font-bold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
