import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  { q: "Quem pode participar?", a: "Empresários de qualquer segmento interessados em crescimento patrimonial estruturado e networking qualificado." },
  { q: "O evento é pago?", a: "As vagas são por convite. Após o cadastro, nossa equipe entra em contato com os detalhes de confirmação." },
  { q: "Como confirmar minha inscrição?", a: "Preencha o formulário e aguarde o contato da nossa equipe pelos canais informados para confirmar sua presença." },
  { q: "Posso levar acompanhante?", a: "Cada convite é nominal. Consulte a equipe organizadora sobre a disponibilidade de vagas adicionais." },
  { q: "O que acontece após o cadastro?", a: "Você recebe uma confirmação inicial e, em seguida, nossa equipe envia os detalhes do local, horário e credenciamento." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border bg-white shadow-[var(--shadow-card)]">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-ink">{f.q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${isOpen ? "bg-brand text-white border-brand rotate-45" : "text-ink"}`}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
