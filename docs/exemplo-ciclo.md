# Exemplo de ciclo — “Transparência de preços”

> **Estado:** exemplo de trabalho, **não aplicado**. A landing page em produção
> não foi alterada. Serve para mostrar como um pedido entra no estúdio de
> agentes, como é decomposto, como se resolvem conflitos e como se prova que
> ficou bem feito.

Este exemplo usa um item real que ficou adiado no primeiro ciclo
(`docs/design-review-2026-10-21.md`, secção “Não entrou”): a objeção “quanto
custa?” só é respondida na FAQ, depois de cinco módulos. Não exige preços
inventados — o negócio ainda não os definiu.

---

## 1. Brief (orquestrador)

```md
Objetivo: responder “quanto custa?” antes da secção de serviços, sem anunciar
preços que o negócio ainda não fixou.

Público: quem chega com o computador avariado e compara com uma loja física.

Oferta: diagnóstico gratuito, valor fixo aprovado antes de qualquer intervenção,
pagamento no fim (transferência ou MB Way).

Restrições: manter o sistema visual e os tokens existentes; sem novos CTAs;
sem números, prazos ou avaliações não comprováveis; pt-PT.

Sucesso: um visitante que só leia o hero e a faixa seguinte percebe quanto paga
e quando paga, sem abrir a FAQ.
```

## 2. Decomposição em tarefas

| Tarefa | Responsável | Escopo | Critério de aceitação |
| --- | --- | --- | --- |
| `task_preco_ux` | UX Strategist | Onde colocar o bloco e o que ele tem de responder | A objeção fica respondida antes de `#servicos`, sem novo scroll |
| `task_preco_copy` | Copywriter | Texto dos três pontos, sem preços nem promessas absolutas | Zero valores, prazos ou garantias novas |
| `task_preco_visual` | UI Designer | Componente com os tokens atuais | Funciona a 320–1440 px, sem overflow |
| `task_preco_qa` | QA Engineer | Semântica, contraste, no-JS, teclado | 0 violações axe; conteúdo visível sem JS |

As quatro correm em paralelo, read-only. O orquestrador é o único que escreve.

---

## 3. Handoffs de exemplo

### UX Strategist

**[P1] Conversão / objeção de preço** — A resposta existe, mas chega tarde:
`#perguntas` só aparece depois de serviços, diferenciais e casos.
**Evidência:** `index.html` (`#servicos` e `#perguntas`); o hero promete “preço
fechado” sem explicar o processo.
**Proposta:** faixa de três pontos imediatamente após `.stats`, antes de
`#como-funciona`: diagnóstico 0 €, valor por escrito antes de mexer, pagamento
no fim. Sem botão novo — o CTA do hero e o flutuante já cobrem a ação.
**Impacto:** elimina a principal razão de abandono antes do primeiro clique.
**Critério:** quem lê apenas o primeiro ecrã e a faixa seguinte sabe quanto paga
e quando.

### Copywriter

**[P1] Copy / processo de preço** — O FAQ diz “valor fixo e só avançamos com a
sua aprovação”, mas o hero não liga o preço ao momento da decisão.
**Evidência:** `index.html` (lead do hero; resposta “Quanto custa o atendimento?”).
**Texto proposto (pronto a colar):**

- **Diagnóstico 0 €** — “Analisamos o problema e dizemos o que tem de ser feito.”
- **Valor por escrito** — “Recebe o preço antes de tocarmos no equipamento.”
- **Paga no fim** — “Transferência ou MB Way, depois de resolvido.”

**Impacto:** transforma uma política vaga numa sequência verificável.
**Risco:** não prometer “sem custos se não concordar” — essa condição não está
definida pelo negócio.

### UI Designer

**[P1] Componente / faixa de processo** — Reutilizar o ritmo dos “passos”, mas
mais compacto, para não competir com `#como-funciona`.
**Proposta:**

```css
.price-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;                      /* linhas de 1px com background --line */
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--line);
}
.price-strip > * {
  padding: 1.15rem 1.25rem;
  background: var(--card);
}
.price-strip strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: var(--text-base);
}
.price-strip span {
  color: var(--ink-soft);
  font-size: var(--text-sm);
}
@media (max-width: 760px) {
  .price-strip { grid-template-columns: minmax(0, 1fr); }
}
```

**Impacto:** lê-se como processo, não como tabela de preços; alinha com os
cartões e empilha no mobile sem scroll lateral.

### QA Engineer

**[P1] Semântica / leitura assistida** — Uma sequência de passos é uma lista
ordenada: usar `<ol>`, não `<div>`s.
**Confirmado:** o componente não tem foco nem ação, logo não cria paragens de
teclado; o contraste de `--ink-soft` sobre `--card` já está validado no resto da
página.
**Verificações:** 320 px sem overflow; visível sem JS (sem `data-reveal`);
0 violações axe; nenhum número novo no HTML.
**Risco se falhar:** a faixa vira “mais um bloco de marketing” e o utilizador
continua sem saber quando paga.

---

## 4. Síntese do orquestrador

**Conflito:** o UX propôs quatro pontos (incluindo “orçamento sem compromisso”);
copy e QA mostraram que o quarto repete o hero e não acrescenta informação
verificável. **Decisão:** três pontos. Regra aplicada — impacto no utilizador
ganha a completude.

**Entra**

1. Faixa de três pontos, sem CTA próprio, entre `.stats` e `#como-funciona`.
2. Texto exatamente como proposto pela copy, sem “sem compromisso” adicional.
3. Componente `.price-strip` com tokens existentes e empilhamento aos 760 px.
4. `<ol>` com três `<li>`; nada de `data-reveal`.

**Não entra**

- Tabela de preços: o negócio não fixou valores.
- Pacotes/comparador: não há oferta definida.
- Novo CTA: já existem 12 entradas para WhatsApp; mais uma dilui a hierarquia.
- Animação de entrada: contraria o gate de primeiro paint.

**Critério de aceitação do ciclo:** a objeção de preço fica respondida antes de
`#servicos`, sem novo pedido de ação e sem dados inventados.

---

## 5. Plano de implementação (não executado)

```html
<section class="section section--tight" aria-labelledby="preco-title">
  <div class="container">
    <h2 id="preco-title" class="visually-hidden">Como funciona o preço</h2>
    <ol class="price-strip">
      <li>
        <strong>Diagnóstico 0 €</strong>
        <span>Analisamos o problema e dizemos o que tem de ser feito.</span>
      </li>
      <li>
        <strong>Valor por escrito</strong>
        <span>Recebe o preço antes de tocarmos no equipamento.</span>
      </li>
      <li>
        <strong>Paga no fim</strong>
        <span>Transferência ou MB Way, depois de resolvido.</span>
      </li>
    </ol>
  </div>
</section>
```

Notas de integração:

- Colocar depois de `.stats`, antes de `#como-funciona`.
- `section--tight` exigiria `padding-block: clamp(2.5rem, 5vw, 3.5rem)` para não
  abrir um vazio entre a faixa escura e os passos.
- `visually-hidden` ainda não existe no projeto: criar o utilitário
  (`position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap`).
- Atualizar o FAQ para remover a duplicação: “Quanto custa o atendimento?” passa
  a remeter para a faixa, mantendo o detalhe do pagamento.

## 6. Gates antes de entregar

| Gate | Como se prova |
| --- | --- |
| Conteúdo | Nenhum valor, prazo ou avaliação nova no HTML |
| Semântica | `<ol>` com 3 itens; um `h2` oculto acessível |
| Visual | 320/390/760/1440 sem overflow; alinhado com `.container` |
| Acessibilidade | axe 0 violações; leitura por teclado inalterada |
| Robustez | Bloco visível com JS desativado |
| Conversão | Nenhum CTA novo; objeção respondida antes de `#servicos` |

## 7. O que este exemplo demonstra

- O brief fixa o que **não** se pode inventar; sem isso, a copy teria criado
  preços e o QA teria de travar o ciclo.
- A revisão paralela produz propostas compatíveis porque todos leem a mesma base
  factual e o mesmo contrato.
- A síntese é uma decisão, não um “sim” a tudo: quatro propostas entraram, quatro
  ficaram de fora com justificação.
- O gate final é verificável por comando/medição, não por opinião.

Para executar este exemplo de verdade: aplicar o bloco, correr `axe` a 1440 e
390, medir 320–1440 e registar o ciclo em `docs/design-review-<data>.md`.


