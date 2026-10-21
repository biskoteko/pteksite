# Estúdio de agentes para landing pages

Playbook para orquestrar agentes especialistas na conceção, revisão e entrega de
landing pages estáticas. O lead (orquestrador) não desenha sozinho: distribui o
trabalho, impõe contratos de entrega, resolve trade-offs e é o único que escreve
no código durante a fase de implementação.

## Elenco

| Agente | Domínio | Pode escrever? |
| --- | --- | --- |
| `orchestrator` | Brief, priorização, integração, entrega | Sim (fase 3) |
| `ux-strategist` | Arquitetura de informação, conversão, jornada | Não |
| `ui-designer` | Design system, tipografia, cor, composição | Não |
| `copywriter` | Copy pt-PT, tom, SEO on-page | Não |
| `qa-engineer` | Acessibilidade, performance, SEO técnico | Não |

Papéis detalhados em `agents/*.md`.

## Pipeline

```
0. Brief          → 1. Revisão paralela → 2. Síntese/backlog → 3. Implementação
                                                                      ↓
                   5. Entrega      ← 4. Validação (gates)
```

1. **Brief (orquestrador).** Objetivo de negócio, público, oferta, restrições
   técnicas, ativos existentes e definição de sucesso. Sem brief não há
   delegação.
2. **Revisão paralela (especialistas, read-only).** Cada agente recebe a mesma
   base factual e um contrato de entrega próprio. Corre em paralelo porque não
   há dependências entre domínios. Nenhum agente edita ficheiros.
3. **Síntese (orquestrador).** Deduplicar achados, separar sintoma de causa,
   classificar P0/P1/P2, decidir o que *não* se faz e justificar. Só aqui nasce
   o backlog executável.
4. **Implementação (um único escritor).** Alterações pequenas e verificáveis,
   agrupadas por objetivo. Nunca dois agentes a escrever ao mesmo tempo no mesmo
   ficheiro.
5. **Validação.** QA aplica os gates; o orquestrador só entrega quando todos
   passam ou quando o desvio está documentado e aceite.
6. **Entrega.** Relatório de decisões, commit com mensagem descritiva, branch e
   (se pedido) PR.

## Contrato de handoff

Todo o achado entregue por um agente deve conter:

```md
[P0|P1|P2] Área — Observação
Evidência: ficheiro:linha ou medição reproduzível
Proposta: alteração concreta (texto pronto, token, valor CSS, markup)
Impacto: o que melhora e para quem
Risco/custo: o que pode partir, esforço, dependências
Critério de aceitação: como se prova que ficou resolvido
```

Regras:

- Sem evidência, é opinião — não entra no backlog.
- P0 = bloqueia compreensão, confiança ou acesso. P1 = perda mensurável de
  conversão/qualidade. P2 = polimento.
- Cada agente tem poder de veto no seu domínio: QA veta P0 de acessibilidade;
  copy veta alegações não comprováveis; UX veta fricção que impeça a ação
  principal; visual veta inconsistências que quebrem o sistema.

## Gates de qualidade

- **Acessibilidade:** 0 violações axe críticas/sérias; foco visível; navegação
  por teclado completa; contraste AA; alvos ≥ 44 px.
- **Responsivo:** sem overflow horizontal entre 320 e 1920 px; hierarquia
  legível a 390 px.
- **Robustez:** conteúdo essencial visível sem JavaScript; 0 erros de consola;
  `prefers-reduced-motion` respeitado.
- **Desempenho:** sem dependências externas de runtime; CSS/JS únicos; sem CLS
  provocado por fontes ou imagens.
- **Copy:** pt-PT consistente; sem números, avaliações ou prazos inventados;
  CTAs com verbos de ação e promessa verificável.
- **SEO técnico:** um H1, title ≤ 60 caracteres, meta description 140–160, JSON-LD
  válido, links externos com `rel="noopener noreferrer"`.

## Como executar um ciclo

1. `team_spawn_teammate` para cada papel, com o role prompt do ficheiro
   correspondente.
2. `team_task create` por frente, com escopo, ficheiros e formato de saída.
3. `team_run_task` em `async` para todas as frentes; `team_await_runs` para
   recolher.
4. `team_mission_log` com a decisão de priorização e os vetos aplicados.
5. Implementar, validar e entregar. Registar o ciclo em
   `docs/design-review-<data>.md`.

Um ciclo completo, com brief, handoffs, conflito resolvido, plano de
implementação e gates, está em `docs/exemplo-ciclo.md`.

## Artefactos

- `agents/*.md` — cartões de papel e prompts reutilizáveis.
- `docs/exemplo-ciclo.md` — ciclo de exemplo completo (brief → handoffs →
  síntese → plano → gates), não aplicado ao produto.
- `docs/design-review-*.md` — síntese de cada ciclo, backlog e decisões.
- Código e `README.md` na raiz — produto final.
