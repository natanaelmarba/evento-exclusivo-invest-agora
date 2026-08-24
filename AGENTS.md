<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

---

# AGENTS.md — Índice de Navegação do Projeto

## 1. Objetivo e regras de navegação

Este arquivo é o **mapa técnico** do projeto. Existe para que a IA localize com precisão os arquivos necessários para cada tarefa, **sem varrer o repositório inteiro**.

**Regras:**
- Não leia todo o repositório por padrão.
- Antes de editar, consulte a seção correspondente ao tipo de tarefa neste índice.
- Abra apenas os arquivos diretamente relacionados à solicitação e suas dependências imediatas.
- Se a mudança envolver risco de regressão, dados sensíveis, integração externa ou segurança, expanda a leitura apenas para os arquivos relacionados ao fluxo (ver seção 7).

**Protocolo operacional:**
1. Identificar o domínio da solicitação.
2. Consultar o índice daquele domínio neste arquivo.
3. Ler os arquivos principais indicados.
4. Ler dependências diretas somente quando necessário.
5. Implementar a alteração mínima necessária.
6. Validar com lint, build ou comandos disponíveis (ver seção 8).
7. Atualizar este `AGENTS.md` caso arquivos, fluxos ou responsabilidades relevantes tenham mudado.

---

## 2. Visão geral da arquitetura

**Stack:** TanStack Start (React 19) + Tailwind CSS 4 + Vite 8 + Nitro (Cloudflare) + GSAP + Motion (Framer Motion)

Projeto single-page: landing page de captura de leads para evento exclusivo de investimentos. SSR via TanStack Start + Nitro. Sem banco de dados, sem autenticação de usuários. Dados do formulário são enviados para webhook externo.

| Área | Caminho | Responsabilidade | Consultar quando |
|---|---|---|---|
| Landing page (arquivo principal) | `src/routes/index.tsx` | Toda a UI da página, formulários, modal, seções, FAQ, footer (~1360 linhas) | Alterar qualquer conteúdo, layout, seção ou formulário |
| Layout raiz e providers | `src/routes/__root.tsx` | HTML shell, QueryClient, meta tags globais, fontes, CustomCursor, 404, Error Boundary | Alterar meta tags globais, fontes, providers, cursor ou error handling |
| Componentes de domínio | `src/components/` | Componentes específicos do projeto (formulário legado, cursor, hero, FAQ, countdown, animação) | Alterar um componente reutilizável |
| Componentes UI (shadcn) | `src/components/ui/` | Biblioteca de UI genérica (Radix-based). ~40 componentes. Não são todos utilizados | Alterar componente de UI base |
| Estilos globais e tema | `src/styles.css` | Variáveis CSS (paleta dark), Tailwind config, utilitários (btn-primary, chip, etc.) | Alterar cores, tema, tipografia, utilitários CSS |
| SSR e servidor | `src/server.ts`, `src/start.ts` | Entry point do servidor Nitro, middleware de erro SSR | Alterar comportamento de servidor ou error handling |
| Roteamento | `src/router.tsx`, `src/routeTree.gen.ts` | Configuração do TanStack Router e árvore de rotas (gerada) | Adicionar/remover rotas |
| SEO | `src/routes/sitemap[.]xml.ts` | Sitemap XML dinâmico | Alterar URLs do sitemap |
| Utilitários | `src/lib/` | cn(), error-capture, error-page, lovable-error-reporting | Alterar utils, error handling |
| Assets | `src/assets/` | Metadados de imagens e vídeos (`.asset.json`) | Alterar mídia do hero, logos |
| Configuração | `vite.config.ts`, `tsconfig.json`, `package.json`, `bunfig.toml` | Build, dependências, aliases, supply-chain | Alterar build, dependências, ambiente |
| Lint e formato | `eslint.config.js`, `.prettierrc` | ESLint + Prettier | Alterar regras de lint/formato |
| Arquivos públicos | `public/` | favicon, robots.txt, llms.txt | Alterar SEO estático |

---

## 3. Índice por domínio funcional

### Landing Page (conteúdo e layout)
- **Ponto de entrada:** `src/routes/index.tsx`
- **Arquivos principais:**
  - `src/routes/index.tsx` — todo o conteúdo: hero, seções (biografia, proposta, programa, escassez), formulário inline, FAQ, footer, modal de inscrição, componentes auxiliares (Section, Card, CtaButton, etc.)
  - `src/styles.css` — paleta de cores (variáveis `--c-*`), gradientes de seção (`--sec-*`), utilitários
- **Dependências diretas:** `src/components/Reveal.tsx` (animação de scroll), `src/assets/*.asset.json` (imagens/vídeo)
- **Atenções:** O arquivo `index.tsx` contém ~1360 linhas. Seções são delimitadas por comentários `{/* ============= NOME ============= */}`. Use busca por texto para navegar.
- **Como validar:** `vite build` (sem erros de tipo)

### Formulário de Inscrição (Modal)
- **Ponto de entrada:** `src/routes/index.tsx` — buscar `function RegistrationModal`
- **Arquivos principais:**
  - `src/routes/index.tsx` linhas ~930–1360: `useRegistrationForm()`, `FormFields`, `RegistrationModal`, `RegistrationForm` (inline), validação CPF/CNPJ, máscaras, `Field`
- **Dados/API envolvidos:** `WEBHOOK_URL` (placeholder `{{WEBHOOK_URL}}`), envio via `fetch POST` com JSON contendo: nome, email, whatsapp, empresa, segmento, cidade, faixa_investimento, tipo_documento, documento, UTMs, page, created_at
- **Atenções:**
  - Existem **dois** componentes de formulário: o modal (em `index.tsx`) e um legado em `src/components/RegistrationForm.tsx`. O modal é o principal e inclui CPF/CNPJ. O legado usa `API_CADASTRO_URL` e `API_TOKEN` — manter ambos sincronizados em alterações.
  - Validação de CPF/CNPJ usa algoritmo de dígitos verificadores (funções `isValidCpf`, `isValidCnpj`).
  - Webhook URL é exposta no client-side (risco documentado na revisão de segurança).
- **Como validar:** Testar formulário no browser, verificar payload no DevTools > Network

### Formulário de Inscrição (Legado/Inline)
- **Ponto de entrada:** `src/components/RegistrationForm.tsx`
- **Arquivos principais:**
  - `src/components/RegistrationForm.tsx` — formulário com campos: nome, whatsapp, email, empresa, segmento, cidade, lgpd. Sem CPF/CNPJ. Usa `API_CADASTRO_URL`, `API_TOKEN`, `WEBHOOK_URL` (todos placeholders).
- **Atenções:** Este componente é importado em `src/routes/index.tsx` (seção inline). Tem lógica de tracking GA4 + Meta Pixel. Campos e payload diferentes do formulário modal.

### Hero e Vídeo de Fundo
- **Ponto de entrada:** `src/routes/index.tsx` — buscar `{/* ============= HERO`
- **Arquivos principais:**
  - `src/components/HeroBackground.tsx` — background animado com Three.js/Canvas
  - `src/assets/hero-video.mp4.asset.json`, `src/assets/hero-poster.jpg.asset.json` — vídeo e poster do hero
- **Dependências diretas:** `three` (Three.js), `gsap`

### Cursor Customizado
- **Ponto de entrada:** `src/components/CustomCursor.tsx`
- **Atenções:** Injetado globalmente via `__root.tsx`. Usa classe CSS `has-custom-cursor` no `<html>` para ocultar cursor nativo (definida em `src/styles.css`).

### Animações de Scroll (Reveal)
- **Ponto de entrada:** `src/components/Reveal.tsx`
- **Dependências diretas:** `motion` (Framer Motion)
- **Atenções:** Usado extensivamente em `index.tsx` para animar entrada de seções.

### FAQ
- **Ponto de entrada:** `src/routes/index.tsx` — buscar `{/* ============= FAQ`
- **Atenções:** O FAQ completo está inline em `index.tsx` como array de pares pergunta/resposta. Existe um componente legado em `src/components/FAQ.tsx` que pode não estar em uso ativo.

### Countdown
- **Ponto de entrada:** `src/components/Countdown.tsx`
- **Atenções:** Componente de contagem regressiva. Verifica se está em uso ativo em `index.tsx` antes de alterar.

---

## 4. Índice de interface e experiência do usuário

| Alteração desejada | Arquivos a consultar primeiro | Dependências que só devem ser lidas se necessário |
|---|---|---|
| Alterar texto, conteúdo ou ordem de seções | `src/routes/index.tsx` | — |
| Alterar cores, paleta ou tema | `src/styles.css` (variáveis `--c-*`) | `src/routes/index.tsx` (constante `C` nas linhas ~109-122) |
| Alterar fontes | `src/routes/__root.tsx` (link Google Fonts, linha ~94) | `src/styles.css` (`--font-display`, `--font-sans`) |
| Alterar formulário modal | `src/routes/index.tsx` (buscar `RegistrationModal`) | — |
| Alterar formulário inline | `src/components/RegistrationForm.tsx` | `src/routes/index.tsx` (seção `{/* FORMULÁRIO INLINE`) |
| Alterar header/navbar | `src/routes/index.tsx` (buscar `<header`) | `src/styles.css` (`--c-header-bg`) |
| Alterar footer | `src/routes/index.tsx` (buscar `<footer`) | — |
| Alterar hero/vídeo | `src/routes/index.tsx` (buscar `HERO`), `src/components/HeroBackground.tsx` | `src/assets/hero-*.asset.json` |
| Alterar cursor | `src/components/CustomCursor.tsx` | `src/routes/__root.tsx`, `src/styles.css` (`has-custom-cursor`) |
| Alterar animações de scroll | `src/components/Reveal.tsx` | — |
| Alterar meta tags / OG / SEO | `src/routes/index.tsx` (constantes `PAGE_TITLE`, `OG_IMAGE`, `eventSchema`, `faqSchema`) | `src/routes/__root.tsx` (meta global) |
| Alterar componente UI base (botão, input, etc.) | `src/components/ui/<componente>.tsx` | `src/lib/utils.ts` (função `cn()`) |
| Alterar estilo global / utilitário CSS | `src/styles.css` | — |

---

## 5. Índice de backend, APIs e regras de negócio

Este projeto é predominantemente frontend (SSR landing page). O "backend" limita-se a:

| Solicitação | Ler primeiro | Ler apenas se houver impacto |
|---|---|---|
| Alterar entry point do servidor SSR | `src/server.ts` | `src/lib/error-capture.ts`, `src/lib/error-page.ts` |
| Alterar middleware de erro | `src/start.ts` | `src/lib/error-page.ts` |
| Alterar sitemap | `src/routes/sitemap[.]xml.ts` | — |
| Alterar envio de dados do formulário (webhook) | `src/routes/index.tsx` (buscar `useRegistrationForm`) | `src/components/RegistrationForm.tsx` |
| Alterar tratamento de erros SSR | `src/server.ts`, `src/lib/error-capture.ts` | `src/lib/error-page.ts` |
| Alterar error reporting (Lovable) | `src/lib/lovable-error-reporting.ts` | `src/routes/__root.tsx` (ErrorComponent) |

**Não existe:** banco de dados, ORM, migrations, models, autenticação de usuários, rotas de API REST, jobs, filas ou cron.

---

## 6. Índice de dados e banco de dados

**Este projeto não possui banco de dados.** Os dados do formulário são enviados diretamente para um webhook externo via `fetch POST` no client-side. Não há persistência local.

---

## 7. Índice de autenticação, autorização e segurança

**Não há autenticação/autorização de usuários.** O projeto é uma landing page pública.

**Pontos sensíveis:**

| Ponto | Arquivo | Detalhe |
|---|---|---|
| Webhook URL | `src/routes/index.tsx` linha ~17 | Placeholder `{{WEBHOOK_URL}}` — exposta no bundle client-side quando preenchida |
| API Token (legado) | `src/components/RegistrationForm.tsx` linhas 5-7 | Placeholders `{{API_CADASTRO_URL}}`, `{{API_TOKEN}}` — token enviado no header Authorization do browser |
| Dados pessoais (PII) | Formulários de inscrição | Nome, email, WhatsApp, CPF/CNPJ, empresa, cidade, faixa de investimento |
| JSON-LD escape | `src/routes/index.tsx` linhas ~99-102 | `JSON.stringify().replace(/</g, '\\u003c')` para prevenir XSS |
| Validação CPF/CNPJ | `src/routes/index.tsx` linhas ~964-1013 | Algoritmo de dígitos verificadores + rejeição de dígitos repetidos |
| Error capture | `src/lib/error-capture.ts` | Sobrescreve `console.error` globalmente, limite de 8000 chars |
| Supply-chain | `bunfig.toml` | `minimumReleaseAge = 604800` (7 dias de quarentena) |

**Regra de edição:**
> Para qualquer alteração envolvendo dados sensíveis, webhooks, tokens ou PII, leia os arquivos listados nesta seção antes de modificar código. Nunca exponha segredos, tokens, chaves, credenciais ou conteúdo de arquivos `.env`.

**Semgrep (auditoria de segurança):**
- Instalação da CLI: `python3 -m pip install semgrep` (ou `pip install semgrep`)
- Scan: `semgrep --config auto .`
- Último scan: 0 findings (24/08/2026)

---

## 8. Configuração, ambientes e deploy

| Necessidade | Arquivos prioritários |
|---|---|
| Rodar localmente | `package.json` (`bun dev` ou `vite dev`) |
| Gerar build | `package.json` (`bun build` ou `vite build`), `vite.config.ts` |
| Preview do build | `package.json` (`bun preview` ou `vite preview`) |
| Configurar dependências | `package.json`, `bunfig.toml`, `bun.lock` |
| Configurar Vite/Nitro/SSR | `vite.config.ts` (usa `@lovable.dev/vite-tanstack-config`) |
| Configurar TypeScript | `tsconfig.json` (alias `@/*` → `src/*`) |
| Configurar lint | `eslint.config.js` |
| Configurar formato | `.prettierrc`, `.prettierignore` |
| Fazer deploy | Automático via Lovable (Cloudflare). Push para `main` sincroniza. |
| Configurar SEO estático | `public/robots.txt`, `public/llms.txt`, `public/favicon.ico` |
| Investigar Lovable | `.lovable/project.json` |

**Scripts disponíveis:**
```
dev       → vite dev
build     → vite build
build:dev → vite build --mode development
preview   → vite preview
lint      → eslint .
format    → prettier --write .
```

---

## 9. Índice de testes e validação

**Não existem testes automatizados (unitários, integração ou E2E) neste projeto.**

Validação disponível:

| Área alterada | Validação |
|---|---|
| Qualquer alteração de código | `vite build` (verifica tipos e bundling) |
| Lint | `eslint .` |
| Formato | `prettier --check .` |
| Segurança | `semgrep --config auto .` |
| Interface | Verificação visual no browser (`vite dev`) |
| Formulário | Teste manual: preencher, submeter, verificar payload no DevTools > Network |

---

## 10. Matriz rápida: "quero mudar X, onde começo?"

| Objetivo | Primeiro arquivo | Arquivos adicionais somente se necessário |
|---|---|---|
| Corrigir texto ou estilo de uma seção | `src/routes/index.tsx` | `src/styles.css` |
| Alterar cores/paleta | `src/styles.css` (vars `--c-*`) | `src/routes/index.tsx` (constante `C`) |
| Alterar formulário de inscrição (modal) | `src/routes/index.tsx` (buscar `RegistrationModal`) | — |
| Alterar formulário inline (legado) | `src/components/RegistrationForm.tsx` | `src/routes/index.tsx` |
| Alterar hero/vídeo | `src/routes/index.tsx` (buscar `HERO`), `src/components/HeroBackground.tsx` | `src/assets/hero-*.asset.json` |
| Alterar meta tags/SEO | `src/routes/index.tsx` (constantes no topo) | `src/routes/__root.tsx` |
| Adicionar nova página/rota | `src/routes/` (criar arquivo) | `src/router.tsx` |
| Alterar sitemap | `src/routes/sitemap[.]xml.ts` | — |
| Alterar comportamento do servidor | `src/server.ts` | `src/start.ts`, `src/lib/error-capture.ts` |
| Alterar cursor customizado | `src/components/CustomCursor.tsx` | `src/routes/__root.tsx`, `src/styles.css` |
| Corrigir erro de build | `vite.config.ts`, `tsconfig.json` | `package.json` |
| Corrigir vulnerabilidade | Ver seção 7 deste índice | `bunfig.toml`, `src/routes/index.tsx`, `src/components/RegistrationForm.tsx` |
| Alterar dependências | `package.json` | `bunfig.toml` (supply-chain guard) |
| Alterar animações | `src/components/Reveal.tsx` | `src/routes/index.tsx` (GSAP no topo) |

---

## 11. Arquivos que não devem ser lidos por padrão

| Caminho | Motivo |
|---|---|
| `node_modules/` | Dependências instaladas |
| `dist/`, `.output/`, `.vinxi/` | Artefatos de build |
| `bun.lock` | Lockfile (~175KB) — ler só em tarefas de dependência |
| `src/routeTree.gen.ts` | Gerado automaticamente pelo TanStack Router |
| `src/components/ui/` (40 arquivos) | Biblioteca shadcn/ui — ler apenas o componente específico quando necessário |
| `.lovable/` | Metadados internos do Lovable |
| `.git/` | Histórico Git |
| `src/assets/*.asset.json` | Metadados de mídia — ler só para alterar imagens/vídeos |

---

## 12. Manutenção do índice

- Atualizar este `AGENTS.md` ao criar, mover, remover ou alterar a responsabilidade de arquivos importantes.
- Manter descrições curtas e funcionais.
- Não transformar este arquivo em documentação detalhada do código.
- Preferir apontar para arquivos específicos em vez de descrever implementações.
- Sempre preservar o bloco `<!-- LOVABLE:BEGIN -->...<!-- LOVABLE:END -->` no topo.
- Foco: localizar rapidamente o menor conjunto de arquivos necessário para uma alteração segura.
