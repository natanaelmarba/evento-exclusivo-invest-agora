import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import logoAgora from "@/assets/logo-agora.png.asset.json";
import logoVerticale from "@/assets/logo-especialista.png.asset.json";

// =====================================================================
// PLACEHOLDERS — trocar antes de publicar.
// =====================================================================
const WEBHOOK_URL = "{{WEBHOOK_URL}}";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Encontro Online para Empresários — Invest Agora × Verticale",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  description:
    "Encontro online, exclusivo e gratuito, com estratégias práticas para empresários que querem investir melhor, proteger patrimônio e tomar decisões mais seguras.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Encontro Online para Empresários | Invest Agora × Verticale" },
      {
        name: "description",
        content:
          "Encontro online, exclusivo e gratuito para empresários. Estratégias práticas para investir melhor, proteger patrimônio e decidir com segurança em cenário de incerteza.",
      },
      { property: "og:title", content: "Encontro Online para Empresários | Invest Agora" },
      {
        property: "og:description",
        content:
          "Investimento inteligente, alavancagem patrimonial e oportunidades em leilão. Vagas limitadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(eventSchema) }],
  }),
  component: LandingPage,
});

// Paleta: branco, grafite #33353B (degradês) e vermelho #840b0a (degradês)
const C = {
  bg: "#1c1d21",
  bgSoft: "#26272c",
  bgCard: "#33353B",
  bgCard2: "#3d3f46",
  line: "#4a4c54",
  text: "#ffffff",
  muted: "#c9cbd1",
  accent: "#e11f1d",
  accentSoft: "#a8100f",
  accentDark: "#840b0a",
};

function LandingPage() {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      className="min-h-screen"
      style={{
        color: C.text,
        fontFamily: "Inter, system-ui, sans-serif",
        background: `radial-gradient(1000px 500px at 80% -10%, ${C.accentDark}66 0%, transparent 60%), radial-gradient(900px 400px at -10% 20%, ${C.bgCard2} 0%, transparent 55%), linear-gradient(180deg, ${C.bg}, ${C.bgSoft})`,
      }}
    >
      {/* ============= HEADER ============= */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: "rgba(28,29,33,.78)", borderBottom: `1px solid ${C.line}` }}
      >
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <img src={logoAgora.url} alt="Invest Agora" className="h-9 md:h-11" />
            <span className="hidden h-6 w-px bg-white/15 md:block" />
            <img src={logoVerticale.url} alt="Verticale" className="hidden h-9 md:block md:h-11" />
          </div>
          <CtaButton onClick={openModal} variant="outline">
            Quero minha inscrição
          </CtaButton>
        </div>
      </header>

      <div className="mx-auto max-w-[1160px] px-5 pb-24">
        {/* ============= HERO ============= */}
        <section className="flex flex-col items-center py-14 text-center md:py-20">
          <span
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest"
            style={{ borderColor: C.line, color: C.accent, background: `${C.accentDark}30` }}
          >
            ● Evento Online • Vagas limitadas
          </span>

          <h1 className="mb-10 max-w-4xl text-[clamp(34px,5vw,60px)] font-extrabold leading-[1.05] tracking-tight">
            Empresários que decidem hoje <span style={{ color: C.accent }}>colhem vantagem amanhã</span>.
          </h1>

          {/* VIDEO PLACEHOLDER */}
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border"
            style={{
              aspectRatio: "16 / 9",
              background: `linear-gradient(180deg, ${C.bgCard2}, ${C.bgCard})`,
              borderColor: C.line,
              boxShadow: "0 30px 80px rgba(0,0,0,.55)",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div
                className="grid h-16 w-16 place-items-center rounded-full text-3xl"
                style={{ background: `${C.accentDark}66`, color: C.accent, border: `1px solid ${C.line}` }}
              >
                ▶
              </div>
              <p className="text-sm font-medium" style={{ color: C.muted }}>
                Espaço reservado para o vídeo do evento
              </p>
            </div>
          </div>

          <div className="mt-10">
            <CtaButton onClick={openModal}>Quero garantir minha inscrição →</CtaButton>
            <p className="mt-4 text-[13px]" style={{ color: C.muted }}>
              Vagas limitadas • Cadastro rápido • Confirmação por e-mail/WhatsApp
            </p>
          </div>
        </section>

        {/* ============= POR QUE AGORA ============= */}
        <Section eyebrow="Por que esse evento importa agora" title="O cenário muda rápido. Sua estratégia precisa mudar antes.">
          <p className="max-w-3xl text-lg leading-relaxed" style={{ color: C.muted }}>
            Quem empreende sabe: crescimento sem estratégia vira risco. Este evento online foi desenhado para
            empresários de diferentes segmentos que querem tomar decisões mais inteligentes sobre patrimônio, capital
            e expansão. Você terá uma visão objetiva para agir com mais segurança, previsibilidade e clareza.
          </p>
        </Section>

        {/* ============= O QUE VAI APRENDER ============= */}
        <Section eyebrow="O que você vai aprender" title="Conteúdo direto ao ponto para decisões de alto impacto">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Alavancagem Patrimonial", "Como estruturar crescimento sem comprometer fluxo e estabilidade."],
              ["Investimento Inteligente", "Critérios práticos para avaliar risco, retorno e timing."],
              ["Aplicação Estratégica de Capital", "Como direcionar recursos para gerar avanço consistente."],
              ["Oportunidades em Leilão", "Como analisar oportunidades com método e visão de negócio."],
            ].map(([t, d], i) => (
              <Card key={t}>
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                  style={{ background: `${C.accentDark}66`, color: C.accent, border: `1px solid ${C.line}` }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-1 text-lg font-bold">{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= PARA QUEM É ============= */}
        <Section eyebrow="Para quem é este evento" title="Feito para empresários que querem jogar no próximo nível">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Donos de negócio que querem crescer com mais controle",
              "Empresários que buscam proteger e expandir patrimônio",
              "Quem deseja melhorar qualidade das decisões financeiras",
              "Quem quer enxergar novas alavancas de resultado",
            ].map((t) => (
              <Card key={t}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold"
                    style={{ background: `${C.accentDark}66`, color: C.accent, border: `1px solid ${C.line}` }}>
                    ✓
                  </span>
                  <p className="text-[15px] leading-relaxed">{t}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= URGÊNCIA ============= */}
        <Section eyebrow="Prova de urgência" title="Turma com vagas limitadas">
          <Card>
            <p className="mb-6 text-base leading-relaxed" style={{ color: C.muted }}>
              Para manter qualidade e interação, as inscrições são limitadas.
              Garanta sua participação agora e evite ficar de fora desta edição.
            </p>
            <CtaButton onClick={openModal}>Reservar minha vaga agora →</CtaButton>
          </Card>
        </Section>

        {/* ============= FAQ ============= */}
        <Section eyebrow="Dúvidas frequentes" title="Tudo o que você precisa saber">
          <div className="space-y-3">
            {[
              ["O evento é para qual tipo de empresário?", "Para empresários de qualquer segmento que desejam evoluir a estratégia patrimonial e de investimento."],
              ["É conteúdo teórico ou aplicável?", "Aplicável. O foco é fornecer direcionamentos práticos para decisão."],
              ["Vou receber acesso após o cadastro?", "Sim. A confirmação e os detalhes de acesso são enviados após a inscrição."],
              ["Há limite de participantes?", "Sim. As vagas são limitadas por edição."],
            ].map(([q, a]) => (
              <details key={q} className="group rounded-xl border p-4 open:pb-5"
                style={{ background: C.bgCard, borderColor: C.line }}>
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {q}
                  <span className="ml-4 grid h-7 w-7 place-items-center rounded-full border text-lg transition group-open:rotate-45"
                    style={{ borderColor: C.line, color: C.accent }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ============= FINAL CTA ============= */}
        <section className="pt-8 md:pt-14">
          <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border p-8 md:grid-cols-[1.2fr_.8fr] md:p-12"
            style={{ background: `linear-gradient(135deg, ${C.accentDark}66, ${C.bgCard})`, borderColor: C.line }}>
            <div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Seu próximo salto empresarial começa aqui.
              </h2>
              <p className="text-lg" style={{ color: C.muted }}>
                Inscreva-se no evento online e aprenda a tomar decisões mais inteligentes em investimento,
                alavancagem patrimonial, aplicação de capital e oportunidades em leilão.
              </p>
            </div>
            <div className="md:text-right">
              <CtaButton onClick={openModal}>Quero garantir minha inscrição →</CtaButton>
            </div>
          </div>
        </section>

        <footer className="pt-12 pb-6 text-center text-xs" style={{ color: C.muted }}>
          <div className="mb-3 flex items-center justify-center gap-4 opacity-90">
            <img src={logoAgora.url} alt="Invest Agora" className="h-8" />
            <img src={logoVerticale.url} alt="Verticale" className="h-8" />
          </div>
          © {new Date().getFullYear()} Invest Agora × Verticale • Todos os direitos reservados
        </footer>
      </div>

      {/* STICKY MOBILE */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur md:hidden"
        style={{ background: "rgba(28,29,33,.92)", borderColor: C.line }}>
        <button onClick={openModal} className="block w-full rounded-full px-5 py-3.5 text-center font-bold text-white"
          style={{ background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})` }}>
          Quero garantir minha inscrição
        </button>
      </div>

      {open && <RegistrationModal onClose={closeModal} />}
    </div>
  );
}

function CtaButton({
  children,
  onClick,
  variant = "solid",
  full = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  full?: boolean;
}) {
  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5 ${full ? "w-full" : ""}`}
        style={{ borderColor: C.line, color: C.text }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold text-white transition hover:-translate-y-px ${full ? "w-full" : ""}`}
      style={{
        background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
        boxShadow: `0 12px 32px ${C.accentDark}88`,
      }}
    >
      {children}
    </button>
  );
}

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cidade, setCidade] = useState("");
  const [segmento, setSegmento] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<{ nome?: boolean; email?: boolean; whatsapp?: boolean; cidade?: boolean }>({});
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const wpp = whatsapp.replace(/\D/g, "");
    const errs = {
      nome: nome.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      whatsapp: wpp.length < 10,
      cidade: cidade.trim().length < 2,
    };
    setErrors(errs);
    if (errs.nome || errs.email || errs.whatsapp || errs.cidade || !lgpd) return;

    setLoading(true);
    try {
      if (WEBHOOK_URL && !WEBHOOK_URL.startsWith("{{")) {
        const params = new URLSearchParams(window.location.search);
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome, email, whatsapp: wpp, empresa, cidade, segmento,
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
            page: window.location.href,
            created_at: new Date().toISOString(),
          }),
        });
      }
      setOk(true);
    } catch {
      alert("Falha ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border"
        style={{
          background: `linear-gradient(180deg, ${C.bgCard2}, ${C.bgCard})`,
          borderColor: C.line,
          boxShadow: "0 40px 100px rgba(0,0,0,.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border text-lg transition hover:bg-white/5"
          style={{ borderColor: C.line, color: C.text }}
        >
          ×
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-6 md:p-7">
          {ok ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
                style={{ background: `${C.accentDark}66`, color: C.accent, border: `1px solid ${C.line}` }}>✓</div>
              <h3 className="mb-2 text-2xl font-bold">Inscrição recebida!</h3>
              <p className="mb-6 text-sm" style={{ color: C.muted }}>
                Enviamos uma confirmação para seu e-mail e WhatsApp em breve.
              </p>
              <CtaButton onClick={onClose} full>Fechar</CtaButton>
            </div>
          ) : (
            <>
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest" style={{ color: C.accent }}>
                Evento online • Vagas limitadas
              </p>
              <h3 className="mb-1 text-2xl font-bold">Finalize sua inscrição em menos de 1 minuto</h3>
              <p className="mb-5 text-[13px]" style={{ color: C.muted }}>
                Após o cadastro, nossa equipe entra em contato para confirmar sua participação.
              </p>

              <form onSubmit={onSubmit} noValidate className="space-y-3">
                <Field label="Nome completo*" error={errors.nome && "Informe seu nome."}>
                  <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} style={inputStyle} placeholder="Seu nome" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="WhatsApp*" error={errors.whatsapp && "WhatsApp inválido."}>
                    <input inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} style={inputStyle} placeholder="(11) 90000-0000" />
                  </Field>
                  <Field label="E-mail profissional*" error={errors.email && "E-mail inválido."}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} style={inputStyle} placeholder="voce@empresa.com" />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Empresa">
                    <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={inputCls} style={inputStyle} placeholder="Nome da empresa" />
                  </Field>
                  <Field label="Segmento">
                    <input value={segmento} onChange={(e) => setSegmento(e.target.value)} className={inputCls} style={inputStyle} placeholder="Ex.: Indústria, Serviços…" />
                  </Field>
                </div>
                <Field label="Cidade / Estado*" error={errors.cidade && "Informe sua cidade."}>
                  <input value={cidade} onChange={(e) => setCidade(e.target.value)} className={inputCls} style={inputStyle} placeholder="Sua cidade / UF" />
                </Field>

                <label className="flex items-start gap-2 pt-1 text-[13px]" style={{ color: C.muted }}>
                  <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} className="mt-1 accent-[#e11f1d]" />
                  <span>Ao enviar, você concorda em receber informações do evento e comunicações relacionadas.</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full px-6 py-3.5 font-bold text-white transition disabled:opacity-70"
                  style={{
                    background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
                    boxShadow: `0 12px 28px ${C.accentDark}77`,
                  }}
                >
                  {loading ? "Enviando…" : "Confirmar inscrição"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border p-3 text-white outline-none transition placeholder:text-white/40 focus:border-[#e11f1d] focus:ring-4 focus:ring-[#e11f1d]/20";
const inputStyle = { background: C.bg, borderColor: C.line } as const;

function Field({ label, error, children }: { label: string; error?: string | false; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{label}</label>
      {children}
      {error && <p className="text-xs font-medium" style={{ color: "#ff8a8a" }}>{error}</p>}
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-14 md:py-20">
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest" style={{ color: C.accent }}>{eyebrow}</p>
      <h2 className="mb-6 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-6 transition hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(180deg, ${C.bgCard2}, ${C.bgCard})`,
        borderColor: C.line,
        boxShadow: "0 10px 30px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </div>
  );
}
