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
| Hero | Promessa clara, prova rápida (diagnóstico, resposta, garantia) e mockup de conversa |
| Faixa de números | Credibilidade imediata (atendimentos, resolução, avaliação, garantia) |
| Como funciona | Reduzir incerteza em 3 passos |
| Serviços | Mostrar cobertura e ligar cada serviço a uma mensagem pré-preenchida |
| Porque a PTek | Diferenciais (rapidez, preço fechado, privacidade, garantia) |
| Testemunhos | Prova social com contexto do problema resolvido |
| FAQ | Responder às objeções antes do contacto (`<details>` nativo) |
| CTA final | Última chamada, com WhatsApp e telefone |
| Footer | Navegação, contacto e horário |
| Botão flutuante | Atalho permanente para WhatsApp em qualquer ponto da página |

## Ficheiros

- `index.html` — conteúdo, metadados (SEO/Open Graph), favicon inline, dados
  estruturados `ProfessionalService` (JSON-LD) e todo o texto da página.
- `styles.css` — design system e layout. Tokens no topo (`:root`), componentes
  por secção, responsivo em 1024/900/760/560/400 px e respeito por
  `prefers-reduced-motion`.
- `script.js` — melhorias progressivas: menu mobile (com `Esc` e clique fora),
  sombra do header ao scroll, revelação de secções com `IntersectionObserver` e
  ano do rodapé. Sem JavaScript a página continua completa e visível.
- `README.md` — este documento.

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
4. **Prova social:** os números da faixa `.stats`, a avaliação do hero
   (`.floating-badge--rating`) e os três testemunhos devem refletir dados reais
   antes de publicar.
5. **Horário:** presente no FAQ, no CTA final, no footer e no JSON-LD
   (`openingHoursSpecification`).

## Decisões de design

- **Cor:** verde profundo como tinta, verde WhatsApp como cor de ação e lima
  apenas em destaques. Contraste de texto pensado para AA.
- **Tipografia:** pilha de sistema (Inter quando disponível), com escala fluida
  via `clamp()`; zero pedidos externos, zero fontes bloqueantes.
- **CTA único:** todas as ações levam ao WhatsApp, com mensagens contextuais por
  serviço para reduzir o atrito da primeira mensagem.
- **Acessibilidade:** landmarks semânticos, skip link, foco visível, `aria-expanded`
  no menu, alvos de toque ≥ 44 px, conteúdo decorativo (`chat-card`, ícones) oculto
  de leitores de ecrã, animações desativadas com `prefers-reduced-motion` e FAQ
  nativo por teclado.
- **Desempenho:** uma folha de estilo, um script de ~3 KB e nenhuma imagem
  bitmap — o visual do hero é construído em CSS.

## Antes de publicar

- Substituir os dados de exemplo (números, testemunhos, horário) por informação
  real.
- Confirmar o número de WhatsApp e testar cada link em desktop e telemóvel.
- Se houver domínio próprio, acrescentar `og:image`, `og:url` e a tag canónica.

