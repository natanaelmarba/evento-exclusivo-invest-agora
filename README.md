# Elite Business Summit

Crie uma landing page completa, responsiva e de alta conversão para cadastro em um evento exclusivo para empresários, com base no estilo visual e estrutural de páginas modernas de marketing de performance (hero forte, blocos objetivos, prova social, FAQ e CTAs recorrentes).

## Objetivo da página

Capturar leads qualificados para inscrição no evento presencial exclusivo da cidade do usuário.

## Tom e posicionamento

- Comunicação premium, direta e confiável.

- Sem exageros ou promessas irreais.

- Foco em clareza, autoridade e urgência elegante (vagas limitadas).

## Mensagem-base (inspirada no vídeo)

Use como essência de copy:

“Olá empresário, de qualquer segmento, você é convidado para um encontro exclusivo. Vamos falar de negócios que projetam seu futuro e o da sua família: alavancagem patrimonial, investimento, aplicação e oportunidades com leilão. Entre em contato agora e garanta sua vaga, pois são limitadas.”

## Identidade visual obrigatória

- Vermelho principal: #850605

- Branco: #FFFFFF

- Cinza-escuro: #33353b

- Estilo: corporativo premium, contraste alto, visual limpo e elegante.

## Logos

- Inserir duas logos fornecidas pelo usuário:

  - {{LOGO_1}}

  - {{LOGO_2}}

- Aplicar no header e no rodapé.

- Preservar proporção, margem de respiro e versão adequada para fundo claro/escuro.

## Stack obrigatória (usar todas)

1. three.js

2. GSAP (gsap.com)

3. anime.js

4. motion.dev

## Diretriz de animação (sofisticada e leve)

- three.js: fundo sutil no Hero (partículas/linhas abstratas em vermelho e cinza).

- GSAP: entradas por scroll e timeline dos elementos do Hero/CTA.

- anime.js: microinterações de hover em botões/cards.

- motion.dev: transições de estado do formulário (focus, erro, loading, sucesso).

- Respeitar prefers-reduced-motion.

- Manter performance excelente (mobile-first).

## Estrutura da landing page

1) Header fixo

- Logo 1 + Logo 2

- Botão CTA: “Quero minha vaga”

2) Hero (acima da dobra)

- Headline: “Encontro Exclusivo para Empresários”

- Subheadline com proposta de valor

- Chips de destaque:

  - “Vagas limitadas”

  - “Evento presencial”

  - “Conteúdo estratégico”

- Dados do evento (placeholders):

  - {{DATA_EVENTO}}

  - {{HORARIO_EVENTO}}

  - {{CIDADE_EVENTO}}

  - {{LOCAL_EVENTO}}

- CTA primário: “Garantir vaga”

- CTA secundário: “Falar com a equipe”

3) Seção “Para quem é este encontro”

- Empresários de qualquer segmento

- Quem busca crescimento patrimonial estruturado

- Quem quer networking qualificado e visão de longo prazo

4) Seção “O que você vai aprender”

- Card 1: Alavancagem patrimonial

- Card 2: Estratégias de investimento e aplicação

- Card 3: Oportunidades com leilão

- Card 4: Planejamento de crescimento familiar e empresarial

5) Seção de autoridade/prova social institucional

- Texto institucional de credibilidade

- Blocos para depoimentos reais (apenas placeholders, sem inventar números)

6) Seção de urgência

- Texto de escassez elegante: vagas limitadas por cidade

- Contador regressivo opcional se {{DATA_EVENTO}} estiver definida

7) Formulário de cadastro (principal conversão)

Campos:

- Nome completo*  

- WhatsApp* (com máscara)

- E-mail*  

- Empresa (opcional)

- Segmento (opcional)

- Cidade*  

- Checkbox LGPD* (consentimento para contato)

Botão:

- “Finalizar cadastro”

8) FAQ (4 a 6 perguntas)

- Quem pode participar?

- O evento é pago?

- Como confirmar minha inscrição?

- Posso levar acompanhante?

- O que acontece após o cadastro?

9) Rodapé

- Logos

- Contato (WhatsApp/e-mail)

- Política de Privacidade

- Termos de Uso

- Aviso LGPD

## Comportamento do formulário e integrações

- Validação em tempo real

- Máscara de WhatsApp

- Proteção contra envio duplicado

- Estado de loading no botão

- Mensagens de erro por campo

- Mensagem de sucesso: “Cadastro recebido! Nossa equipe entrará em contato.”

- Disparar eventos de conversão:

  - GA4

  - Meta Pixel

## Placeholders obrigatórios de integração

- {{API_CADASTRO_URL}}

- {{API_TOKEN}}

- {{GA4_ID}}

- {{META_PIXEL_ID}}

- {{WEBHOOK_URL}}

- {{WHATSAPP_LINK}}

- {{EMAIL_CONTATO}}

- {{PRIVACY_URL}}

- {{TERMOS_URL}}

## SEO e acessibilidade

- Meta Title + Meta Description

- Open Graph básico

- Schema.org Event (JSON-LD) com placeholders

- Contraste AA mínimo

- Labels corretos

- Navegação por teclado

- aria-live para feedback do formulário

## Entrega técnica esperada

- Código completo da landing page

- Estrutura de pastas

- Lista de dependências

- .env.example

- Instruções de deploy

- Código comentado indicando onde trocar textos, logos, endpoints e IDs de rastreamento

## Referência de design (sem copiar textos literalmente)

Aplicar linguagem visual inspirada em páginas de performance:

- Hero impactante com CTA evidente

- Blocos em cards com ícones simples

- Muito espaço em branco

- Hierarquia tipográfica forte

- CTA repetido em pontos estratégicos

- FAQ em accordion leve

- Rodapé institucional limpo

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://evento-exclusivo-invest-agora.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38aa4a14-1d55-469c-be54-fadcbabb9632).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
