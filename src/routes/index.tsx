import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

// =====================================================================
// PLACEHOLDERS — trocar aqui antes de publicar.
// =====================================================================
const WEBHOOK_URL = "{{WEBHOOK_URL}}";
const CHECKOUT_URL = "{{CHECKOUT_URL}}";
const DATA_ISO = "2026-09-22T20:00:00-03:00";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Imersão Empresarial ao Vivo",
  startDate: DATA_ISO,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: "https://evento-exclusivo-invest-agora.lovable.app/",
  },
  description:
    "Imersão prática para empresários: organizar caixa, priorizar alocação e acelerar crescimento com disciplina financeira.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imersão Empresarial ao Vivo | Investimento e Negócios" },
      {
        name: "description",
        content:
          "Aprenda um método prático para decidir melhor, alocar capital com segurança e acelerar o crescimento da sua empresa.",
      },
      { property: "og:title", content: "Imersão Empresarial ao Vivo | Investimento e Negócios" },
      {
        property: "og:description",
        content:
          "Aprenda um método prático para decidir melhor, alocar capital com segurança e acelerar o crescimento da sua empresa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(eventSchema) },
    ],
  }),
  component: LandingPage,
});

function useCountdown(targetISO: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(targetISO).getTime();
  const diff = Number.isNaN(target) ? 0 : Math.max(0, target - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

const COLORS = {
  bg: "#33353B",
  bgLight: "#404349",
  bgLighter: "#4c4f57",
  bgDark: "#26272c",
  bgDarker: "#1c1d21",
  card: "#3a3c43",
  line: "#4c4f57",
  text: "#ffffff",
  muted: "#c9cacf",
  primary: "#840b0a",
  primaryLight: "#a8100f",
  primaryLighter: "#c4302f",
  primaryDark: "#5e0807",
};

function LandingPage() {
  const { d, h, m, s } = useCountdown(DATA_ISO);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [porte, setPorte] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<{ nome?: boolean; email?: boolean; whatsapp?: boolean }>({});
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const wpp = whatsapp.replace(/\D/g, "");
    const errs = {
      nome: nome.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      whatsapp: wpp.length < 10,
    };
    setErrors(errs);
    if (errs.nome || errs.email || errs.whatsapp || !lgpd) return;

    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      nome,
      email,
      whatsapp: wpp,
      porte,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      page: window.location.href,
      created_at: new Date().toISOString(),
    };

    try {
      if (WEBHOOK_URL && !WEBHOOK_URL.startsWith("{{")) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      // @ts-expect-error dataLayer
      window.dataLayer = window.dataLayer || [];
      // @ts-expect-error dataLayer
      window.dataLayer.push({ event: "lead_submit", lead_source: payload.utm_source || "direct" });

      setOk(true);
      setNome(""); setEmail(""); setWhatsapp(""); setPorte(""); setLgpd(false);
      if (CHECKOUT_URL && !CHECKOUT_URL.startsWith("{{")) {
        setTimeout(() => { window.location.href = CHECKOUT_URL; }, 700);
      }
    } catch {
      alert("Falha ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-[10px] border p-3 text-white outline-none focus:border-[#a8100f]";
  const inputStyle = { background: COLORS.bgDark, borderColor: COLORS.line } as const;

  const chip = "rounded-full border px-[11px] py-[7px] text-[13px]";
  const chipStyle = { background: COLORS.bgDark, borderColor: COLORS.line, color: COLORS.muted } as const;

  const itemStyle = {
    background: `linear-gradient(180deg, ${COLORS.bgLight}, ${COLORS.bg})`,
    borderColor: COLORS.line,
  } as const;

  return (
    <div
      className="min-h-screen"
      style={{
        color: COLORS.text,
        fontFamily: "Inter, system-ui, sans-serif",
        background: `radial-gradient(1200px 500px at 20% -10%, ${COLORS.bgLight} 0%, transparent 60%), linear-gradient(180deg, ${COLORS.bgDark}, ${COLORS.bg})`,
      }}
    >
      <div className="mx-auto max-w-[1120px] px-5 pb-20 md:pb-5">
        {/* ================= HERO ================= */}
        <section className="grid grid-cols-1 items-start gap-6 py-7 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px]"
              style={{ background: COLORS.bgDark, borderColor: COLORS.line, color: COLORS.muted }}
            >
              Ao vivo e online • Turma limitada
            </span>
            <h1 className="mb-2.5 text-[clamp(30px,4vw,52px)] font-bold leading-[1.08] tracking-tight">
              O empresário que decide investimento com método cresce com menos risco.
            </h1>
            <p className="mb-4 text-lg" style={{ color: COLORS.muted }}>
              Em uma imersão prática, você aprende a organizar caixa, priorizar alocação e acelerar crescimento com disciplina financeira.
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {["📅 22 e 23 de Setembro • 20h", "💻 100% Online", "🎯 Foco em negócio real"].map((c) => (
                <span key={c} className={chip} style={chipStyle}>{c}</span>
              ))}
            </div>

            <div className="mb-4 flex items-end gap-2.5">
              <span className="text-lg line-through" style={{ color: COLORS.muted }}>de R$197</span>
              <span className="text-[34px] font-extrabold">por R$47</span>
            </div>
            <p className="text-[13px]" style={{ color: COLORS.muted }}>
              Pagamento seguro • Acesso imediato após confirmação
            </p>

            <a
              href="#form"
              className="mt-4 inline-block rounded-xl px-[18px] py-3.5 font-bold text-white transition hover:-translate-y-px"
              style={{
                background: `linear-gradient(180deg, ${COLORS.primaryLight}, ${COLORS.primary})`,
                boxShadow: "0 10px 24px rgba(132,11,10,.35)",
              }}
            >
              Garantir minha vaga agora
            </a>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[["Dias", d], ["Horas", h], ["Min", m], ["Seg", s]].map(([label, val]) => (
                <div
                  key={label as string}
                  className="rounded-[10px] border p-2.5 text-center"
                  style={{ background: COLORS.bgDark, borderColor: COLORS.line }}
                >
                  <div className="text-[26px] font-extrabold tabular-nums">{String(val).padStart(2, "0")}</div>
                  <div className="text-xs" style={{ color: COLORS.muted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM CARD */}
          <div
            id="form"
            className="rounded-[14px] border p-[18px]"
            style={{
              background: `linear-gradient(180deg, ${COLORS.bgLighter}, ${COLORS.card})`,
              borderColor: COLORS.line,
              boxShadow: "0 18px 40px rgba(0,0,0,.45)",
            }}
          >
            <h3 className="mb-1.5 text-xl font-bold">Falta pouco para concluir sua inscrição</h3>
            <p className="text-[13px]" style={{ color: COLORS.muted }}>
              Preencha e avance para a página de pagamento. Leva menos de 1 minuto.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-2">
              <FormField label="Nome completo" error={errors.nome ? "Informe seu nome completo." : undefined}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} style={inputStyle} placeholder="Seu nome" />
              </FormField>
              <FormField label="WhatsApp" error={errors.whatsapp ? "Informe um WhatsApp válido." : undefined}>
                <input inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} style={inputStyle} placeholder="(11) 90000-0000" />
              </FormField>
              <FormField label="E-mail" error={errors.email ? "Informe um e-mail válido." : undefined}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} style={inputStyle} placeholder="voce@empresa.com" />
              </FormField>
              <FormField label="Porte da empresa">
                <select value={porte} onChange={(e) => setPorte(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Selecione</option>
                  <option>MEI/Autônomo</option>
                  <option>Pequena</option>
                  <option>Média</option>
                  <option>Grande</option>
                </select>
              </FormField>

              <label className="mt-3 flex items-start gap-2 text-[13px]" style={{ color: COLORS.muted }}>
                <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} className="mt-1" />
                <span>Concordo com o tratamento dos meus dados para comunicações deste evento.</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl px-[18px] py-3.5 font-bold text-white transition disabled:opacity-70"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.primaryLight}, ${COLORS.primary})`,
                  boxShadow: "0 10px 24px rgba(132,11,10,.35)",
                }}
              >
                {loading ? "Enviando…" : "Quero garantir minha vaga"}
              </button>
              {ok && (
                <p className="mt-3 text-[13px]" style={{ color: "#9be3a8" }}>
                  Cadastro concluído. Redirecionando…
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ================= MÉTODO ================= */}
        <section className="py-8">
          <p className="text-xs uppercase tracking-widest" style={{ color: COLORS.primaryLighter }}>O método</p>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">As 4 Alavancas do Capital Empresarial</h2>
          <p className="mb-4" style={{ color: COLORS.muted }}>
            Enquanto uma alavanca estiver mal calibrada, o crescimento da empresa perde eficiência.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["1. Caixa Estratégico", "Separar operação, reserva e expansão sem sufocar o negócio."],
              ["2. Alocação de Capital", "Definir prioridade de investimento por retorno e prazo."],
              ["3. Gestão de Risco", "Blindar decisão contra impulso e cenário volátil."],
            ].map(([t, dsc]) => (
              <div key={t} className="rounded-xl border p-3.5" style={itemStyle}>
                <strong className="block mb-1">{t}</strong>
                <p className="text-sm" style={{ color: COLORS.muted }}>{dsc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= GRADE ================= */}
        <section className="py-8">
          <p className="text-xs uppercase tracking-widest" style={{ color: COLORS.primaryLighter }}>A grade</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Em 2 dias, um plano prático para execução</h2>

          {[
            ["Dia 1", "Diagnóstico e destravamento financeiro", "Onde o dinheiro está sendo mal alocado e como corrigir rápido."],
            ["Dia 2", "Plano de crescimento com disciplina de capital", "Modelo de decisão para os próximos 30 dias da empresa."],
          ].map(([tag, title, desc]) => (
            <div
              key={tag}
              className="mb-2.5 grid grid-cols-[120px_1fr] items-start gap-3.5 rounded-xl border p-3.5"
              style={itemStyle}
            >
              <div
                className="rounded-[10px] border p-2 text-center font-bold text-white"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  borderColor: COLORS.primaryDark,
                }}
              >
                {tag}
              </div>
              <div>
                <strong className="block mb-1">{title}</strong>
                <p className="text-sm" style={{ color: COLORS.muted }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ================= OFERTA ================= */}
        <section className="py-8">
          <p className="text-xs uppercase tracking-widest" style={{ color: COLORS.primaryLighter }}>A oferta</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Tudo que está incluído</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["Imersão ao vivo", "2 encontros com aplicação prática."],
              ["Mapa de decisão", "Framework para priorizar investimentos."],
              ["Replay + checklist", "Revisão e execução no seu ritmo."],
            ].map(([t, dsc]) => (
              <div key={t} className="rounded-xl border p-3.5" style={itemStyle}>
                <strong className="block mb-1">{t}</strong>
                <p className="text-sm" style={{ color: COLORS.muted }}>{dsc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PROVA ================= */}
        <section className="py-8">
          <p className="text-xs uppercase tracking-widest" style={{ color: COLORS.primaryLighter }}>Prova e autoridade</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Resultados que importam para empresário</h2>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {[
              ["+1.200", "empresários impactados em treinamentos."],
              ["+R$ XX mi", "em decisões de alocação orientadas por método."],
              ["NPS 9,2", "média de satisfação dos participantes."],
            ].map(([n, dsc]) => (
              <div key={n} className="rounded-xl border p-4" style={itemStyle}>
                <div className="text-2xl font-extrabold">{n}</div>
                <p className="text-sm" style={{ color: COLORS.muted }}>{dsc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="py-8">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
          {[
            ["Preciso ser especialista em investimentos?", "Não. O conteúdo é aplicado para empresários em diferentes níveis."],
            ["É só teoria?", "Não. A proposta é sair com plano executável em 30 dias."],
            ["Vou receber acesso depois do pagamento?", "Sim, acesso imediato após confirmação."],
          ].map(([q, a]) => (
            <details key={q} className="my-2 rounded-[10px] border p-3" style={itemStyle}>
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>{a}</p>
            </details>
          ))}
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-8">
          <div
            className="grid grid-cols-1 items-center gap-3 rounded-[14px] border p-[18px] md:grid-cols-2"
            style={{
              background: `linear-gradient(135deg, ${COLORS.bgLighter}, ${COLORS.bgDark})`,
              borderColor: COLORS.line,
            }}
          >
            <div>
              <h2 className="mb-1 text-2xl font-bold tracking-tight">
                Uma decisão boa de capital pode mudar seu próximo trimestre.
              </h2>
              <p style={{ color: COLORS.muted }}>
                Garanta sua vaga agora e avance para a inscrição completa.
              </p>
            </div>
            <div className="md:text-right">
              <a
                href="#form"
                className="inline-block rounded-xl px-[18px] py-3.5 font-bold text-white transition hover:-translate-y-px"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.primaryLight}, ${COLORS.primary})`,
                  boxShadow: "0 10px 24px rgba(132,11,10,.35)",
                }}
              >
                Quero minha vaga
              </a>
            </div>
          </div>
        </section>

        <footer className="py-6 text-center text-xs" style={{ color: COLORS.muted }}>
          © 2026 Sua Empresa • Política de Privacidade • Termos de Uso
        </footer>
      </div>

      {/* STICKY MOBILE */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t p-2.5 backdrop-blur md:hidden"
        style={{ background: "rgba(38,39,44,.94)", borderColor: COLORS.line }}
      >
        <a
          href="#form"
          className="block w-full rounded-xl px-[18px] py-3.5 text-center font-bold text-white"
          style={{ background: `linear-gradient(180deg, ${COLORS.primaryLight}, ${COLORS.primary})` }}
        >
          Garantir vaga agora
        </a>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="my-2.5 flex flex-col gap-1.5">
      <label className="text-sm">{label}</label>
      {children}
      {error && <span className="text-xs" style={{ color: "#c4302f" }}>{error}</span>}
    </div>
  );
}
