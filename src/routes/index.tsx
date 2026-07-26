import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

// =====================================================================
// PLACEHOLDERS — trocar aqui antes de publicar.
// =====================================================================
const WEBHOOK_URL = "{{WEBHOOK_URL}}"; // Endpoint para receber os cadastros
const DATA_ISO = "2026-09-15T20:00:00-03:00"; // Data/hora do evento (contador)

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Evento Online para Empresários",
  startDate: DATA_ISO,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: "https://evento-exclusivo-invest-agora.lovable.app/",
  },
  description:
    "Evento online para empresários com estratégias práticas de investimento e crescimento empresarial.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evento Online para Empresários | Investimento e Negócios" },
      {
        name: "description",
        content:
          "Participe do evento online para empresários e aprenda estratégias práticas de investimento e crescimento empresarial.",
      },
      { property: "og:title", content: "Evento Online para Empresários | Investimento e Negócios" },
      {
        property: "og:description",
        content:
          "Participe do evento online para empresários e aprenda estratégias práticas de investimento e crescimento empresarial.",
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
      setOk(true);
      setNome(""); setEmail(""); setWhatsapp(""); setPorte(""); setLgpd(false);
    } catch {
      alert("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#0b1020,#0f172a)", color: "#e9edf7", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[1100px] px-5">
        {/* ============= HERO ============= */}
        <section className="grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="inline-block rounded-full border border-[#334155] bg-[#1e293b] px-3 py-1.5 text-[13px] text-[#cbd5e1]">
              Evento Online ao Vivo • Vagas Limitadas
            </span>
            <h1 className="mt-3 text-[clamp(30px,4vw,52px)] font-bold leading-[1.1]">
              Empresários que investem melhor crescem mais rápido.
            </h1>
            <p className="mt-3 text-lg text-[#a8b1c7]">
              Em 90 minutos, você aprende um método prático para tomar decisões de investimento e expansão com mais segurança.
            </p>

            <div className="mb-5 mt-4 flex flex-wrap gap-2.5">
              {["📅 15/09 • 20h", "💻 100% Online", "🎯 Foco em negócios e investimento"].map((p) => (
                <span key={p} className="rounded-full border border-[#273656] bg-[#0f1a33] px-3 py-2 text-[13px] text-[#c7d2fe]">
                  {p}
                </span>
              ))}
            </div>

            <a href="#form" className="inline-block rounded-xl bg-[#2563eb] px-[18px] py-3.5 font-bold text-white transition hover:-translate-y-px hover:bg-[#1d4ed8]">
              Garantir minha vaga gratuita
            </a>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                ["Dias", d], ["Horas", h], ["Min", m], ["Seg", s],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-[10px] border border-[#2b3954] bg-[#0d1528] p-2.5 text-center">
                  <div className="text-[26px] font-extrabold tabular-nums">{String(val).padStart(2, "0")}</div>
                  <div className="text-xs text-[#a8b1c7]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ============= FORM CARD ============= */}
          <div id="form" className="rounded-[14px] border border-[#263148] bg-[rgba(17,23,43,.9)] p-[18px] shadow-[0_10px_25px_rgba(0,0,0,.25)]">
            <h3 className="m-0 mb-2.5 text-xl font-bold">Inscrição rápida</h3>
            <p className="text-[13px] text-[#a8b1c7]">Preencha os dados e receba o link da transmissão.</p>

            <form onSubmit={onSubmit} noValidate className="mt-2">
              <FormField label="Nome" error={errors.nome ? "Digite seu nome." : undefined}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} placeholder="Seu nome" />
              </FormField>
              <FormField label="E-mail" error={errors.email ? "Digite um e-mail válido." : undefined}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="voce@empresa.com" />
              </FormField>
              <FormField label="WhatsApp (com DDD)" error={errors.whatsapp ? "Digite um WhatsApp válido." : undefined}>
                <input inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} placeholder="(11) 90000-0000" />
              </FormField>
              <FormField label="Porte da empresa">
                <select value={porte} onChange={(e) => setPorte(e.target.value)} className={inputCls}>
                  <option value="">Selecione</option>
                  <option>MEI / Autônomo</option>
                  <option>Pequena</option>
                  <option>Média</option>
                  <option>Grande</option>
                </select>
              </FormField>

              <label className="mt-3 flex items-start gap-2 text-[13px] text-[#a8b1c7]">
                <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} className="mt-1" />
                <span>Concordo com o uso dos meus dados para comunicações sobre este evento.</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#2563eb] px-[18px] py-3.5 font-bold text-white transition hover:bg-[#1d4ed8] disabled:opacity-70"
              >
                {loading ? "Enviando…" : "Quero participar"}
              </button>
              {ok && (
                <p className="mt-3 text-[13px] text-[#86efac]">Inscrição enviada com sucesso.</p>
              )}
            </form>
          </div>
        </section>

        {/* ============= APRENDIZADOS ============= */}
        <section className="py-8">
          <h2 className="mb-3.5 text-3xl font-bold">O que você vai aprender</h2>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {[
              ["1) Critérios de investimento", "Como avaliar risco, prazo e retorno com método."],
              ["2) Alocação inteligente", "Como distribuir capital sem comprometer caixa e operação."],
              ["3) Plano de 30 dias", "Checklist prático para executar no dia seguinte."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-[#263148] bg-[#0f172a] p-4">
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-[#a8b1c7]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============= PALESTRANTES ============= */}
        <section className="py-8">
          <h2 className="mb-3.5 text-3xl font-bold">Palestrantes e convidados</h2>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {[
              ["Especialista em Negócios", "+10 anos em estratégia e crescimento."],
              ["Especialista em Investimentos", "Cases com foco em rentabilidade empresarial."],
              ["Convidado Influente", "Use nome/imagem apenas com autorização contratual."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-[#263148] bg-[#0f172a] p-4">
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-[#a8b1c7]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============= FAQ ============= */}
        <section className="py-8">
          <h2 className="mb-3.5 text-3xl font-bold">Perguntas frequentes</h2>
          {[
            ["O evento é gratuito?", "Sim, inscrição gratuita mediante cadastro."],
            ["Vai ficar gravado?", "Depende da política do evento. Informe aqui sua regra."],
            ["É para iniciantes?", "Sim. Conteúdo prático para empresários em diferentes níveis."],
          ].map(([q, a]) => (
            <details key={q} className="my-2.5 rounded-[10px] border border-[#273656] bg-[#0f172a] p-3">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-[#a8b1c7]">{a}</p>
            </details>
          ))}
        </section>

        <footer className="py-6 text-center text-[13px] text-[#94a3b8]">
          © 2026 Sua Marca • Política de Privacidade • Termos de Uso
        </footer>
      </div>

      {/* ============= STICKY MOBILE CTA ============= */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#22314d] bg-[#0b1020cc] p-2.5 backdrop-blur md:hidden">
        <a href="#form" className="block w-full rounded-xl bg-[#2563eb] px-[18px] py-3.5 text-center font-bold text-white">
          Garantir vaga agora
        </a>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-[#344154] bg-[#0d1528] p-3 text-white outline-none focus:border-[#4f7cf3]";

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="my-2.5 flex flex-col gap-1.5">
      <label className="text-sm">{label}</label>
      {children}
      {error && <span className="text-xs text-[#fca5a5]">{error}</span>}
    </div>
  );
}
