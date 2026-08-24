import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

// TODO: substituir pelos endpoints reais em produção.
const API_CADASTRO_URL = "{{API_CADASTRO_URL}}";
const API_TOKEN = "{{API_TOKEN}}";
const WEBHOOK_URL = "{{WEBHOOK_URL}}";

type FieldErrors = Partial<Record<"nome" | "whatsapp" | "email" | "cidade" | "lgpd", string>>;

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function RegistrationForm() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [segmento, setSegmento] = useState("");
  const [cidade, setCidade] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (nome.trim().length < 3) e.nome = "Informe seu nome completo.";
    if (whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "WhatsApp inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido.";
    if (cidade.trim().length < 2) e.cidade = "Informe sua cidade.";
    if (!lgpd) e.lgpd = "É necessário aceitar os termos de contato.";
    return e;
  };

  const trackConversion = () => {
    // GA4
    // @ts-expect-error - gtag injetado externamente
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-expect-error
      window.gtag("event", "generate_lead", { event_category: "form", event_label: "evento_empresarios" });
    }
    // Meta Pixel
    // @ts-expect-error
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      // @ts-expect-error
      window.fbq("track", "Lead");
    }
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === "loading") return; // proteção contra envio duplicado
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    setMessage("");
    const payload = { nome, whatsapp, email, empresa, segmento, cidade, lgpd, source: "landing_evento" };
    try {
      // TODO: trocar por chamada real
      if (API_CADASTRO_URL && !API_CADASTRO_URL.startsWith("{{")) {
        const resApi = await fetch(API_CADASTRO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_TOKEN}` },
          body: JSON.stringify(payload),
        });
        if (!resApi.ok) throw new Error("API falhou");
      }
      if (WEBHOOK_URL && !WEBHOOK_URL.startsWith("{{")) {
        const resWebhook = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!resWebhook.ok) throw new Error("Webhook falhou");
      }
      trackConversion();
      setStatus("success");
      setMessage("Cadastro recebido! Nossa equipe entrará em contato.");
      setNome(""); setWhatsapp(""); setEmail(""); setEmpresa(""); setSegmento(""); setCidade(""); setLgpd(false);
    } catch {
      setStatus("error");
      setMessage("Não foi possível enviar. Tente novamente em instantes.");
    }
  };

  const fieldBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-live="polite">
      <Field label="Nome completo*" error={errors.nome}>
        <motion.input
          whileFocus={{ scale: 1.005 }}
          className={fieldBase}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          aria-invalid={!!errors.nome}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp*" error={errors.whatsapp}>
          <motion.input
            whileFocus={{ scale: 1.005 }}
            className={fieldBase}
            value={whatsapp}
            onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
            placeholder="(11) 90000-0000"
            inputMode="tel"
            aria-invalid={!!errors.whatsapp}
          />
        </Field>
        <Field label="E-mail*" error={errors.email}>
          <motion.input
            whileFocus={{ scale: 1.005 }}
            className={fieldBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            type="email"
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Empresa">
          <input className={fieldBase} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da empresa" />
        </Field>
        <Field label="Segmento">
          <input className={fieldBase} value={segmento} onChange={(e) => setSegmento(e.target.value)} placeholder="Ex.: Indústria, Serviços…" />
        </Field>
      </div>
      <Field label="Cidade*" error={errors.cidade}>
        <input className={fieldBase} value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Sua cidade" aria-invalid={!!errors.cidade} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={lgpd}
          onChange={(e) => setLgpd(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--brand)]"
          aria-invalid={!!errors.lgpd}
        />
        <span>
          Autorizo o contato da equipe organizadora conforme a LGPD para tratar da minha inscrição.
        </span>
      </label>
      {errors.lgpd && <p className="text-xs text-brand">{errors.lgpd}</p>}

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Enviando…
          </>
        ) : (
          "Finalizar cadastro"
        )}
      </motion.button>

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
            role="status"
          >
            {message}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            role="alert"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-brand">{error}</p>}
    </div>
  );
}
