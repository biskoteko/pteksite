# Auditoria QA — acessibilidade WCAG 2.1 AA, performance, SEO técnico e responsivo

**Âmbito:** `index.html` (708 linhas, 33 912 B), `styles.css` (1 545 linhas, 27 011 B), `script.js` (114 linhas, 3 383 B), `README.md`. Análise estática, cálculo de contraste WCAG e validações read-only (parser Python, `grep`, `python3 -m http.server`, `gzip`). Nenhum ficheiro de produto foi alterado.
**Papel:** QA Engineer — acessibilidade, performance de páginas estáticas, SEO técnico e robustez responsiva.
**Data:** 21 de outubro de 2026.
**Contexto:** auditoria axe anterior com 0 violações; este relatório procura o que a axe não apanha (gradientes, estados de foco, fallback sem JS, LCP condicionado por CSS, clipping, semântica dependente de browser, metadados sociais).

**Limitação declarada:** o Chromium disponível em `node_modules/playwright` não arranca neste ambiente (`error while loading shared libraries: libglib-2.0.so.0`); não foi possível medir layout, tab order ou CLS em browser real. Tudo o que depende de runtime está marcado como **SUSPEITA**; o que resulta de leitura de código, cálculo matemático ou validação de ficheiro está marcado como **CONFIRMADO**.

---

## 1) Diagnóstico (3 bullets)

- **Base sólida e sem dívida técnica.** 0 imagens, 0 fontes externas, 0 terceiros, 0 estilos inline: **14 419 B gzip** no total (HTML 7 360 B + CSS 5 905 B + JS 1 154 B). Semântica correta (um único `h1`, hierarquia `h1→h2→h3` sem saltos, landmarks `main`/`nav`/`aside`/`footer`, `lang="pt-PT"`), skip link presente, e **12/12** links `target="_blank"` com `rel="noopener noreferrer"`.
- **O que falha está sobretudo fora do alcance da axe**: contraste sobre gradientes, anel de foco em fundos escuros, menu mobile dependente de JS, LCP condicionado pelo reveal, clipping de `outline` e semântica de listas dependente de browser. A axe não avalia gradientes, estados de foco nem fallback de script.
- **SEO técnico correto no essencial, incompleto no pacote social/local** (sem `canonical`, `og:url`, `og:image`, `twitter:card`; JSON-LD sem NAP). Responsivo: **não foi detetado overflow por análise estática**, mas 320/360/390/1440 não foram medidos em browser — ver limitação acima.

---

## 2) Achados priorizados (8)

### [P1] JS / Progressivo — menu mobile inacessível sem JavaScript
- **Problema:** abaixo de 880 px a navegação é escondida por CSS e o único mecanismo de abertura é JavaScript. O botão existe, é focável e não faz nada sem script.
- **Evidência:** `styles.css:322-343` (`.site-nav{visibility:hidden;opacity:0}` e `.site-nav.is-open{visibility:visible}`); `script.js:36-39` (só o `click` no toggle adiciona `is-open`); `index.html:43-52` (botão) e `index.html:54-69` (nav). `.js` é adicionada inline em `index.html:12-14`, mas a regra que esconde a nav é incondicional.
- **Medição:** a 390 px a nav só é alcançável por JS; sem JS, 4 links de secção + CTA do header ficam inutilizáveis.
- **Correção:** inverter o gate — nav visível por omissão e escondida apenas com `.js .site-nav` (ou trocar por `<details>`), deixando o toggle como melhoria progressiva. Alternativa mínima: manter a nav aberta em `<noscript>` com CSS.
- **Risco:** bloqueio total de navegação em telemóvel para quem tem JS bloqueado, CSP futura, proxy corporativo ou erro de carregamento; contradiz o README (“sem JavaScript a página continua completa e visível”).
- **Estado:** CONFIRMADO (leitura de CSS/JS).

### [P1] Contraste — texto branco sobre o gradiente do botão primário
- **Problema:** o CTA principal usa gradiente e texto branco a 15,2 px/700 (abaixo do limiar de “texto grande”, 18,66 px bold), pelo que exige 4,5:1; o extremo claro do gradiente e o estado hover não cumprem.
- **Evidência:** `styles.css:153-161` (`linear-gradient(135deg,#12904e,#0a6336)`; hover `#15a25a,#0b6f3c`); `styles.css:123-137` (`.btn`, `font-size:.95rem`, `font-weight:700`).
- **Medição (fórmula WCAG 2.x, luminância relativa):** `#12904e` vs `#fff` = **4,10:1**; `#15a25a` vs `#fff` = **3,31:1** (hover); `#0a6336` vs `#fff` = 7,37:1. O gradiente atravessa a zona de falha na diagonal superior esquerda e no hover.
- **Correção:** escurecer os stops para ≥4,5:1 (ex.: `#0d7a43 → #085c31`; hover `#0b6f3c`), ou subir o texto a ≥18,66 px bold, ou remover o gradiente e usar `--brand-strong`.
- **Risco:** incumprimento de 1.4.3 em todos os CTAs de conversão; axe não sinaliza porque não resolve gradientes.
- **Estado:** CONFIRMADO por cálculo.


### [P1] Performance / LCP — primeiro ecrã invisível até o JS correr
- **Problema:** o bloco do herói inteiro (título, lead, CTAs) está dentro de `[data-reveal]`; `.js [data-reveal]` aplica `opacity:0` e `translateY(18px)` com transição de 600 ms. A classe `.js` é adicionada inline no `<head>`, mas a remoção do estado invisível depende de `IntersectionObserver` em `script.js` (`defer`).
- **Evidência:** `index.html:76` (`.hero-copy`, contém o `h1` em `81-84`), `index.html:128` (`.hero-visual`), `index.html:12-14` (`.js` inline); `styles.css:1337-1345`; `script.js:70-100` (observer) e `script.js:82-85` (fallback só sem IO ou com `prefers-reduced-motion`).
- **Medição:** primeiro paint do `h1` a `opacity:0`; o LCP só é candidato depois de o `defer` executar + 600 ms de transição. Se `script.js` falhar (404, CSP, erro), a classe `.js` já está aplicada e **todo** o conteúdo `[data-reveal]` fica invisível de forma permanente.
- **Correção:** retirar `data-reveal` de `.hero-copy`/`.hero-visual` (animar apenas abaixo da dobra); usar `animation` com `animation-fill-mode:both` em vez de classe aplicada por observer; e mover `document.documentElement.classList.add("js")` para o início de `script.js`, para que a ausência do ficheiro nunca esconda conteúdo.
- **Risco:** LCP degradado em 4G/mobile e cenário de página em branco (conteúdo presente no DOM, invisível no ecrã) sem erro visível ao utilizador.
- **Estado:** CONFIRMADO (CSS/JS); magnitude do LCP a medir em browser.

### [P1] Foco — anel de foco insuficiente em fundo escuro e recortado no FAQ
- **Problema:** o anel global usa `--brand` (#0e7a43) com `offset:3px`; sobre os fundos escuros do cartão CTA e do CTA final o contraste do indicador cai, e o `overflow:hidden` do `.faq` recorta o anel do `summary`.
- **Evidência:** `styles.css:90-94` (`:focus-visible{outline:3px solid var(--brand);outline-offset:3px}`); `styles.css:910-916` (`.service-card--cta`, `#0f3a2a→#08251a`); `styles.css:1138-1143` (`.cta-final`, `#0e3a2a→#07231a`); `styles.css:1085-1091` (`.faq{overflow:hidden}`).
- **Medição:** `#0e7a43` vs `#08251a` = **3,01:1** (limite); vs `#0f3a2a` = **2,34:1** (falha 1.4.11, exige 3:1). O `summary` ocupa 100% da largura do cartão, logo o `outline-offset` exterior é cortado nas quatro margens.
- **Correção:** `outline-color:var(--lime)` (#d8f56e, 13,34:1 sobre o ink) nos contextos escuros (`.stats`, `.cta-final`, `.service-card--cta`); trocar `.faq{overflow:hidden}` por `overflow:clip` com `outline-offset` negativo, ou aplicar o foco ao `summary` com `outline-offset:-3px`.
- **Risco:** utilizadores de teclado perdem o indicador nos CTAs escuros e no FAQ (2.4.7/2.4.11), especialmente com pouca visão ou ecrãs de baixo contraste.
- **Estado:** cálculo CONFIRMADO; recorte CONFIRMADO por CSS; impacto visual não reproduzido em browser (SUSPEITA no grau).


### [P2] Layout — `overflow-x:hidden` no `body` pode anular os dois `position:sticky`
- **Problema:** o `body` tem `overflow-x:hidden`, o que o transforma em scroll container (o eixo Y passa a `auto`); `position:sticky` passa a resolver contra o scrollport do `body`, que não faz scroll próprio. Cabeçalho fixo e coluna de introdução do FAQ deixam de colar.
- **Evidência:** `styles.css:43-51` (`body{overflow-x:hidden}`); `.site-header{position:sticky;top:0}` em `styles.css:197-200`; `.sidebar`/`.faq-intro{position:sticky;top:6.5rem}` em `styles.css:942-944` e `styles.css:1071-1074`.
- **Medição:** não reproduzido (sem browser). Comportamento documentado em Chrome/Safari; a correção de controlo é trocar para `clip` e repetir o scroll a 1440 e 390.
- **Correção:** remover `overflow-x:hidden` e corrigir a origem do overflow (o candidato são os `.floating-badge` com offsets negativos em `styles.css:679-689`, já recortados por `.hero{overflow:hidden}` em `styles.css:409-411`), ou usar `overflow-x:clip`, que não cria scroll container.
- **Risco:** header deixa de acompanhar o scroll (perde-se o CTA permanente e a navegação) e a intro do FAQ deixa de fixar; regressão silenciosa, invisível em revisão de código.
- **Estado:** SUSPEITA alta (não reproduzida em browser nesta sessão).

### [P2] SEO técnico — pacote social e schema local incompletos
- **Problema:** não existe `rel=canonical`, `og:url`, `og:image`, `og:site_name` nem `twitter:card`; o JSON-LD descreve o serviço mas não tem URL, imagem, endereço nem `sameAs`, pelo que não sustenta um rich result de negócio local.
- **Evidência:** `index.html:15-21` (apenas `og:type`, `og:locale`, `og:title`, `og:description`); `index.html:689-705` (JSON-LD); validação por parser: JSON válido, chaves presentes `@context,@type,areaServed,description,name,openingHoursSpecification,priceRange,telephone`; ausentes `url,image,address,@id,sameAs`.
- **Medição:** `title` 47 caracteres, `description` 148 caracteres (ambos dentro do intervalo seguro); 0 ocorrências de `canonical`, `og:image`, `og:url`, `twitter`, `robots`, `hreflang`.
- **Correção:** adicionar `<link rel="canonical" href="https://…/">`, `og:url`, `og:image` 1200×630 (JPEG/WebP <300 KB, com `og:image:alt`), `twitter:card=summary_large_image`, e completar o schema com `url`, `image`, `address` (ou `serviceArea` detalhado), `@id` e `sameAs`. Só incluir `aggregateRating` se existir fonte verificável.
- **Risco:** previews sociais vazios (perda de CTR nas partilhas por WhatsApp, o canal principal), possível canibalização se o site for servido em `github.io` e domínio próprio, e inelegibilidade para resultados enriquecidos locais.
- **Estado:** CONFIRMADO.


### [P2] Semântica — listas perdem semântica em Safari/VoiceOver
- **Problema:** o reset global aplica `list-style:none` a todos os `ul`/`ol`; em Safari, listas sem marcador perdem o papel de lista na árvore de acessibilidade, pelo que os 3 passos e a navegação deixam de ser anunciados como lista e como “x de y”.
- **Evidência:** `styles.css:76-83` (`ul,ol,dl,dd{list-style:none}`); afeta `index.html:55` (`.nav-list`), `index.html:106` (`.hero-points`), `index.html:209` (`.steps`), `index.html:393` (`.feature-list`), `index.html:638` e `648` (listas do footer). Nenhum `role="list"` no documento.
- **Medição:** 6 listas potencialmente afetadas; 0 com `role="list"` explícito.
- **Correção:** acrescentar `role="list"` aos `ol`/`ul` cuja estrutura importa (`.steps`, `.nav-list`, `.hero-points`, footer), ou remover `list-style` apenas onde há marcador custom.
- **Risco:** utilizadores de VoiceOver perdem a noção de sequência dos passos e a contagem de links de navegação; axe não sinaliza por ser dependente de user agent.
- **Estado:** SUSPEITA (comportamento conhecido do Safari; não testado em dispositivo).

### [P2] Toque / sobreposição — alvos abaixo de 44 px e botão flutuante sem safe-area
- **Problema:** os links da navegação têm 40,8 px de altura (abaixo dos 44 px de 2.5.5 AAA) e o botão flutuante está fixo a `bottom:1.25rem`/`0.9rem` sem `env(safe-area-inset-*)`, podendo ficar sob o home indicator do iPhone e tapar o CTA final/rodapé em ecrãs curtos.
- **Evidência:** `styles.css:257-266` (`.nav-list a{padding:.5rem .8rem;font-size:.94rem}` → 8+8+24,8 = 40,8 px); `styles.css:1282-1296` (`.whatsapp-float{position:fixed;right:1.25rem;bottom:1.25rem;3.6rem}`); `styles.css:1512-1518` (a ≤560 px, `right/bottom:.9rem`, 3,25rem).
- **Medição:** 40,8 px de altura nos links do header (AA 2.5.8 exige 24 px — cumpre; AAA 2.5.5 exige 44 px — falha). Botão flutuante 52–57,6 px (cumpre), mas sem reserva de safe-area nem colisão resolvida com `#cta-title`/`.footer-bottom`.
- **Correção:** `min-height:44px` + `display:flex;align-items:center` nos links da nav; `bottom:calc(1rem + env(safe-area-inset-bottom));right:calc(1rem + env(safe-area-inset-right))`; esconder o flutuante quando o CTA final estiver visível (`IntersectionObserver`) ou deslocá-lo para cima.
- **Risco:** toques errados em navegação densa e CTA final parcialmente coberto no momento de decisão; perda de conversão em iOS.
- **Estado:** medidas CONFIRMADO por cálculo; sobreposição SUSPEITA (não medida em browser).


---

## 3) Medições de contraste (fórmula WCAG 2.x)

| Par | Onde | Rácio | Veredicto |
| --- | --- | --- | --- |
| `#12904e` sobre `#ffffff` | gradiente do `.btn--primary`, extremo claro | **4,10:1** | falha 1.4.3 (texto 15,2 px/700) |
| `#15a25a` sobre `#ffffff` | `.btn--primary:hover` | **3,31:1** | falha 1.4.3 |
| `#0a6336` sobre `#ffffff` | fim do gradiente | 7,37:1 | passa |
| `#0e7a43` sobre `#08251a` | anel de foco em `.stats` | 3,01:1 | no limite (1.4.11) |
| `#0e7a43` sobre `#0f3a2a` | anel de foco em `.service-card--cta` | **2,34:1** | falha 1.4.11 |
| `#55705f` sobre `#f7faf6` | `--muted` em texto corrente | 5,16:1 | passa |
| `#55705f` sobre `#ffffff` | `.chat-foot`, `.footer-*` | 5,43:1 | passa |
| `#0e7a43` sobre `#f7faf6` | `.eyebrow` | 5,14:1 | passa |
| `#0a6336` sobre `#e6f5ec` | `.card-link`, `--brand-strong` | 6,54:1 | passa |
| `#ffffff` sobre `#08251a` | texto do `.stats` | 16,28:1 | passa |
| `#08251a` sobre `#d8f56e` | `.stat dd`, `::selection` | 13,34:1 | passa |
| `rgba(255,255,255,.58)` efetivo `#9aaca6` sobre `#0e3a2a` | `.cta-note` | 5,33:1 | passa |
| `rgba(255,255,255,.76)` efetivo `#c5d0cc` sobre `#0e3a2a` | `.cta-final-lead` | 8,01:1 | passa |

---

## 4) Verificações que passaram (checklist do método)

- **Semântica e headings:** `h1` único (`index.html:81`); sequência `h1 → h2 (Três passos) → h3×3 → h2 (Serviços) → h3×6 → h2 (Porque) → h3×4 → h2 (Testemunhos) → h2 (Antes de nos escrever) → h2 (Vamos resolver) → h2 (Navegação) → h2 (Contacto)`; sem saltos de nível. Cada secção tem `aria-labelledby` a apontar para o `h2` real (`index.html:74,198,238,381,447,512,584`).
- **IDs e âncoras:** 15 `id` únicos, 0 duplicados; todos os `href="#…"` resolvem; 0 links internos quebrados; 0 `<img>` (logo e ícones são SVG inline, sem texto alternativo em falta).
- **Landmarks e ARIA:** `main#conteudo` único, `nav` com dois nomes distintos (“Navegação principal” e “Navegação do rodapé”), `aside` rotulado, `header`/`footer` nativos; 18 `aria-label` auditados, todos com nome acessível que inclui o texto visível (2.5.3 cumprida, ex. “PTek — início” contém “PTek”); `aria-expanded`/`aria-controls` no toggle, `aria-hidden`+`focusable="false"` em todos os SVGs decorativos; rating com `role="img"`+`aria-label` e estrelas em `aria-hidden`.
- **Teclado:** toggle é `<button type="button">` (Enter/Espaço nativos); `Esc` fecha o menu e devolve o foco ao toggle (`script.js:45-50`); clique fora fecha (`script.js:52-56`); clique num link fecha (`script.js:41-43`); mudança de breakpoint fecha (`script.js:58-66`); sem `tabindex` positivos; sem `outline:none` em nenhum seletor.
- **FAQ:** `<details>/<summary>` nativos, primeiro aberto (`index.html:532`); estado expandido e teclado vêm do browser; sem ARIA manual redundante; conteúdo visível sem JS.
- **Alvos de toque (AA 2.5.8, mínimo 24×24):** todos os controlos ≥24 px de altura; `.nav-toggle` 44×44; `summary` ≈59 px; `.whatsapp-float` 52–57,6 px; links inline dispensados pela exceção de texto.
- **Fallback sem JS (conteúdo):** `.js [data-reveal]` só esconde se o inline correr; sem JS, tudo visível; `prefers-reduced-motion` força `opacity:1` (`styles.css:1520-1543`) e `script.js:82-85` mostra tudo de imediato; ano do rodapé tem valor estático `2026` (`index.html:666`).
- **Responsivo (análise estática, não medida):** breakpoints a 1024/900/880/760/560/400 px cobrem os 4 alvos pedidos; `grid-template-columns:minmax(0,1fr)` evita blowout; `img,svg{max-width:100%}`; `.chat-card{max-width:100%}` a ≤560; badges flutuantes (offsets negativos) desligados a ≤560 (`styles.css:1512-1518`); `body{min-width:320px}` cumpre 1.4.10 (320 px). Nenhum `width` fixo em texto; nenhum `nowrap` fora do `.float-label` (revelado só em hover/focus).
- **CLS:** nenhuma animação altera layout (só `opacity`/`transform`); sem imagens sem dimensões; sem injeção de conteúdo acima da dobra; o único texto mutável (ano) mantém largura. Risco residual baixo.
- **Peso e bloqueio de render:** um CSS render-blocking de 5,9 KB gzip (aceitável), JS `defer` 1,2 KB, zero pedidos de terceiros, zero fontes web, zero imagens; favicon em data-URI (sem pedido extra); sem `@import`.
- **Segurança de links:** 12 `target="_blank"` → 12 `rel="noopener noreferrer"`; 0 handlers inline; 0 `javascript:`; `tel:` e `wa.me` em E.164 sem `+` (formato correto do WhatsApp); texto pré-preenchido corretamente percent-encoded, sem dupla codificação.
- **Metadados base:** `lang="pt-PT"`, `charset`, `viewport` sem `user-scalable=no`, `theme-color` igual ao fundo, `title` 47 car., `description` 148 car., `og:locale=pt_PT`, favicon presente.


---

## 5) Falsos positivos (não corrigir)

- **Estrelas `#eaa100` sobre branco = 2,19:1:** o texto está dentro de `.badge-stars` (`aria-hidden="true"`, `index.html:164`) ou de `.stars` com `role="img"` + `aria-label` e glifos em `aria-hidden` (`index.html:459-461`). A informação é transmitida pelo nome acessível, não pela cor — isento de 1.4.3 e de 1.4.11.
- **`#6a8375` (4,1:1) e `#9db4a7` (2,21:1) no mockup de chat:** todo o `.chat-card` é `aria-hidden="true"` (`index.html:129`); é ilustração decorativa, não conteúdo.
- **`#55705f` sobre `#eef6f0` = 4,93:1:** passa; o valor mais baixo da paleta (`--muted`) continua acima de 4,5:1 em todos os fundos onde é usado.
- **Placeholder “Inter” na stack tipográfica:** não há `@font-face` nem pedido externo; a fonte nunca é descarregada e o fallback `system-ui` aplica-se. Não é erro de performance, apenas um token morto.
- **Ausência de `<noscript>` para conteúdo:** desnecessária — o conteúdo não depende de JS; o problema real é a navegação mobile (achado P1), não o texto.

---

## 6) Riscos residuais

- **Cabeçalhos de segurança:** sem CSP, `Referrer-Policy`, `X-Content-Type-Options` ou `Permissions-Policy`. Não são resolvíveis em HTML/CSS/JS puro — dependem do hosting (GitHub Pages não permite headers custom). Se for adicionada CSP, o script inline do `<head>` (`index.html:12-14`) e o JSON-LD exigem `'unsafe-inline'` ou nonce/hash; não existem estilos inline, o que ajuda.
- **Prova social não verificável:** “+1.200 atendimentos”, “4,9/5”, “94%”, “12 min” e 3 testemunhos com iniciais (`index.html:163-194,452-507`) não têm fonte, data ou ligação externa; o próprio README admite que são exemplos. Risco de E-E-A-T e de publicidade enganosa — decisão de negócio, não de código.
- **Dependência do WhatsApp:** 12 dos 13 CTAs apontam para `wa.me`; bloqueadores de trackers/extensões podem intercetar `target="_blank"` e o fallback `tel:` só existe no CTA final e rodapé.
- **Estado “online” estático:** `.status-dot` e “Estamos online” aparecem sempre, independentemente do horário 8h–22h anunciado (`index.html:77-80,586-589`); inconsistência factual percetível fora de horário.
- **`backdrop-filter: blur(14px)` no header sticky** (`styles.css:203`): composição contínua durante o scroll em Android de gama baixa; não é falha, é custo — vigiar em Lighthouse mobile.
- **Validação em browser em falta:** sticky, tab order real, overflow a 320/360/390 e CLS ficam por confirmar até alguém correr o teste com as bibliotecas de sistema instaladas.


---

## 7) Top 3 correções para já

1. **Menu mobile sem JS** — inverter o gate para `.js .site-nav` (10 min, elimina bloqueio total de navegação em telemóvel).
2. **Escurecer o gradiente dos CTAs** (`#0d7a43 → #085c31`, hover `#0b6f3c`) — corrige o único contraste confirmado abaixo de 4,5:1 em elementos de conversão.
3. **Retirar `data-reveal` do herói** e passar a classe `.js` para dentro do `script.js` — protege o LCP e elimina o cenário de página em branco.

---

## 8) O que está bem e não deve ser mexido

- **Gate `.js` no CSS** (`styles.css:1337`) em vez de `[data-reveal]` puro: garante conteúdo visível sem script; é o padrão correto e deve ser preservado ao corrigir o achado de LCP.
- **`prefers-reduced-motion`** completo (`styles.css:1520-1543`): desliga animações e transições, força `opacity:1` e `scroll-behavior:auto`; o JS acompanha com `showAll()`.
- **FAQ nativo** (`<details>/<summary>`, primeiro aberto): teclado, estados e fallback gratuitos; não substituir por ARIA custom.
- **Skip link + foco gerido no menu** (`index.html:29`, `script.js:45-50`): `Esc` devolve o foco ao toggle, comportamento que muita implementação manual falha.
- **Semântica de secções e testemunhos:** `aria-labelledby` em todas as secções, `<figure>/<blockquote>/<figcaption>`, `<dl>` para os números, `<ol>` para os passos.
- **Segurança e leveza:** `noopener noreferrer` em 100% dos links externos, zero dependências de runtime, zero terceiros, favicon e ícones inline — o melhor ativo técnico da página.

---

## Anexo — validações executadas (read-only)

| Comando | Resultado |
| --- | --- |
| `wc -l` / `stat` | 708 + 1 545 + 114 linhas; 33 912 + 27 011 + 3 383 B |
| `gzip -c … \| wc -c` | 7 360 + 5 905 + 1 154 = **14 419 B** |
| parser Python (ids/âncoras/headings) | 0 ids duplicados, 0 âncoras quebradas, 1 `h1`, 0 `<img>` |
| parser Python (metadados) | `canonical/og:image/og:url/twitter/robots/hreflang` ausentes; `title` 47, `description` 148 |
| `json.loads` no bloco JSON-LD | válido; faltam `url,image,address,@id,sameAs` |
| cálculo WCAG próprio | 13 pares de contraste (tabela da secção 3) |
| `python3 -m http.server` + `curl` | 200 em `index.html`, `styles.css`, `script.js` |
| Playwright | **não executado** — `libglib-2.0.so.0` em falta; sem medições de layout |
| `git status` | inalterado exceto `docs/reviews/qa.md` |

**Contagem final: 0 P0, 4 P1, 4 P2 (8 achados).**

