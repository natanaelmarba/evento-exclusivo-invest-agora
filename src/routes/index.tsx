import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import logoAgora from "@/assets/logo-agora.png.asset.json";
import logoVerticale from "@/assets/logo-especialista.png.asset.json";

// =====================================================================
// PLACEHOLDERS — trocar antes de publicar.
// =====================================================================
const WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20no%20encontro%20exclusivo%20para%20empres%C3%A1rios.";
const WEBHOOK_URL = "{{WEBHOOK_URL}}";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Encontro Exclusivo para Empresários — Invest Agora",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  description:
    "Encontro exclusivo por convite para empresários sobre alavancagem patrimonial, investimento, aplicação e oportunidades com leilão.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Encontro Exclusivo para Empresários | Invest Agora × Verticale" },
      {
        name: "description",
        content:
          "Um encontro por convite para empresários que querem projetar o futuro com alavancagem patrimonial, investimento, aplicação e oportunidades com leilão.",
      },
      { property: "og:title", content: "Encontro Exclusivo para Empresários | Invest Agora" },
      {
        property: "og:description",
        content:
          "Negócios que interessam para você e sua família: alavancagem patrimonial, investimento, aplicação e leilão. Vagas limitadas na sua cidade.",
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
      setNome(""); setEmail(""); setWhatsapp(""); setEmpresa(""); setCidade(""); setSegmento(""); setLgpd(false);
    } catch {
      alert("Falha ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

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
          <a
            href="#form"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
            style={{ borderColor: C.line, color: C.text }}
          >
            Quero meu convite
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1160px] px-5 pb-24">
        {/* ============= HERO ============= */}
        <section className="grid grid-cols-1 items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <span
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest"
              style={{ borderColor: C.line, color: C.accent, background: `${C.accentDark}30` }}
            >
              ● Encontro por convite • Vagas limitadas
            </span>
            <h1 className="mb-4 text-[clamp(34px,5vw,60px)] font-extrabold leading-[1.05] tracking-tight">
              Negócios que projetam <span style={{ color: C.accent }}>você e sua família</span> para o futuro.
            </h1>
            <p className="mb-6 max-w-xl text-lg leading-relaxed" style={{ color: C.muted }}>
              Um encontro exclusivo para empresários de qualquer segmento sobre{" "}
              <strong className="text-white">alavancagem patrimonial, investimento, aplicação</strong> e{" "}
              <strong className="text-white">oportunidades com leilão</strong>. Presencial, na sua cidade.
            </p>

            <div className="mb-8 flex flex-wrap gap-2">
              {[
                "🎯 Alavancagem patrimonial",
                "📈 Investimento & aplicação",
                "🏛️ Oportunidades com leilão",
                "🤝 Networking qualificado",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border px-3 py-1.5 text-[13px]"
                  style={{ borderColor: C.line, color: C.muted, background: C.bgCard }}
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-white transition hover:-translate-y-px"
                style={{
                  background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
                  boxShadow: `0 12px 32px ${C.accentDark}88`,
                }}
              >
                Solicitar meu convite →
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-semibold transition hover:bg-white/5"
                style={{ borderColor: C.line }}
              >
                Falar no WhatsApp
              </a>
            </div>
            <p className="mt-4 text-[13px]" style={{ color: C.muted }}>
              Sem compromisso · confirmação da equipe em até 24h
            </p>
          </div>

          {/* FORM CARD */}
          <div
            id="form"
            className="rounded-2xl border p-6 md:p-7"
            style={{
              background: `linear-gradient(180deg, ${C.bgCard2}, ${C.bgCard})`,
              borderColor: C.line,
              boxShadow: "0 30px 80px rgba(0,0,0,.55)",
            }}
          >
            <h3 className="mb-1 text-xl font-bold">Solicite seu convite</h3>
            <p className="mb-4 text-[13px]" style={{ color: C.muted }}>
              As vagas são limitadas. Após o cadastro, nossa equipe entra em contato para confirmar.
            </p>

            <form onSubmit={onSubmit} noValidate className="space-y-3">
              <Field label="Nome completo*" error={errors.nome && "Informe seu nome."}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} style={inputStyle} placeholder="Seu nome" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="WhatsApp*" error={errors.whatsapp && "WhatsApp inválido."}>
                  <input inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} style={inputStyle} placeholder="(11) 90000-0000" />
                </Field>
                <Field label="E-mail*" error={errors.email && "E-mail inválido."}>
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
              <Field label="Cidade*" error={errors.cidade && "Informe sua cidade."}>
                <input value={cidade} onChange={(e) => setCidade(e.target.value)} className={inputCls} style={inputStyle} placeholder="Sua cidade" />
              </Field>

              <label className="flex items-start gap-2 pt-1 text-[13px]" style={{ color: C.muted }}>
                <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} className="mt-1 accent-[#e11f1d]" />
                <span>Autorizo o contato da equipe organizadora, conforme a LGPD, para tratar da minha inscrição.</span>
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
                {loading ? "Enviando…" : "Quero garantir minha vaga"}
              </button>
              {ok && (
                <p className="rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: "#1f5f3a", background: "#0d2a1c", color: "#a6f0c1" }}>
                  Cadastro recebido! Nossa equipe entrará em contato em breve.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ============= PARA QUEM É ============= */}
        <Section eyebrow="Para quem é" title="Empresários que querem crescer com estratégia">
          <p className="mb-8 max-w-3xl text-lg" style={{ color: C.muted }}>
            Se o seu negócio se encaixa em um destes perfis, este encontro foi desenhado para você.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Empresários em expansão", "Quem já fatura bem e quer transformar lucro em patrimônio sólido — sem depender só do caixa da empresa."],
              ["Famílias empresárias", "Sócios e famílias que querem estruturar sucessão, proteção e crescimento em conjunto."],
              ["Investidores estratégicos", "Empresários que já investem e buscam método para alocar melhor, inclusive em leilão."],
            ].map(([t, d]) => (
              <Card key={t}>
                <h3 className="mb-2 text-lg font-bold">{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= O QUE VAMOS TRATAR ============= */}
        <Section eyebrow="O que vamos tratar no encontro" title="Negócios que interessam para você e sua família">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Alavancagem patrimonial", "Como usar estrutura e capital de forma inteligente para acelerar o crescimento sem comprometer a operação."],
              ["Investimento & aplicação", "Critérios claros para decidir onde alocar capital em diferentes cenários de risco e liquidez."],
              ["Oportunidades com leilão", "Um dos caminhos mais estratégicos — e menos explorados — para expansão patrimonial com desconto real."],
              ["Crescimento com proteção", "Como projetar a empresa e a família para o próximo ciclo, com disciplina e blindagem de riscos."],
            ].map(([t, d], i) => (
              <Card key={t}>
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: `${C.accentDark}66`, color: C.accent, border: `1px solid ${C.line}` }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-1 text-lg font-bold">{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= COMO FUNCIONA ============= */}
        <Section eyebrow="Como funciona" title="Um encontro objetivo, do convite à confirmação">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01 · Solicitação", "Você preenche o formulário e nos conta um pouco sobre a sua empresa."],
              ["02 · Validação", "Nossa equipe analisa o perfil e confirma sua vaga por WhatsApp em até 24h."],
              ["03 · Encontro", "No dia, você recebe os detalhes do local, credenciamento e agenda do encontro."],
            ].map(([t, d]) => (
              <Card key={t}>
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-widest" style={{ color: C.accent }}>{t.split(" · ")[0]}</p>
                <h3 className="mb-2 text-lg font-bold">{t.split(" · ")[1]}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= PROVA SOCIAL ============= */}
        <Section eyebrow="Quem já participou" title="O que dizem os empresários">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["“Saí do encontro com clareza absoluta sobre onde alocar o próximo capital da empresa. Valeu cada minuto.”", "Ricardo M.", "Indústria de embalagens"],
              ["“A parte de leilão abriu uma porta que eu nem sabia que existia. Já estamos estruturando a primeira operação.”", "Camila A.", "Sócia · rede de clínicas"],
              ["“Networking de altíssimo nível. Fechei duas conversas de negócio direto no evento.”", "Eduardo P.", "Diretor · construtora"],
            ].map(([q, n, r]) => (
              <Card key={n}>
                <p className="mb-4 text-[15px] leading-relaxed">{q}</p>
                <p className="text-sm font-bold">{n}</p>
                <p className="text-xs" style={{ color: C.muted }}>{r}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ============= GARANTIA / SEGURANÇA ============= */}
        <Section eyebrow="Compromisso com você" title="Vaga garantida ou reembolso do seu tempo">
          <Card>
            <p className="text-base leading-relaxed" style={{ color: C.muted }}>
              O encontro é <strong className="text-white">gratuito e por convite</strong>. Se, no primeiro bloco, você
              sentir que o conteúdo não é para o seu momento de empresa, é só avisar a organização e você sai livre —
              sem burocracia. O risco é todo nosso.
            </p>
          </Card>
        </Section>

        {/* ============= FAQ ============= */}
        <Section eyebrow="Dúvidas frequentes" title="Tudo o que você precisa saber">
          <div className="space-y-3">
            {[
              ["Quem pode participar?", "Empresários de qualquer segmento interessados em crescimento patrimonial estruturado e networking qualificado."],
              ["O evento é pago?", "Não. As vagas são por convite. Após o cadastro, nossa equipe entra em contato para confirmar sua presença."],
              ["Onde acontece?", "O encontro é presencial, na sua cidade. Detalhes de local e horário são enviados após a confirmação."],
              ["Posso levar um sócio ou acompanhante?", "Cada convite é nominal. Consulte a equipe sobre disponibilidade de vagas adicionais."],
              ["Como confirmo minha inscrição?", "Preencha o formulário. Nossa equipe entra em contato por WhatsApp para confirmar os detalhes."],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-xl border p-4 open:pb-5"
                style={{ background: C.bgCard, borderColor: C.line }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {q}
                  <span className="ml-4 grid h-7 w-7 place-items-center rounded-full border text-lg transition group-open:rotate-45" style={{ borderColor: C.line, color: C.accent }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ============= FINAL CTA ============= */}
        <section className="pt-8 md:pt-14">
          <div
            className="grid grid-cols-1 items-center gap-6 rounded-3xl border p-8 md:grid-cols-[1.2fr_.8fr] md:p-12"
            style={{
              background: `linear-gradient(135deg, ${C.accentDark}66, ${C.bgCard})`,
              borderColor: C.line,
            }}
          >
            <div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                As vagas são limitadas. Não fique de fora.
              </h2>
              <p className="text-lg" style={{ color: C.muted }}>
                Solicite seu convite hoje e dê o próximo passo no crescimento da sua empresa e do patrimônio da sua família.
              </p>
            </div>
            <div className="md:text-right">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-white transition hover:-translate-y-px"
                style={{
                  background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
                  boxShadow: `0 14px 30px ${C.accentDark}99`,
                }}
              >
                Quero meu convite agora →
              </a>
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
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t p-3 backdrop-blur md:hidden"
        style={{ background: "rgba(28,29,33,.92)", borderColor: C.line }}
      >
        <a
          href="#form"
          className="block w-full rounded-full px-5 py-3.5 text-center font-bold text-white"
          style={{ background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})` }}
        >
          Solicitar meu convite
        </a>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border p-3 text-white outline-none transition placeholder:text-white/40 focus:border-[#7cc3ff] focus:ring-4 focus:ring-[#7cc3ff]/15";
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

