import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";
import { HeroBackground } from "@/components/HeroBackground";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Countdown } from "@/components/Countdown";
import { FAQ } from "@/components/FAQ";
import { LearnCards } from "@/components/LearnCards";
import logoAgora from "@/assets/logo-agora.png.asset.json";
import logoEspecialista from "@/assets/logo-especialista.png.asset.json";

// =====================================================================
// PLACEHOLDERS DO EVENTO — trocar aqui antes de publicar.
// =====================================================================
const EVENTO = {
  DATA_EVENTO: "{{DATA_EVENTO}}",            // Ex.: "15 de Setembro de 2026"
  DATA_ISO: "",                              // Ex.: "2026-09-15T19:00:00-03:00" (habilita contador)
  HORARIO_EVENTO: "{{HORARIO_EVENTO}}",      // Ex.: "19h às 22h"
  CIDADE_EVENTO: "{{CIDADE_EVENTO}}",        // Ex.: "São Paulo — SP"
  LOCAL_EVENTO: "{{LOCAL_EVENTO}}",          // Ex.: "Hotel Fasano, Jardins"
};

const CONTATO = {
  WHATSAPP_LINK: "{{WHATSAPP_LINK}}",        // Ex.: https://wa.me/55...
  EMAIL_CONTATO: "{{EMAIL_CONTATO}}",
  PRIVACY_URL: "{{PRIVACY_URL}}",
  TERMOS_URL: "{{TERMOS_URL}}",
};

// SEO — Schema.org Event
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Encontro Exclusivo para Empresários",
  startDate: EVENTO.DATA_ISO || "{{DATA_EVENTO_ISO}}",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: EVENTO.LOCAL_EVENTO,
    address: EVENTO.CIDADE_EVENTO,
  },
  description:
    "Encontro presencial exclusivo para empresários sobre alavancagem patrimonial, investimento, aplicação e oportunidades com leilão.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Encontro Exclusivo para Empresários | Alavancagem & Investimento" },
      {
        name: "description",
        content:
          "Evento presencial exclusivo para empresários. Alavancagem patrimonial, investimento, aplicação e oportunidades com leilão. Vagas limitadas.",
      },
      { property: "og:title", content: "Encontro Exclusivo para Empresários" },
      {
        property: "og:description",
        content:
          "Um encontro presencial para empresários que projetam o futuro de seus negócios e de sua família. Vagas limitadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(eventSchema),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // GSAP: entradas por scroll
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-chip]", { y: 20, opacity: 0, stagger: 0.08, duration: 0.6 })
        .from("[data-hero-title]", { y: 40, opacity: 0, duration: 0.9 }, "-=0.3")
        .from("[data-hero-sub]", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-hero-meta]", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from("[data-hero-cta]", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");

      // Reveal por scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // anime.js: hover pulse nos CTAs primários
  useEffect(() => {
    const btns = document.querySelectorAll<HTMLElement>("[data-anime-cta]");
    btns.forEach((btn) => {
      const onEnter = () => animate(btn, { scale: 1.03, duration: 300, ease: "outElastic(1, .6)" });
      const onLeave = () => animate(btn, { scale: 1, duration: 300, ease: "outCubic" });
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
    });
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground">
      {/* ================ HEADER ================ */}
      <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logos brancas invertidas para uso em fundo claro */}
            <img
              src={logoEspecialista.url}
              alt="Especialista em Investimento e Alavancagem Patrimonial"
              className="h-14 w-auto sm:h-16"
              style={{ filter: "invert(1) brightness(0)" }}
            />
            <div className="hidden h-8 w-px bg-border sm:block" />
            <img
              src={logoAgora.url}
              alt="Agora"
              className="hidden h-14 w-auto sm:block sm:h-16"
              style={{ filter: "invert(1) brightness(0)" }}
            />
          </div>
          <a href="#cadastro" data-anime-cta className="btn-primary !py-2.5 !px-5 text-sm">
            Quero minha vaga
          </a>
        </div>
      </header>

      {/* ================ HERO ================ */}
      <section className="relative overflow-hidden pt-32 pb-24 text-white" style={{ background: "linear-gradient(180deg, #17181c 0%, #33353b 100%)" }}>
        <HeroBackground />
        {/* red accent glow */}
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #850605 0%, transparent 70%)" }}
        />

        <div className="container-app relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {["Vagas limitadas", "Evento presencial", "Conteúdo estratégico"].map((c) => (
                <span
                  key={c}
                  data-hero-chip
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#850605" }} />
                  {c}
                </span>
              ))}
            </div>

            <h1
              data-hero-title
              className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl"
            >
              Encontro Exclusivo <br className="hidden sm:block" />
              <span style={{ color: "#ff5a58" }}>para Empresários</span>
            </h1>
            <p data-hero-sub className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Uma conversa direta sobre alavancagem patrimonial, investimento, aplicação e
              oportunidades com leilão. Negócios que projetam o futuro da sua empresa
              e da sua família.
            </p>

            <div
              data-hero-meta
              className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-left sm:grid-cols-4"
            >
              {[
                ["Data", EVENTO.DATA_EVENTO],
                ["Horário", EVENTO.HORARIO_EVENTO],
                ["Cidade", EVENTO.CIDADE_EVENTO],
                ["Local", EVENTO.LOCAL_EVENTO],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{label}</div>
                  <div className="mt-1 truncate text-sm font-semibold text-white">{val}</div>
                </div>
              ))}
            </div>

            {EVENTO.DATA_ISO && (
              <div className="mt-8 flex justify-center">
                <Countdown targetISO={EVENTO.DATA_ISO} />
              </div>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a data-hero-cta data-anime-cta href="#cadastro" className="btn-primary">
                Garantir vaga →
              </a>
              <a
                data-hero-cta
                href={CONTATO.WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Falar com a equipe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================ PARA QUEM ================ */}
      <section className="section-pad">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="chip">Para quem é</span>
            <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
              Um encontro para quem lidera decisões
            </h2>
            <p className="mt-4 text-base text-ink-soft">
              Conteúdo desenhado para empresários que enxergam além do curto prazo.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { t: "Empresários de qualquer segmento", d: "Indústria, comércio, serviços, tecnologia — a visão estratégica é comum." },
              { t: "Crescimento patrimonial estruturado", d: "Para quem busca solidez, previsibilidade e proteção do que já construiu." },
              { t: "Networking qualificado", d: "Uma sala com decisores que compartilham visão de longo prazo." },
            ].map((x) => (
              <div key={x.t} data-reveal className="rounded-2xl border bg-white p-7 shadow-[var(--shadow-card)]">
                <div className="mb-4 h-1 w-10 rounded-full" style={{ background: "#850605" }} />
                <h3 className="text-lg font-bold text-ink">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================ O QUE VAI APRENDER ================ */}
      <section className="section-pad bg-muted">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="chip">Programação</span>
            <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
              O que você vai levar deste encontro
            </h2>
            <p className="mt-4 text-base text-ink-soft">
              Quatro frentes objetivas, com aplicação imediata para empresários.
            </p>
          </div>
          <div className="mt-14" data-reveal>
            <LearnCards />
          </div>

          <div className="mt-14 text-center" data-reveal>
            <a href="#cadastro" data-anime-cta className="btn-primary">Quero participar</a>
          </div>
        </div>
      </section>

      {/* ================ AUTORIDADE / PROVA SOCIAL ================ */}
      <section className="section-pad">
        <div className="container-app">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div data-reveal>
              <span className="chip">Autoridade</span>
              <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
                Uma curadoria construída sobre resultados reais
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                Trabalhamos ao lado de empresários que buscam decisões mais firmes sobre
                capital, patrimônio e crescimento. Este encontro é a extensão presencial
                dessa entrega: conteúdo direto, sem promessas irreais, com foco em
                clareza e execução.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {["Presencial", "Convidados", "Estratégico"].map((k) => (
                  <div key={k} className="rounded-xl border bg-white p-4 text-center">
                    <div className="text-sm font-semibold text-ink">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} data-reveal className="rounded-2xl border bg-white p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <div className="text-sm font-semibold text-ink">Depoimento em breve</div>
                      <div className="text-xs text-muted-foreground">Empresário convidado</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                    “Espaço reservado para depoimento real de participante. Substitua por
                    conteúdo autêntico após o evento.”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================ URGÊNCIA ================ */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "#850605" }}>
        <div aria-hidden className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.3), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,.15), transparent 40%)" }} />
        <div className="container-app relative text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Vagas limitadas
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            O número de vagas é restrito por cidade. Garanta a sua com antecedência.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Por ser um encontro presencial e exclusivo, mantemos a sala em tamanho reduzido para preservar a qualidade da conversa.
          </p>
          {EVENTO.DATA_ISO && (
            <div className="mt-8 flex justify-center">
              <Countdown targetISO={EVENTO.DATA_ISO} />
            </div>
          )}
          <div className="mt-8">
            <a
              href="#cadastro"
              data-anime-cta
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand shadow-lg transition hover:bg-white/95"
            >
              Reservar minha vaga →
            </a>
          </div>
        </div>
      </section>

      {/* ================ FORMULÁRIO ================ */}
      <section id="cadastro" className="section-pad bg-muted">
        <div className="container-app">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div data-reveal>
              <span className="chip">Cadastro</span>
              <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
                Solicite sua vaga agora
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                Preencha seus dados para receber a confirmação. Nossa equipe entrará em contato para finalizar sua inscrição.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-ink">
                {[
                  "Confirmação personalizada pela equipe",
                  "Local e horário enviados após aprovação",
                  "Seus dados protegidos conforme a LGPD",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: "#850605" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="rounded-3xl border bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* ================ FAQ ================ */}
      <section className="section-pad">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="chip">Perguntas frequentes</span>
            <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
              Ainda tem dúvidas?
            </h2>
          </div>
          <div className="mt-12" data-reveal>
            <FAQ />
          </div>
        </div>
      </section>

      {/* ================ RODAPÉ ================ */}
      <footer className="border-t bg-ink text-white/80" style={{ background: "#33353b" }}>
        <div className="container-app py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-4">
                <img src={logoEspecialista.url} alt="Especialista" className="h-9 w-auto" />
                <img src={logoAgora.url} alt="Agora" className="h-9 w-auto" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                Encontro presencial exclusivo para empresários. Conteúdo direto sobre patrimônio, investimento e leilão.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-white">Contato</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a className="hover:text-white" href={CONTATO.WHATSAPP_LINK}>WhatsApp</a></li>
                <li><a className="hover:text-white" href={`mailto:${CONTATO.EMAIL_CONTATO}`}>{CONTATO.EMAIL_CONTATO}</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-white">Legal</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a className="hover:text-white" href={CONTATO.PRIVACY_URL}>Política de Privacidade</a></li>
                <li><a className="hover:text-white" href={CONTATO.TERMOS_URL}>Termos de Uso</a></li>
                <li className="text-white/50">Tratamos seus dados conforme a LGPD.</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
