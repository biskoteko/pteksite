# Auditoria do sistema visual e composição responsiva — PTek

> Estado: landing page estática (`index.html`, `styles.css`, `script.js`), pt-PT, assistência técnica online, marca provisória "PTek". Palco atual: verde profundo, verde WhatsApp, lima em destaques, cartões brancos, hero com mockup de chat em CSS. Sem build, sem dependências.
>
> Âmbito: escala tipográfica, ritmo vertical, densidade de cartões, uso da cor/lima, raios e sombras, alinhamentos, composição do hero a 1440/1024/390 e sensação de marca. Revisão somente leitura.
>
> Método: o Chromium do sandbox não arranca (falta `libglib-2.0.so.0`) e não foi instalado nada, pelo que não houve medição ao vivo. Os valores a 1440/1024/390 foram calculados a partir do CSS (`clamp`, `rem`, `vw`) e das larguras de `.container` (1140 px, `padding-inline: clamp(1.15rem, 4vw, 2.5rem)` → 1060 px de conteúdo a 1440, 944 px a 1024, 353 px a 390). Nenhum ficheiro do projeto foi alterado por esta auditoria.

## 1) Diagnóstico

- **Base sólida mal aproveitada:** há tokens, grelha fluida, `prefers-reduced-motion` e foco visível, mas as duas camadas que dão identidade — tipografia e cor — estão por decidir. A Inter é nomeada e nunca carregada; a paleta tem cinco verdes e dois âmbares.
- **A escala é feita componente a componente:** 23 tamanhos fixos (0.63rem a 2.3rem) mais cinco `clamp()` independentes, sem degraus nem relação entre hero, secção e cartão. Resultado: competente e anónimo, o clássico template bem feito.
- **O hero funciona nos extremos (1440 e 390) e perde-se no meio:** empilha aos 1024 px quando ainda há largura para promessa e mockup lado a lado; e o ritmo vertical oscila entre 38 px na faixa de números e 96 px nas secções.

## 2) Achados priorizados

### [P0] Tipografia — a marca não tem tipo

- **Observação:** `--font-sans` pede “Inter” (`styles.css:23-24`), mas não existe `@font-face` nem `<link>` de fontes (`index.html:26`). Em Windows renderiza Segoe UI, em macOS SF, com métricas e pesos 800 diferentes; o `letter-spacing:-0.035em` (`styles.css:58`), desenhado para Inter, fica apertado nos fallbacks.
- **Evidência:** `styles.css:23-24` (`--font-sans: "Inter", ui-sans-serif, …`), `styles.css:53-60` (`h1,h2,h3 { line-height:1.08; letter-spacing:-0.035em }`), `index.html:26` (único `<link rel="stylesheet">`, sem preload de fonte).
- **Alteração concreta:**

```css
@font-face {
  font-family: "Inter";
  src: url("fonts/InterVariable.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

h1 { letter-spacing: -0.04em; }
h2 { letter-spacing: -0.028em; }
h3 { letter-spacing: -0.012em; line-height: 1.25; }
```

  No HTML: `<link rel="preload" href="fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>`.

- **Impacto:** a página deixa de mudar de personalidade por sistema operativo; o tracking deixa de ser um valor único aplicado a 66 px e a 16 px.

### [P0] Cor — cinco verdes, nenhum dono

- **Observação:** `--brand:#0e7a43` (`:7`), `--wa:#25d366` (`:10`), `.whatsapp-float{background:#1faa52}` (`:1292`), gradiente `#12904e→#0a6336` (`:154`), hover `#15a25a` (`:159`). O botão flutuante não usa nem a cor da marca nem a do WhatsApp; a lima aparece em três papéis distintos (sublinhado, numerais, eyebrow claro) sem par definido.
- **Evidência:** `styles.css:7,10` (`--brand`, `--wa`), `styles.css:153-161` (`.btn--primary` e `:hover`), `styles.css:1282-1303` (`.whatsapp-float` e `:hover`), `styles.css:448-457` (`.highlight`), `styles.css:742-748` (`.stat dd`).
- **Alteração concreta:**

```css
:root {
  --brand-bright: #149552;
  --accent: var(--lime); /* só sobre superfícies escuras + marcador */
}

.whatsapp-float { background: var(--brand); }
.whatsapp-float:hover { background: var(--brand-strong); }

.btn--primary { --btn-bg: linear-gradient(180deg, #12904e, #0a6336); }
.btn--primary:hover { --btn-bg: linear-gradient(180deg, #0f8a4a, #0b6f3c); }
```

  Regra de uso: `--wa` fica reservado a `.status-dot` e `.chat-avatar` (sinal de canal); `--accent` não é usado sobre branco nem sobre lima-claro.

- **Impacto:** um verde = uma marca; o WhatsApp passa a sinal de canal em vez de segunda identidade.

### [P1] Escala e tamanhos de corpo

- **Observação:** cartões a 0.92rem (`:881`), features 0.9rem (`:988`), testemunhos 0.94rem (`:1022`), FAQ 0.92rem (`:1132`), lead de secção 1.02rem (`:783`) — o `body` é 1rem e o resto improvisa. São 23 tamanhos fixos e 5 `clamp()` sem relação entre si.
- **Evidência:** `styles.css:43-51` (`body` 1rem/1.65), `styles.css:874-882` (`.service-card p`), `styles.css:981-989` (`.feature-list p`), `styles.css:1018-1025` (`.testimonial blockquote`), `styles.css:1128-1133` (`.faq p`), `styles.css:779-785` (`.section-lead`).
- **Alteração concreta:**

```css
:root {
  --text-xs: .75rem;     /* 12px — micro-tipo do mockup */
  --text-sm: .875rem;    /* 14px — labels, metadados */
  --text-base: .9375rem; /* 15px — corpo de cartão */
  --text-md: 1rem;       /* 16px — corpo longo */
  --text-lg: 1.0625rem;  /* 17px — lead de secção */
}

.service-card p,
.feature-list p { font-size: var(--text-base); line-height: 1.6; }

.faq p,
.testimonial blockquote { font-size: var(--text-md); }

.section-lead { font-size: var(--text-lg); }

.section h2 { font-size: clamp(1.75rem, 1.35rem + 1.6vw, 2.75rem); }
```

  Substituir os tamanhos avulsos do mockup (0.71/0.72/0.73/0.75/0.76/0.82rem) por `var(--text-xs)` ou `var(--text-sm)`.

- **Impacto:** leitura confortável a 390 px (15 px de mínimo no corpo) e hierarquia previsível entre secções.

### [P1] Medida de linha longa

- **Observação:** `.section-lead` a `max-width:40rem` com 1.02rem dá ~39em, cerca de 80 caracteres; `.faq p` a 38rem idem. O hero, esse, está correto (34rem a 1.13rem ≈ 30em).
- **Evidência:** `styles.css:779-785` (`max-width:40rem`, `font-size:1.02rem`), `styles.css:1128-1133` (`max-width:38rem`, `font-size:0.92rem`), `styles.css:459-466` (`.lead` com 34rem, correto).
- **Alteração concreta:**

```css
:root { --measure: 34rem; }

.section-lead { max-width: var(--measure); }
.faq p { max-width: 32rem; }
```

- **Impacto:** ~65 caracteres por linha; o olho não perde o retorno em parágrafos de duas ou três linhas.

### [P1] Hero a 1440 e 1024

- **Observação:** a grelha 1.06fr/0.94fr com h1 a 4.15rem deixa ~524 px de coluna para 66 px de texto (manchete picada em três linhas: “O seu equipamento” / “a funcionar,” / “sem sair de casa.”) e colapsa aos 1024 px, transformando o hero em coluna única em portáteis onde ainda sobra largura. Os badges flutuantes (`left:-2.35rem`, `right:-1.9rem`) ficam a menos de 40 px da coluna de texto entre 1025 e 1200 px.
- **Evidência:** `styles.css:436-441` (`.hero-grid`), `styles.css:443-446` (`.hero h1` 2.5rem–4.15rem), `styles.css:679-690` (`.floating-badge--rating/time`), `styles.css:1350-1362` (`@media (max-width:1024px)` a empilhar).
- **Alteração concreta:**

```css
.hero h1 {
  font-size: clamp(2.125rem, 1.6rem + 3vw, 3.6rem); /* 37,3px a 390; 57,6px a 1440 */
  line-height: 1.04;
}

.hero-grid {
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 23rem);
  gap: clamp(2rem, 4vw, 3.5rem);
}

.chat-card { max-width: 23rem; }

@media (max-width: 940px) {
  .hero-grid { grid-template-columns: minmax(0, 1fr); }
  .hero-copy { max-width: 40rem; }
  .hero-visual { justify-content: center; margin-top: 2rem; padding-inline: 1.5rem; }
  .floating-badge--rating { left: 0; }
  .floating-badge--time { right: 0; }
}
```

  Remover as mesmas regras de `@media (max-width:1024px)` (linhas 1350-1371).

- **Impacto:** manchete em duas linhas a 1440 (636 px de coluna) e mockup presente aos 1024, sem colisão de badges.

### [P1] Ritmo vertical e faixa de números

- **Observação:** `.section` usa 3.5–6rem, `.hero` 2.5–5.5rem na base e 3–5.5rem no fecho, `.stats` apenas 2.4rem: a faixa escura lê-se como banner colado entre o hero e a secção seguinte, não como secção própria.
- **Evidência:** `styles.css:760-762` (`.section`), `styles.css:409-417` (`.hero`), `styles.css:722-726` (`.stats`, `padding-block:2.4rem`), `styles.css:1137-1144` (`.cta-final`).
- **Alteração concreta:**

```css
:root { --space-section: clamp(4rem, 7vw, 6.5rem); }

.section { padding-block: var(--space-section); }
.hero { padding-block: clamp(2.5rem, 5vw, 4rem) var(--space-section); }
.stats { padding-block: clamp(2.75rem, 5vw, 3.5rem); }
.cta-final { padding-block: var(--space-section); }
```

- **Impacto:** cadência única entre secções; a faixa de números respira (44–56 px) e deixa de parecer um banner de aviso.

### [P2] Densidade e alinhamento dos cartões

- **Observação:** intervalos divergentes entre grelhas — serviços 1rem, passos 1–1.35rem, features .85rem, FAQ .6rem. O cartão CTA não tem `.card-icon`, por isso o título sobe ~3.2rem face aos irmãos da mesma fila e a grelha parece desmontada. A densidade interna (1.7rem de padding, 3 linhas de 0.92rem, link no fundo) é correta e deve manter-se.
- **Evidência:** `styles.css:834-838` (`.services-grid` gap 1rem), `styles.css:789-793` (`.steps` gap `clamp(1rem,2vw,1.35rem)`), `styles.css:950-953` (`.feature-list` gap .85rem), `styles.css:1080-1083` (`.faq-list` gap .6rem), `styles.css:910-930` (`.service-card--cta` sem ícone), `styles.css:858-867` (`.card-icon` 2.85rem).
- **Alteração concreta:**

```css
:root { --gap-card: 1rem; --gap-stack: .875rem; }

.services-grid { gap: var(--gap-card); }
.steps { gap: var(--gap-card); }
.feature-list { gap: var(--gap-stack); }

.service-card--cta { justify-content: flex-start; }
.service-card--cta::before {
  content: "";
  display: block;
  width: 2.85rem;
  height: 2.85rem;
  margin-bottom: .35rem;
  border-radius: var(--radius-sm);
  background: rgba(216, 245, 110, .14);
  border: 1px solid rgba(216, 245, 110, .35);
}
```

- **Impacto:** a segunda fila de serviços alinha pelo ícone e a grelha deixa de parecer desmontada; um único valor de gap para cartões.

### [P2] Raios, sombras e microalinhamentos

- **Observação:** oito raios (8/11/12/14/18/26/50%/999) e sete variantes de sombra convivem com três tokens; o primeiro `.stat` tem divisor à esquerda, o que empurra os numerais 18.4 px para dentro e desalinha-os do eixo de todas as secções; existe um salto abrupto de h1 aos 400 px (36.8 → 40 px); há dois dourados diferentes para as estrelas.
- **Evidência:** `styles.css:19-21` (tokens de raio), `styles.css:155,239,855,1294` (sombras avulsas), `styles.css:734-740` (`.stat` com `padding-left:1.15rem` e `border-left`), `styles.css:1512-1516` (`.hero h1{font-size:2.3rem}` a ≤400 px), `styles.css:1011-1016` (`.stars` `#d99400`), `styles.css:692-695` (`.badge-stars` `#eaa100`), `styles.css:231-240` (`.brand-mark` com sombra).
- **Alteração concreta:**

```css
:root {
  --radius-xs: 8px;
  --radius-sm: 14px;
  --radius: 18px;
  --radius-lg: 26px;
  --radius-pill: 999px;

  --shadow-card: 0 1px 2px rgba(8,37,26,.06), 0 10px 30px -18px rgba(8,37,26,.28);
  --shadow-lift: 0 24px 48px -30px rgba(8,37,26,.45);
  --shadow-cta: 0 14px 28px -16px rgba(10,99,54,.55);
}

.brand-mark { border-radius: var(--radius-xs); box-shadow: none; }
.nav-toggle,
.feature-icon { border-radius: var(--radius-sm); } /* 12px → 14px */
.card-icon,
.faq { border-radius: var(--radius-sm); }
.float-label { border-radius: var(--radius-xs); }

.stat:first-child { border-left: 0; padding-left: 0; }

.stars,
.badge-stars { color: #c98a00; }
```

  Substituir as sombras de `.btn--primary` por `var(--shadow-cta)`, as de `.service-card:hover` por `var(--shadow-lift)` e as de `.whatsapp-float` por `var(--shadow-cta)`.

- **Impacto:** acabamento de estúdio em vez de acumulação; a faixa de números alinha com o resto da página.

## 3) Top 3 para já

1. **Carregar a Inter** (uma variável, self-host, `font-display:swap`) e graduar o tracking. É a mudança com mais impacto por linha de CSS e a única que corrige a marca em todos os ecrãs.
2. **Passar os tokens** (texto, `--space-section`, `--measure`, raios e sombras) sem tocar em layout: mecânico, reversível, elimina a maior parte do ruído.
3. **Recompor o hero**: `clamp` da manchete, grelha `1fr/23rem` e breakpoint aos 940 px. O primeiro ecrã volta a fazer sentido em 1024 e 1280.

## 4) O que não devo mexer

- Estrutura e conteúdo do mockup de chat (`.chat-card`, `.bubble`): é o elemento mais “marca” da página; afinar tamanhos, nunca trocar por foto.
- Grelha de fundo e halo radial do hero (`styles.css:419-430`, `styles.css:505-513`): textura discreta, dá profundidade sem peso.
- Header sticky com `backdrop-filter` (`styles.css:197-212`) e menu mobile: comportamento já correto.
- `data-reveal` e o bloco `prefers-reduced-motion` (`styles.css:1520-1544`): bem implementados; não animar mais.
- URLs `wa.me`/`tel:` e mensagens pré-preenchidas: são conversão, não visual.
- Não introduzir dark mode nem print: `color-scheme: light` está certo aqui e um tema escuro duplicaria a dívida de cor.

## Resumo de prioridades

| Prioridade | Achados |
| --- | --- |
| P0 | 2 |
| P1 | 4 |
| P2 | 2 |
| Total | 8 |

