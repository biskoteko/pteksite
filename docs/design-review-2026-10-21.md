# Ciclo de design review — 21 de outubro de 2026

Primeiro ciclo do estúdio de agentes (`agents/`) aplicado à landing page PTek.
Quatro revisores trabalharam em paralelo, em modo read-only; a síntese e a
implementação ficaram com o orquestrador.

## Decisão do ciclo

Substituir prova social não verificável por compromissos operacionais e corrigir
os bloqueios técnicos confirmados (navegação sem JS, contraste dos CTAs, foco em
fundos escuros, LCP preso ao reveal), sem redesign estrutural.

## Participantes e entregas

| Agente | Relatório | Achados |
| --- | --- | --- |
| UX Strategist | `docs/reviews/ux.md` | 3 P0 · 4 P1 · 1 P2 |
| UI Designer | `docs/reviews/visual.md` | 2 P0 · 4 P1 · 2 P2 |
| Copywriter | `docs/reviews/copy.md` | 2 P0 · 4 P1 · 2 P2 |
| QA Engineer | `docs/reviews/qa.md` | 0 P0 · 4 P1 · 4 P2 |

## Entrou

| # | Prioridade | Alteração | Origem | Critério de aceitação |
| --- | --- | --- | --- | --- |
| 1 | P0 | Remover “+1.200”, “94%”, “4,9/5”, “214 avaliações” e “12 min”; faixa de números passa a compromissos (8h–22h, diagnóstico gratuito, preço fechado, garantia) | UX, Copy | Nenhum número não comprovável no HTML |
| 2 | P0 | Hero visível no primeiro paint: removido `data-reveal` do hero; classe `.js` atribuída pelo `script.js` | UX, QA | Sem `.js`, hero e secções visíveis; LCP deixa de depender do observer |
| 3 | P0 | H1 com categoria + benefício e sintomas no lead; `title`/`meta description` com intenção de busca | UX, Copy | `h1` contém “assistência técnica online”; title ≤ 60 caracteres |
| 4 | P0 | Testemunhos com nomes, estrelas e citações substituídos por três casos típicos, sem alegações de clientes reais | UX, Copy | Nenhuma avaliação ou pessoa citada |
| 5 | P1 | Menu mobile acessível sem JavaScript: nav visível por omissão, escondida apenas com `.js`; toggle só aparece com JS | QA | Com JS desativado, 4 links + CTA alcançáveis |
| 6 | P1 | Contraste dos CTAs: gradiente `#0d7a43 → #085c31` (hover `#0b6f3c → #064b28`) | QA | Branco ≥ 4,5:1 em todos os estados |
| 7 | P1 | Foco visível em fundos escuros (lima) e sem recorte no FAQ | QA | Anel ≥ 3:1 e integralmente visível |
| 8 | P1 | `overflow-x: clip` no `body` | QA | Header e coluna do FAQ mantêm `position: sticky` |
| 9 | P1 | Estado “online” calculado em `Europe/Lisbon` (8h–22h), com fallback estático | UX | Fecha às 22h e abre às 8h, sem depender do browser |
| 10 | P1 | CTA flutuante só depois do hero, rotulado, com safe-area e oculto no CTA final | UX, QA | Visível a meio da página, invisível no topo e no fecho |
| 11 | P1 | Copy: sem promessas absolutas (“dados intactos”, “nada se perde”, “apenas se ficar satisfeito”); SLA removido; CTAs unificados | Copy | Revisão manual dos textos |
| 12 | P2 | Tokens de texto, medida de 34rem, ritmo de secção, raios, primeiro divisor dos stats, ícone do cartão CTA | Visual | Consistência visual a 390/1024/1440 |

## Não entrou (e porquê)

- **Self-hosting da Inter** (`visual.md` P0): exige ficheiro binário e licença
  OFL; fica como decisão de marca, não de código. O tracking foi graduado por
  nível para reduzir a dependência de métricas da Inter.
- **Domínio, `canonical`, `og:image`, `og:url`** (`copy.md` A8, `qa.md`):
  dependem do domínio real; não se inventa URL.
- **Preços concretos e condições da garantia** (`ux.md` P1): decisão de negócio.
- **Prova social real** (avaliações Google/Trustpilot): precisa de autorização e
  dados verificáveis.
- **Redesenho do mockup mobile / ordem das secções** (`ux.md` P2): ganho
  marginal; evitar mexer no que já converte.

## Evidência de validação

| Verificação | Resultado |
| --- | --- |
| axe-core (WCAG 2.1 AA + best practices), 1440 e 390 | 0 violações |
| Overflow horizontal 320 / 360 / 390 / 820 / 1024 / 1440 / 1920 | 0 casos |
| Sem JavaScript (Playwright, 390) | nav visível (4 links), toggle oculto, hero com `opacity: 1` |
| Estado fora de horário (23:30 Lisboa, `page.clock`) | “Fora de horário · respondemos às 8h” + ponto cinzento |
| Sticky header / coluna do FAQ | `top: 0` e `top: 191` após scroll |
| CTA flutuante | oculto no topo, visível a 1400 px, oculto no CTA final |
| Consola do browser | 0 erros |
| HTML/CSS | sem tags por fechar, âncoras válidas, chaves balanceadas |

## Riscos residuais

1. **Tipografia**: sem ficheiro Inter, a página usa a pilha do sistema. Resolve-se
   com uma variável self-hosted e respetiva licença.
2. **Conteúdo de exemplo**: os três casos típicos são ilustrativos e estão
   identificados como tal no README; devem ser trocados por situações reais
   autorizadas.
3. **Dependência de WhatsApp**: 12 CTAs apontam para `wa.me`; o telefone cobre
   apenas o hero, CTA final e rodapé.
4. **Métricas**: não há analytics; o efeito das alterações não é mensurável até
   existir instrumentação.
