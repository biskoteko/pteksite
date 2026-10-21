# PTek — landing page

Landing page estática de assistência técnica online, com conversão por WhatsApp.
Sem build, sem dependências e sem frameworks: apenas HTML, CSS e um pequeno
script de melhorias progressivas.

## Ver localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Também funciona ao abrir `index.html` diretamente no navegador.

## Estrutura da página

A página segue a ordem de decisão de quem chega com um problema:

| Secção | Objetivo |
| --- | --- |
| Header fixo | Navegação curta + CTA permanente para WhatsApp |
| Hero | Promessa, sintomas no lead e mockup de conversa |
| Faixa de compromissos | O que o serviço garante: horário, diagnóstico, preço fechado, garantia |
| Como funciona | Reduzir incerteza em 3 passos |
| Serviços | Mostrar cobertura e ligar cada serviço a uma mensagem pré-preenchida |
| Porque a PTek | Diferenciais (horário, preço fechado, privacidade, garantia) |
| Casos típicos | Exemplos de problemas resolvidos, sem avaliações ou nomes inventados |
| FAQ | Responder às objeções antes do contacto (`<details>` nativo) |
| CTA final | Última chamada, com WhatsApp e telefone |
| Footer | Navegação, contacto e horário |
| Botão flutuante | Atalho para WhatsApp depois do hero, oculto no CTA final |

## Ficheiros

- `index.html` — conteúdo, metadados (SEO/Open Graph), favicon inline, dados
  estruturados `ProfessionalService` (JSON-LD) e todo o texto da página.
- `styles.css` — design system e layout. Tokens no topo (`:root`), componentes
  por secção, responsivo em 1024/940/900/760/560/400 px e respeito por
  `prefers-reduced-motion`.
- `script.js` — melhorias progressivas: menu mobile (com `Esc` e clique fora),
  sombra do header ao scroll, estado de atendimento em `Europe/Lisbon`, revelação
  de secções com `IntersectionObserver`, CTA flutuante contextual e ano do
  rodapé. Sem JavaScript a página continua completa, visível e navegável.
- `agents/` — playbook do estúdio de agentes (papéis, pipeline, gates).
- `docs/reviews/` — auditorias do ciclo, por especialidade.
- `docs/design-review-2026-10-21.md` — síntese, decisões e evidência de validação.
- `README.md` — este documento.

## Estúdio de agentes

A página é mantida com um fluxo de orquestração documentado em
`agents/README.md`: revisão paralela por UX, UI, copy e QA (read-only), síntese
do lead, implementação por um único escritor e validação por gates. Cada papel
tem um cartão reutilizável em `agents/*.md`; o primeiro ciclo está registado em
`docs/design-review-2026-10-21.md`, com os pareceres completos em
`docs/reviews/`.

## Personalizar

1. **Marca:** substituir `PTek` no header, footer, `<title>`, metadados e
   JSON-LD. O logótipo é um SVG inline em `.brand-mark`.
2. **Contacto:** o número aparece em todas as URLs `https://wa.me/351928124737`
   e no `tel:+351928124737`. Cada CTA tem uma mensagem própria no parâmetro
   `text=` (codificada em URL); ajustar mantendo o formato internacional sem
   espaços.
3. **Oferta:** o posicionamento atual é assistência técnica remota
   (computadores, telemóveis, redes). Para outro serviço, atualizar hero, os
   seis cartões de `#servicos`, os passos de `#como-funciona` e o FAQ.
4. **Casos típicos:** os três cartões de `#testemunhos` são exemplos
   ilustrativos. Substituir por situações reais (com autorização) ou por
   avaliações verificáveis, mantendo o mesmo formato e sem inventar números.
5. **Horário:** presente no FAQ, no CTA final, no footer, no estado do chat e no
   JSON-LD (`openingHoursSpecification`). O estado “Online agora” é calculado
   pelo browser em `Europe/Lisbon`, entre as 8h e as 22h.

## Decisões de design

- **Cor:** verde profundo como tinta, verde de marca como cor de ação e lima
  apenas em destaques e ícones sobre fundos escuros. Os gradientes dos CTAs foram
  escurecidos para garantir 4,5:1 com texto branco.
- **Tipografia:** pilha de sistema (Inter quando disponível), com escala fluida
  via `clamp()` e tracking por nível; zero pedidos externos, zero fontes
  bloqueantes.
- **CTA único:** todas as ações levam ao WhatsApp, com mensagens contextuais por
  serviço para reduzir o atrito da primeira mensagem.
- **Acessibilidade:** landmarks semânticos, skip link, foco visível (lima sobre
  fundos escuros), `aria-expanded` no menu, alvos de toque ≥ 44 px, conteúdo
  decorativo (`chat-card`, ícones) oculto de leitores de ecrã, animações
  desativadas com `prefers-reduced-motion`, FAQ nativo por teclado e navegação
  completa sem JavaScript.
- **Desempenho:** uma folha de estilo, um script de ~2 KB comprimido e nenhuma
  imagem bitmap — o visual do hero é construído em CSS, sem revelar o primeiro
  ecrã via JavaScript.

## Antes de publicar

- Substituir os três casos típicos por situações reais autorizadas e confirmar o
  horário e as condições da garantia.
- Confirmar o número de WhatsApp e testar cada link em desktop e telemóvel.
- Se houver domínio próprio, acrescentar `og:image`, `og:url` e a tag canónica.
- Opcional: self-host da Inter (variável, com licença OFL) para fixar a
  tipografia em todos os sistemas.

