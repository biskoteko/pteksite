# pteksite

Landing page estática da PTEK — sites, lojas online e automações de WhatsApp.
Construída em HTML, CSS e um pequeno ficheiro JavaScript, sem qualquer passo de
build ou dependências.

## Estrutura

| Ficheiro | Descrição |
| --- | --- |
| `index.html` | Todo o conteúdo e a estrutura da página (secções, texto, ligações). |
| `styles.css` | Design tokens, layout, componentes e responsividade. |
| `script.js` | Menu móvel, revelação ao scroll, sombra do cabeçalho e ano do rodapé. |

## Como ver a página

Basta abrir `index.html` no navegador. Para servir localmente (recomendado, para
que o `script.js` e o CSS sejam carregados com os cabeçalhos corretos):

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Secções da página

1. **Cabeçalho** — navegação fixa com CTA de WhatsApp (menu hambúrguer abaixo de
   880 px).
2. **Hero** — proposta de valor, botões de ação e simulação de conversa de
   WhatsApp.
3. **Números** — faixa escura com indicadores de confiança.
4. **Serviços** — sites/landing pages, lojas online e automação de WhatsApp.
5. **Como funciona** — processo em três passos.
6. **Porquê a PTEK** — diferenciais e cartão de garantia com CTA.
7. **Depoimentos**, **perguntas frequentes** e **CTA final**.
8. **Rodapé** e botão flutuante de WhatsApp.

## Personalização

- **Contacto:** o número `351928124737` aparece nas ligações `https://wa.me/...`
  (cabeçalho, hero, secção “Porquê a PTEK”, FAQ, CTA final, rodapé e botão
  flutuante). Substitua o número em todas as ocorrências e ajuste a mensagem
  depois de `text=` (codificada para URL). O número visível no rodapé está em
  texto simples: `+351 928 124 737`.
- **Marca:** o nome `PTEK` aparece no logótipo, no título, no rodapé e no mockup
  de conversa. O logótipo é apenas um bloco CSS (`.brand-mark`), sem imagem
  necessária.
- **Cores e tipografia:** todos os valores estão em variáveis no topo de
  `styles.css` (`:root`): `--brand`, `--wa`, `--ink`, `--bg`, `--font`, etc.
  A fonte Inter é carregada do Google Fonts, com fallback para as fontes do
  sistema; para funcionar 100% offline, basta remover os `<link>` da fonte no
  `<head>`.
- **Textos:** cada secção está identificada por `id` (`#servicos`, `#processo`,
  `#porque`, `#perguntas`, `#contacto`), facilitando a edição do conteúdo.

> **Nota:** os números, depoimentos e prazos presentes na página são exemplos
> ilustrativos. Substitua-os por dados reais antes de publicar.

## Publicação

Os ficheiros são estáticos, pelo que podem ser publicados em qualquer serviço de
hospedagem estática (GitHub Pages, Netlify, Vercel, Cloudflare Pages) sem
configuração adicional.

## Acessibilidade

Inclui link para saltar para o conteúdo, navegação por teclado com foco visível
(`:focus-visible`), `aria-expanded` no menu móvel, marcas semânticas
(`header`, `main`, `section`, `footer`) e suporte a `prefers-reduced-motion` para
desativar animações.
