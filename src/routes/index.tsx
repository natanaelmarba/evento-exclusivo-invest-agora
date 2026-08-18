import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoAgora from "@/assets/logo-agora.png.asset.json";
import logoVerticale from "@/assets/logo-verticale.png.asset.json";
import dalmoFerrari from "@/assets/dalmo-ferrari.jpg.asset.json";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import { Reveal } from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// PLACEHOLDERS — trocar antes de publicar.
// =====================================================================
const WEBHOOK_URL = "{{WEBHOOK_URL}}";
const EVENT_DATE = "[DATA DO EVENTO]";
const EVENT_TIME = "[HORÁRIO]";
const CONTACT_WHATSAPP = "[Inserir WhatsApp]";
const CONTACT_EMAIL = "contato@verticaleassessoria.com.br";
const CONTACT_CNPJ = "30.077.407/0001-88";
const COMPANY_NAME = "VERTICALE SOLUÇÕES CORPORATIVAS LTDA";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Encontro Online Exclusivo para Empresários — Invest Agora",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  description:
    "Encontro estratégico online para empresários que desejam tomar decisões conscientes sobre investimentos, aplicação de capital, alavancagem patrimonial e operações de leilão.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Invest Agora | Encontro Online Exclusivo para Empresários" },
      {
        name: "description",
        content:
          "Encontro estratégico online para empresários. Investimentos, aplicação de capital, alavancagem patrimonial e operações de leilão com visão de longo prazo.",
      },
      { property: "og:title", content: "Invest Agora | Encontro Online Exclusivo para Empresários" },
      {
        property: "og:description",
        content:
          "Encontro estratégico online para empresários. Investimentos, aplicação de capital, alavancagem patrimonial e operações de leilão com visão de longo prazo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(eventSchema) }],
  }),
  component: LandingPage,
});

// Paleta: branco, PRETO (com variações) e vermelho #840B0A (com degradês)
const C = {
  bg: "var(--c-bg)",
  bgSoft: "var(--c-bg-soft)",
  bgCard: "var(--c-bg-card)",
  bgCard2: "var(--c-bg-card2)",
  line: "var(--c-line)",
  lineSoft: "var(--c-line-soft)",
  text: "var(--c-text)",
  muted: "var(--c-muted)",
  mutedSoft: "var(--c-muted-soft)",
  accent: "var(--c-accent)",
  accentSoft: "var(--c-accent-soft)",
  accentDark: "var(--c-accent-dark)",
  accentDeep: "var(--c-accent-deep)",
};

function LandingPage() {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const bioSectionRef = useRef<HTMLElement>(null);
  const bioImageRef = useRef<HTMLDivElement>(null);
  const bioImageInnerRef = useRef<HTMLImageElement>(null);
  const bioEyebrowRef = useRef<HTMLParagraphElement>(null);
  const bioTitleRef = useRef<HTMLHeadingElement>(null);
  const bioParagraphsRef = useRef<HTMLDivElement>(null);

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

  // Animações da seção de biografia
  useEffect(() => {
    const section = bioSectionRef.current;
    const imageWrap = bioImageRef.current;
    const imageInner = bioImageInnerRef.current;
    const eyebrow = bioEyebrowRef.current;
    const title = bioTitleRef.current;
    const paragraphs = bioParagraphsRef.current;
    if (!section || !imageWrap || !imageInner || !eyebrow || !title || !paragraphs) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set([imageWrap, eyebrow, title, paragraphs.children], { opacity: 1, x: 0, y: 0, clipPath: "inset(0 0 0 0)" });
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal cinematográfico da imagem: wipe da esquerda para direita
      gsap.set(imageWrap, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      gsap.to(imageWrap, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      // Parallax sutil na imagem ao scrollar
      gsap.to(imageInner, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Textos: sobe com fade + blur sutil
      const textTargets = [eyebrow, title, ...Array.from(paragraphs.children)];
      gsap.set(textTargets, { opacity: 0, y: 34, filter: "blur(6px)" });
      gsap.to(textTargets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-clip"
      style={{
        color: C.text,
        fontFamily: "Inter, system-ui, sans-serif",
        background: "var(--c-page-gradient)",
      }}
    >
      {/* subtle grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: "var(--c-noise-opacity)",
        }}
      />
      {/* ============= HEADER ============= */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: "var(--c-header-bg)", borderBottom: `1px solid ${C.lineSoft}` }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div aria-hidden className="hidden md:block" />
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: C.muted }}>
            <a href="#encontro" className="transition hover:opacity-70">O Encontro</a>
            <a href="#temas" className="transition hover:opacity-70">Temas</a>
            <a href="#publico" className="transition hover:opacity-70">Para Quem É</a>
            <a href="#inscricao" className="transition hover:opacity-70">Inscrição</a>
          </nav>
          <div className="flex items-center gap-3">
            <CtaButton onClick={openModal} variant="outline">
              Inscrever-me
            </CtaButton>
          </div>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1200px] px-5 pb-28 md:pb-24">
        {/* ============= HERO — Editorial Noir ============= */}
        <section className="relative flex flex-col items-center overflow-hidden pt-10 pb-8 text-center md:pt-24 md:pb-20">
          {/* ambient red glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 h-[360px] w-[140vw] max-w-[1000px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px] md:h-[560px]"
            style={{ background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 65%)` }}
          />

          <Reveal className="relative mb-10 flex flex-col items-center gap-5" stagger duration={1.1}>
            <span
              className="text-[11px] md:text-xs font-semibold uppercase"
              style={{ color: C.accent, letterSpacing: "0.4em" }}
            >
              — Acesso Privado —
            </span>
            <h1
              className="max-w-4xl text-[clamp(38px,5.6vw,76px)] font-bold leading-[1.02] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.text }}
            >
              Onde o capital encontra a{" "}
              <span className="italic" style={{ color: C.accent }}>estratégia.</span>
            </h1>
            <div className="mx-auto mt-2 h-px w-16" style={{ background: C.line }} />
          </Reveal>

          {/* VIDEO FRAME — cinematic */}
          <Reveal
            className="group relative w-full max-w-5xl overflow-hidden rounded-sm border"
            duration={1.3}
            y={40}
          >
            <div
              className="relative"
              style={{
                aspectRatio: "16 / 9",
                background: "linear-gradient(180deg, #1c1c20, #050506)",
                borderColor: "rgba(255,255,255,.08)",
                boxShadow: "0 40px 120px rgba(0,0,0,.35), 0 0 60px rgba(90,8,7,.35)",
              }}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={heroVideo.url}
                poster={heroPoster.url}
                controls
                playsInline
                preload="metadata"
              />

              {/* corner accents */}
              <span aria-hidden className="absolute top-4 left-4 h-px w-8" style={{ background: C.accent }} />
              <span aria-hidden className="absolute top-4 left-4 w-px h-8" style={{ background: C.accent }} />
              <span aria-hidden className="absolute bottom-4 right-4 h-px w-8" style={{ background: C.accent }} />
              <span aria-hidden className="absolute bottom-4 right-4 w-px h-8" style={{ background: C.accent }} />
              {/* frame labels */}
              <div
                className="absolute bottom-4 left-4 text-[10px] uppercase"
                style={{ color: "rgba(255,255,255,.55)", letterSpacing: "0.25em", fontFamily: "'Inter', sans-serif" }}
              >
                Reel / 001
              </div>
              <div
                className="absolute top-4 right-4 text-[10px] uppercase"
                style={{ color: "rgba(255,255,255,.55)", letterSpacing: "0.25em", fontFamily: "'Inter', sans-serif" }}
              >
                16:9 · Cinematic
              </div>
            </div>
          </Reveal>

          <Reveal className="relative mt-12 flex flex-col items-center gap-6" duration={1} delay={0.2}>
            <CtaButton onClick={openModal}>Solicite seu convite</CtaButton>
            <p
              className="max-w-md text-sm font-light tracking-wide"
              style={{ color: C.mutedSoft, fontFamily: "'Inter', sans-serif" }}
            >
              Um encontro estratégico para empresários que desejam decidir com mais visão sobre investimentos,
              alavancagem patrimonial e oportunidades em operações de leilão.
            </p>
          </Reveal>

          {/* editorial meta bar */}
          <Reveal
            className="relative mt-16 grid w-full max-w-4xl grid-cols-3 items-center gap-4 border-t pt-6 text-[10px] uppercase"
            duration={0.9}
            delay={0.3}
          >
            <span style={{ color: C.mutedSoft, letterSpacing: "0.2em" }}>{EVENT_DATE}</span>
            <span className="text-center" style={{ color: C.accent, letterSpacing: "0.25em" }}>
              Invest Agora
            </span>
            <span className="text-right" style={{ color: C.mutedSoft, letterSpacing: "0.2em" }}>
              Online · {EVENT_TIME}
            </span>
          </Reveal>
        </section>

        {/* ============= BIOGRAFIA ============= */}
        <section
          ref={bioSectionRef}
          id="biografia"
          className="on-red relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-12 md:py-24"
          style={{ background: "linear-gradient(180deg, #3a0504 0%, #840B0A 50%, #3a0504 100%)" }}
        >
          {/* fade superior/inferior para suavizar transição com as seções vizinhas */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-8 md:h-20"
            style={{ background: "linear-gradient(180deg, #5a0807 0%, transparent 100%)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 md:h-20"
            style={{ background: "linear-gradient(0deg, #5a0807 0%, transparent 100%)" }}
          />
          <div className="relative mx-auto max-w-[1200px] px-5">
            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-stretch">
              <div className="h-full min-h-[360px] md:min-h-full">
                <div
                  ref={bioImageRef}
                  className="group relative h-full overflow-hidden rounded-2xl border shadow-2xl"
                  style={{ borderColor: "rgba(255,255,255,.12)" }}
                >
                  {/* brilho de hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(600px 300px at 50% 0%, rgba(255,255,255,.18) 0%, transparent 60%)",
                    }}
                  />
                  <img
                    ref={bioImageInnerRef}
                    src={dalmoFerrari.url}
                    alt="Dalmo Ferrari — fundador do Grupo Verticale e especialista em investimentos"
                    className="h-[115%] w-full object-cover object-top transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
                    loading="lazy"
                    style={{ marginTop: "-7.5%" }}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p
                  ref={bioEyebrowRef}
                  className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#ffd1d1" }}
                >
                  Quem conduz
                </p>
                <h2
                  ref={bioTitleRef}
                  className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}
                >
                  Dalmo Ferrari
                </h2>
                <div ref={bioParagraphsRef} className="space-y-4 text-[15.5px] leading-relaxed md:text-base" style={{ color: "#f0e6e6" }}>
                  <p>
                    Paranaense, casado há mais de 25 anos e pai de duas filhas, Dalmo Ferrari é administrador de
                    empresas, graduado em Comércio Exterior e especialista em Blocos Econômicos. É fundador e
                    empresário à frente do Grupo Verticale e de suas empresas.
                  </p>
                  <p>
                    Com uma trajetória marcada pelo empreendedorismo, pela educação e pelo mercado de investimentos,
                    foi professor por quase uma década na FEMAR – Fundação de Estudos do Mar e na DLA International,
                    no Rio de Janeiro.
                  </p>
                  <p>
                    Atualmente, atua como especialista em aplicação de recursos, investimentos, alavancagem
                    patrimonial e operações de ciclo-alavancagem com imóveis de leilão, desenvolvendo estratégias
                    voltadas à construção, expansão e proteção patrimonial.
                  </p>
                  <p>
                    Ao longo de sua trajetória, construiu um amplo network empresarial e institucional, mantendo
                    relacionamento próximo com empresários e lideranças de diferentes setores. Essa rede de conexões
                    lhe proporciona acesso a informações e diferentes perspectivas sobre movimentos que podem impactar
                    o cenário político e econômico.
                  </p>
                  <p>
                    Seu conhecimento e experiência têm contribuído para transformar a forma como profissionais,
                    empreendedores e empresários enxergam dinheiro, investimentos e patrimônio.
                  </p>
                  <p>
                    Mais do que ensinar a investir, seu propósito é democratizar o conhecimento financeiro e
                    patrimonial, mostrando que oportunidades de crescimento não devem ser exclusivas de quem já
                    possui grandes recursos.
                  </p>
                  <p>
                    Seu objetivo é apresentar, de forma clara e prática, caminhos para que qualquer pessoa,
                    independentemente de sua condição social ou econômica, possa ampliar sua visão, tomar decisões
                    mais conscientes e construir um plano capaz de transformar sua trajetória financeira e
                    patrimonial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= CONTEXTO / DOR ============= */}
        <Section
          id="encontro"
          eyebrow="Contexto"
          title="Em um cenário de incertezas, improvisar com o patrimônio deixou de ser uma opção."
          variant="dark"
        >
          <div className="space-y-5 max-w-3xl text-[15.5px] leading-relaxed md:text-lg" style={{ color: C.muted }}>
            <p>
              Mudanças econômicas, tributárias e de mercado exigem separar urgência operacional de estratégia
              de longo prazo. Construir patrimônio sólido pede a mesma maturidade que construir uma empresa:
              análise, diversificação, visão e decisão.
            </p>
            <p>
              Este encontro é para empresários que não querem deixar o futuro financeiro dependente de uma
              única fonte de renda ou das incertezas do cenário atual.
            </p>
          </div>
        </Section>


        {/* ============= PROMESSA / TEMAS ============= */}
        <Section
          id="temas"
          title="O que será abordado"
          align="center"
          variant="accent"
        >


          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                t: "Investimento inteligente",
                d: "Como olhar para decisões de investimento com mais clareza, considerando objetivos, riscos, prazo e estratégia patrimonial.",
              },
              {
                t: "Aplicação estratégica de capital",
                d: "Reflexões para empresários que desejam direcionar recursos de forma mais consciente, sem perder de vista liquidez, proteção e crescimento.",
              },
              {
                t: "Alavancagem patrimonial",
                d: "Entenda como a alavancagem pode fazer parte de uma estratégia patrimonial quando existe planejamento, análise e responsabilidade.",
              },
              {
                t: "Oportunidades em operações de leilão",
                d: "Uma visão estratégica sobre como avaliar oportunidades em operações de leilão com critérios, atenção aos riscos e potencial de diversificação.",
              },
            ].map((item, i) => (
              <Card key={item.t} style={{ background: "#141416" }}>
                <div
                  className="mb-4 grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold"
                  style={{
                    background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
                    color: C.text,
                    boxShadow: "0 6px 18px rgba(90,8,7,.53)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight">{item.t}</h3>
                <p className="text-[14.5px] leading-relaxed" style={{ color: C.muted }}>
                  {item.d}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10">
            <CtaButton onClick={openModal}>Reservar minha vaga</CtaButton>
          </div>
        </Section>

        {/* ============= PARA QUEM É ============= */}
        <Section
          id="publico"
          eyebrow="Para quem é"
          title="Este encontro foi pensado para empresários que…"
          variant="dark"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Já construíram uma empresa, acumularam capital ou possuem patrimônio e querem tomar decisões mais estratégicas.",
              "Desejam reduzir a dependência exclusiva do negócio como fonte de segurança financeira.",
              "Buscam alternativas para diversificar e organizar melhor o patrimônio pessoal e familiar.",
              "Entendem que cenário econômico instável exige mais planejamento, não menos.",
              "Querem conhecer perspectivas sobre investimentos, aplicação de capital, alavancagem patrimonial e operações de leilão.",
              "Valorizam conversas objetivas, qualificadas e voltadas para decisões de longo prazo.",
            ].map((t) => (
              <div
                key={t}
                className="flex items-start gap-4 rounded-xl border p-5"
                style={{ background: C.bgCard, borderColor: C.lineSoft }}
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold"
                  style={{ background: "#16a34a", color: C.text }}
                >
                  ✓
                </span>
                <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>
                  {t}
                </p>
              </div>
            ))}
          </div>



        </Section>






        {/* ============= ESCASSEZ ============= */}
        <Section eyebrow="Vagas limitadas" title="Inscrições limitadas para esta edição." variant="highlight">
          <p className="max-w-3xl text-[15.5px] leading-relaxed md:text-lg" style={{ color: C.muted }}>
            Para preservar a qualidade da experiência e da interação, as inscrições para este encontro são
            limitadas. Se você entende que este é o momento de olhar com mais estratégia para o patrimônio
            que construiu e para o futuro que deseja projetar, faça sua inscrição agora.
          </p>
          <div className="mt-8">
            <CtaButton onClick={openModal}>Garantir minha inscrição</CtaButton>
            <p className="mt-3 text-[13px]" style={{ color: "rgba(255,255,255,.72)" }}>
              Participação sujeita à disponibilidade de vagas.
            </p>
          </div>
        </Section>

        {/* ============= FORMULÁRIO INLINE ============= */}
        <section id="inscricao" className="relative py-14 md:py-20">
          <div
            className="relative grid gap-8 overflow-hidden rounded-3xl border p-6 md:grid-cols-[1fr_1.1fr] md:p-10"
            style={{
              background: `linear-gradient(160deg, ${C.bgCard2}, ${C.bgCard} 55%, ${C.bgSoft})`,
              borderColor: C.line,
              boxShadow: "0 30px 80px rgba(0,0,0,.4)",
            }}
          >
            {/* subtle inner glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
              style={{ background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)` }}
            />
            <div className="relative flex flex-col justify-center">
              <p
                className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: C.accent }}
              >
                Inscrição
              </p>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Faça sua inscrição para o encontro exclusivo.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>
                Preencha seus dados para receber a confirmação e os detalhes de participação.
              </p>
            </div>
            <div className="relative">
              <RegistrationForm />
            </div>
          </div>
        </section>

        {/* ============= FAQ ============= */}
        <Section eyebrow="Perguntas frequentes" title="Tudo o que você precisa saber" variant="dark">
          <div className="space-y-3">
            {[
              [
                "O encontro é voltado para qual tipo de empresário?",
                "O conteúdo foi estruturado para empresários de diferentes segmentos que desejam ampliar a visão sobre investimentos, aplicação de capital, alavancagem patrimonial, operações de leilão e planejamento de futuro.",
              ],
              [
                "Preciso já investir para participar?",
                "Não. O encontro é indicado tanto para empresários que já possuem investimentos quanto para quem deseja estruturar melhor suas próximas decisões patrimoniais.",
              ],
              [
                "O encontro será uma apresentação de produto?",
                "O foco do encontro é compartilhar conteúdo estratégico e promover uma conversa qualificada sobre patrimônio, investimentos e oportunidades. Eventuais soluções ou próximos passos serão apresentados somente quando fizerem sentido para o perfil e o interesse de cada participante.",
              ],
              [
                "O que será abordado sobre operações de leilão?",
                "O encontro apresentará uma visão estratégica sobre esse tipo de operação, incluindo critérios de análise, cuidados importantes e possibilidades de diversificação. Nenhuma oportunidade será tratada como garantia de retorno.",
              ],
              [
                "Como receberei o acesso ao evento?",
                "Após a inscrição e confirmação da participação, as informações de acesso serão enviadas pelos canais cadastrados.",
              ],
              [
                "As vagas são realmente limitadas?",
                "Sim. O número de participantes é limitado para preservar a qualidade da experiência do encontro.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-xl border p-5 open:pb-6"
                style={{ background: C.bgCard, borderColor: C.lineSoft }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-medium">
                  {q}
                  <span
                    className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-lg transition group-open:rotate-45"
                    style={{ borderColor: C.line, color: C.accent }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: C.muted }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </Section>

        {/* ============= FINAL ============= */}
        <section className="relative pt-8 md:pt-14">
          <div
            className="relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl border p-8 md:grid-cols-[1.2fr_.8fr] md:p-12"
            style={{
              background: `linear-gradient(135deg, rgba(90,8,7,.47), ${C.bgCard})`,
              borderColor: "rgba(194,24,26,.27)",
            }}
          >
            {/* subtle radial texture */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
              style={{ background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)` }}
            />
            <div className="relative">
              <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
                O patrimônio que você quer construir merece uma estratégia à altura.
              </h2>
              <p className="text-lg" style={{ color: C.muted }}>
                Faça sua inscrição e participe de um encontro voltado a empresários que desejam agir com mais
                visão, critério e preparo diante das oportunidades e incertezas do mercado.
              </p>
            </div>
            <div className="relative md:text-right">
              <CtaButton onClick={openModal}>Quero participar do encontro</CtaButton>
            </div>
          </div>
        </section>

        {/* ============= FOOTER ============= */}
        <footer className="pt-14 pb-8" style={{ color: C.mutedSoft }}>
          <div
            className="grid gap-6 border-t pt-8 md:grid-cols-[auto_1fr_auto] md:items-center"
            style={{ borderColor: C.lineSoft }}
          >
            <div className="flex items-center gap-4">
              <img src={logoAgora.url} alt="Invest Agora" className="footer-logo h-24 md:h-28" />
              <img src={logoVerticale.url} alt="Verticale" className="footer-logo h-24 md:h-28" />
            </div>
            <div className="space-y-1 text-sm md:text-center">
              <div className="font-medium" style={{ color: C.text }}>{COMPANY_NAME}</div>
              <div>
                CNPJ: {CONTACT_CNPJ}
                <span className="mx-2 opacity-40">|</span>
                {CONTACT_EMAIL}
                {CONTACT_WHATSAPP && CONTACT_WHATSAPP !== "[Inserir WhatsApp]" && (
                  <>
                    <span className="mx-2 opacity-40">|</span>
                    {CONTACT_WHATSAPP}
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-5 text-sm md:justify-end">
              <a href="#" className="transition hover:opacity-70">Política de Privacidade</a>
              <a href="#" className="transition hover:opacity-70">Termos de Uso</a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs">
            © {new Date().getFullYear()} Invest Agora • Todos os direitos reservados
          </p>
        </footer>
      </div>

      {/* STICKY MOBILE */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur md:hidden"
        style={{ background: "var(--c-header-bg)", borderColor: C.line }}
      >
        <button
          onClick={openModal}
          className="block w-full rounded-full px-5 py-3.5 text-center font-semibold text-white"
          style={{ background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})` }}
        >
          Quero garantir minha inscrição
        </button>
      </div>

      {open && <RegistrationModal onClose={closeModal} />}
    </div>
  );
}

/* ============================================================
   Componentes auxiliares
   ============================================================ */

function Info({ children }: { children: React.ReactNode }) {
  return <span className="font-medium">{children}</span>;
}

function Dot() {
  return <span className="opacity-40">•</span>;
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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold uppercase tracking-wider text-white transition hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${full ? "w-full" : ""}`}
      style={{
        background: `linear-gradient(180deg, #d81f21, ${C.accentDark} 60%, #4a0606)`,
        boxShadow: `0 14px 34px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.18)`,
      }}
    >
      {children}
    </button>
  );
}

function Section({
  id,
  eyebrow,
  title,
  align = "left",
  variant = "default",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  variant?: "default" | "soft" | "dark" | "accent" | "highlight";
  children: React.ReactNode;
}) {
  const isCenter = align === "center";

  // Paleta alternada: PRETO (variações), VERMELHO #840B0A, BRANCO — com bordas suavizadas
  const variantBg: Record<typeof variant, React.CSSProperties> = {
    // PRETO padrão (mais escuro)
    default: {
      background: "var(--sec-default)",
    },
    // PRETO um pouco mais claro (variação)
    dark: {
      background: "var(--sec-dark)",
    },
    // VERMELHO #840B0A (tom mais fechado)
    accent: {
      background: "linear-gradient(180deg, #3a0504 0%, #840B0A 50%, #3a0504 100%)",
    },
    // VERMELHO #840B0A (tom mais vibrante, com variação de brilho)
    highlight: {
      background: "radial-gradient(1200px 500px at 50% -20%, #a8100f 0%, transparent 60%), linear-gradient(180deg, #5a0807 0%, #840B0A 40%, #840B0A 60%, #5a0807 100%)",
    },
    // BRANCO
    soft: {
      background: "var(--sec-soft)",
      color: "#1a1b1f",
    },
  };

  const isLight = variant === "soft";
  const isRed = variant === "accent" || variant === "highlight";

  // Cor de "cola" para suavizar bordas entre seções (usa o tom do topo/base do gradiente)
  const edgeColor =
    variant === "soft" ? "var(--edge-soft)" : variant === "accent" || variant === "highlight" ? "#5a0807" : variant === "dark" ? "var(--edge-dark)" : "var(--edge-default)";

  return (
    <section
      id={id}
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-12 md:py-24 ${isRed ? "on-red" : ""}`}
      style={variantBg[variant]}
    >
      {/* Fades superior/inferior — suavizam a transição entre seções (sutis, sem tapar títulos) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-8 md:h-20"
        style={{ background: `linear-gradient(180deg, ${edgeColor} 0%, transparent 100%)` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 md:h-20"
        style={{ background: `linear-gradient(0deg, ${edgeColor} 0%, transparent 100%)` }}
      />
      <div
        className="relative mx-auto max-w-[1200px] px-5"
        style={{ color: isLight ? "#1a1b1f" : C.text }}
      >
        <Reveal stagger duration={1}>
          {eyebrow && (
            <p
              className={`mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] ${isCenter ? "text-center" : ""}`}
              style={{ color: isLight ? "#840B0A" : isRed ? "#ffd1d1" : C.accent }}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={`mb-8 text-3xl font-semibold tracking-tight md:text-4xl ${
              isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h2>
        </Reveal>
        <Reveal y={20} duration={1} delay={0.15}>{children}</Reveal>
      </div>
    </section>
  );
}



function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-0.5"
      style={{
        background: C.bgCard,
        borderColor: C.lineSoft,
        boxShadow: "var(--c-card-shadow)",
        ...style,
      }}
    >
      {/* subtle top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,16,15,.25), transparent)" }}
      />
      {children}
    </div>
  );
}

/* ============================================================
   Formulário (usado inline e no modal)
   ============================================================ */

const FAIXA_OPTIONS = [
  "Até R$ 50 mil",
  "De R$ 50 mil a R$ 200 mil",
  "De R$ 200 mil a R$ 500 mil",
  "Acima de R$ 500 mil",
  "Prefiro não informar",
];

type DocType = "cpf" | "cnpj";

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function maskDocument(type: DocType, value: string) {
  return type === "cpf" ? maskCpf(value) : maskCnpj(value);
}

function calcCpfCheckDigit(digits: number[]) {
  const calc = (arr: number[]) => {
    let sum = 0;
    let factor = arr.length + 1;
    for (const n of arr) {
      sum += n * factor;
      factor--;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const first = calc(digits);
  const second = calc([...digits, first]);
  return [first, second];
}

function isValidCpf(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length !== 11 || /^\d{1}$/.test(d)) return false;
  const digits = d.split("").map(Number);
  const [first, second] = calcCpfCheckDigit(digits.slice(0, 9));
  return digits[9] === first && digits[10] === second;
}

function calcCnpjCheckDigit(digits: number[]) {
  const calc = (arr: number[], weights: number[]) => {
    const sum = arr.reduce((acc, n, i) => acc + n * weights[i], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const first = calc(digits, firstWeights);
  const second = calc([...digits, first], secondWeights);
  return [first, second];
}

function isValidCnpj(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length !== 14 || /^\d{1}$/.test(d)) return false;
  const digits = d.split("").map(Number);
  const [first, second] = calcCnpjCheckDigit(digits.slice(0, 12));
  return digits[12] === first && digits[13] === second;
}

function isValidDocument(type: DocType, value: string) {
  const raw = value.replace(/\D/g, "");
  if (type === "cpf") return isValidCpf(raw);
  return isValidCnpj(raw);
}

function useRegistrationForm() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [segmento, setSegmento] = useState("");
  const [cidade, setCidade] = useState("");
  const [faixa, setFaixa] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<DocType>("cpf");
  const [documento, setDocumento] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: boolean;
    email?: boolean;
    whatsapp?: boolean;
    empresa?: boolean;
    segmento?: boolean;
    cidade?: boolean;
    documento?: boolean;
    lgpd?: boolean;
  }>({});
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const wpp = whatsapp.replace(/\D/g, "");
    const errs = {
      nome: nome.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      whatsapp: wpp.length < 10,
      empresa: empresa.trim().length < 2,
      segmento: segmento.trim().length < 2,
      cidade: cidade.trim().length < 2,
      documento: !documento.trim() || !isValidDocument(tipoDocumento, documento),
      lgpd: !lgpd,
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      if (WEBHOOK_URL && !WEBHOOK_URL.startsWith("{{")) {
        const params = new URLSearchParams(window.location.search);
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            email,
            whatsapp: wpp,
            empresa,
            segmento,
            cidade,
            faixa_investimento: faixa,
            tipo_documento: tipoDocumento,
            documento: documento.replace(/\D/g, ""),
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

  return {
    values: { nome, whatsapp, email, empresa, segmento, cidade, faixa, tipoDocumento, documento, lgpd },
    setters: { setNome, setWhatsapp, setEmail, setEmpresa, setSegmento, setCidade, setFaixa, setTipoDocumento, setDocumento, setLgpd },
    errors,
    ok,
    loading,
    onSubmit,
  };
}

function FormFields({
  form,
}: {
  form: ReturnType<typeof useRegistrationForm>;
}) {
  const { values: v, setters: s, errors } = form;
  return (
    <div className="space-y-3">
      <Field label="Nome completo*" error={errors.nome && "Informe seu nome."}>
        <input value={v.nome} onChange={(e) => s.setNome(e.target.value)} className={inputCls} style={inputStyle} placeholder="Seu nome" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="WhatsApp*" error={errors.whatsapp && "WhatsApp inválido."}>
          <input inputMode="tel" value={v.whatsapp} onChange={(e) => s.setWhatsapp(e.target.value)} className={inputCls} style={inputStyle} placeholder="(11) 90000-0000" />
        </Field>
        <Field label="E-mail*" error={errors.email && "E-mail inválido."}>
          <input type="email" value={v.email} onChange={(e) => s.setEmail(e.target.value)} className={inputCls} style={inputStyle} placeholder="voce@empresa.com" />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Empresa*" error={errors.empresa && "Informe a empresa."}>
          <input value={v.empresa} onChange={(e) => s.setEmpresa(e.target.value)} className={inputCls} style={inputStyle} placeholder="Nome da empresa" />
        </Field>
        <Field label="Segmento de atuação*" error={errors.segmento && "Informe o segmento."}>
          <input value={v.segmento} onChange={(e) => s.setSegmento(e.target.value)} className={inputCls} style={inputStyle} placeholder="Ex.: Indústria, Serviços…" />
        </Field>
      </div>
      <Field label="Cidade*" error={errors.cidade && "Informe sua cidade."}>
        <input value={v.cidade} onChange={(e) => s.setCidade(e.target.value)} className={inputCls} style={inputStyle} placeholder="Sua cidade / UF" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <Field label="Documento*">
          <select
            value={v.tipoDocumento}
            onChange={(e) => {
              const type = e.target.value as DocType;
              s.setTipoDocumento(type);
              s.setDocumento(maskDocument(type, v.documento));
            }}
            className={inputCls}
            style={inputStyle}
          >
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
          </select>
        </Field>
        <Field label={v.tipoDocumento === "cpf" ? "CPF*" : "CNPJ*"} error={errors.documento && (v.tipoDocumento === "cpf" ? "CPF inválido." : "CNPJ inválido.")}>
          <input
            inputMode="numeric"
            value={v.documento}
            onChange={(e) => s.setDocumento(maskDocument(v.tipoDocumento, e.target.value))}
            className={inputCls}
            style={inputStyle}
            placeholder={v.tipoDocumento === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
          />
        </Field>
      </div>
      <Field label="Faixa aproximada de interesse para investimento (opcional)">
        <select
          value={v.faixa}
          onChange={(e) => s.setFaixa(e.target.value)}
          className={inputCls}
          style={inputStyle}
        >
          <option value="">Selecione uma faixa</option>
          {FAIXA_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-start gap-2 pt-1 text-[13px]" style={{ color: C.muted }}>
        <input
          type="checkbox"
          checked={v.lgpd}
          onChange={(e) => s.setLgpd(e.target.checked)}
          className="mt-1"
          style={{ accentColor: C.accent }}
        />
        <span>
          Li e concordo em receber informações relacionadas ao evento e conteúdos da Invest Agora.
        </span>
      </label>
      {errors.lgpd && (
        <p className="text-xs font-medium" style={{ color: "#ff8a8a" }}>
          É necessário aceitar para continuar.
        </p>
      )}
    </div>
  );
}

function RegistrationForm() {
  const form = useRegistrationForm();
  if (form.ok) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center"
        style={{ background: C.bgSoft, borderColor: C.lineSoft }}
      >
        <div
          className="mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
          style={{ background: "rgba(132,11,10,.4)", color: "#ffffff", border: `1px solid ${C.line}` }}
        >
          ✓
        </div>
        <h3 className="mb-2 text-2xl font-semibold">Inscrição recebida!</h3>
        <p className="text-sm" style={{ color: C.muted }}>
          Enviaremos a confirmação para seu e-mail e WhatsApp em breve.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={form.onSubmit} noValidate>
      <FormFields form={form} />
      <button
        type="submit"
        disabled={form.loading}
        className="mt-5 w-full rounded-full px-6 py-3.5 text-[14px] font-semibold uppercase tracking-wider text-white transition disabled:opacity-70"
        style={{
          background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
          boxShadow: "0 14px 30px rgba(90,8,7,.53)",
        }}
      >
        {form.loading ? "Enviando…" : "Confirmar minha inscrição"}
      </button>
      <p className="mt-3 text-[12px]" style={{ color: C.mutedSoft }}>
        Seus dados serão utilizados exclusivamente para comunicações relacionadas ao evento e conteúdos da
        Invest Agora, conforme a política de privacidade.
      </p>
    </form>
  );
}

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const form = useRegistrationForm();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.88)", contain: "paint" }}
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
          {form.ok ? (
            <div className="py-6 text-center">
              <div
                className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
                style={{ background: "rgba(132,11,10,.4)", color: "#ffffff", border: `1px solid ${C.line}` }}
              >
                ✓
              </div>
              <h3 className="mb-2 text-2xl font-semibold">Inscrição recebida!</h3>
              <p className="mb-6 text-sm" style={{ color: C.muted }}>
                Enviaremos a confirmação para seu e-mail e WhatsApp em breve.
              </p>
              <CtaButton onClick={onClose} full>
                Fechar
              </CtaButton>
            </div>
          ) : (
            <>
              <p
                className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: C.accent }}
              >
                Encontro online • Inscrições limitadas
              </p>
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">
                Faça sua inscrição para o encontro exclusivo.
              </h3>
              <p className="mb-5 text-[13.5px]" style={{ color: C.muted }}>
                Preencha seus dados para receber a confirmação e os detalhes de participação.
              </p>

              <form onSubmit={form.onSubmit} noValidate>
                <FormFields form={form} />
                <button
                  type="submit"
                  disabled={form.loading}
                  className="mt-5 w-full rounded-full px-6 py-3.5 text-[14px] font-semibold uppercase tracking-wider text-white transition disabled:opacity-70"
                  style={{
                    background: `linear-gradient(180deg, ${C.accentSoft}, ${C.accentDark})`,
                    boxShadow: "0 12px 28px rgba(90,8,7,.53)",
                  }}
                >
                  {form.loading ? "Enviando…" : "Confirmar minha inscrição"}
                </button>
                <p className="mt-3 text-[12px]" style={{ color: C.mutedSoft }}>
                  Seus dados serão utilizados exclusivamente para comunicações relacionadas ao evento.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border p-3 text-[color:var(--c-text)] outline-none transition placeholder:text-[color:var(--c-muted-soft)] focus:border-[#c2181a] focus:ring-4 focus:ring-[#c2181a]/20";
const inputStyle = { background: C.bg, borderColor: C.line } as const;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: C.muted }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium" style={{ color: "#ff8a8a" }}>
          {error}
        </p>
      )}
    </div>
  );
}
