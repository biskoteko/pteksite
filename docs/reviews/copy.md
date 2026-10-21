# Auditoria de copy pt-PT, tom e SEO on-page — PTek

**Ficheiro auditado:** `index.html` (708 linhas), com apoio de `README.md` e `agents/copywriter.md`
**Âmbito:** título, subtítulo, promessa, CTAs, descrições de serviço, testemunhos, FAQ, metadados, Open Graph e JSON-LD
**Modo:** somente leitura (esta auditoria não altera o repositório)
**Registo de referência:** calmo, próximo, tratamento por «o seu», sem exclamações em série

**Totais:** 8 achados — **P0: 2** · **P1: 4** · **P2: 2**

| # | Pri. | Área | Risco dominante |
| --- | --- | --- | --- |
| A1 | P0 | Prova social | Alegações não comprováveis (avaliações, volume, taxa) |
| A2 | P0 | Prazo de resposta | SLA fixo («12 min») repetido em 3 pontos |
| A3 | P1 | H1 / eyebrow | Falta de intenção de busca no título principal |
| A4 | P1 | Title e meta description | Sem serviços e sem sinal geográfico; promessa não comprovável |
| A5 | P1 | Hero (lead) | Contradição com o FAQ sobre instalação |
| A6 | P1 | Processo e serviços | Promessas absolutas sobre pagamento, dados e segurança |
| A7 | P2 | CTAs | Oito verbos diferentes para a mesma ação |
| A8 | P2 | SEO local / JSON-LD | `areaServed` inválido e cobertura incoerente com o rodapé |

---

## 1) Diagnóstico

- **A promessa é clara, mas o H1 não tem intenção de busca.** A página explica bem o serviço e o benefício, contudo o H1 é uma frase de benefício genérica: não contém «assistência técnica online», «computador» nem qualquer sinal geográfico. Todo o peso do SEO on-page fica no `<title>`, e a pesquisa por serviço + localidade não encontra correspondência no elemento com mais peso da página.
- **A prova social numérica é o maior risco, legal e de confiança.** Hero, faixa de números, testemunhos e FAQ repetem valores não comprováveis (+1.200 atendimentos, 94%, 4,9/5 em 214 avaliações, 12 minutos de resposta). Em Portugal, alegações de avaliações e de volume de clientes sem suporte entram no regime das práticas comerciais desleais; mesmo sem litígio, são o primeiro ponto onde um visitante desconfia quando compara com o perfil do Google.
- **O tom é consistente e próximo, mas há promessas absolutas que o próprio FAQ desmente.** «Nada a instalar», «com os seus dados intactos», «garanta que nada se perde» e «paga no final, apenas se ficar satisfeito» criam expectativas que a operação não controla e abrem espaço a discussão no fecho. Em paralelo, os CTAs usam oito verbos diferentes para a mesma ação, o que dilui a hierarquia de conversão.

---

## 2) Achados priorizados

### A1 — [P0] Prova social — números e avaliações sem suporte verificável

**Problema.** A página apresenta quatro métricas de resultado e uma classificação média como se fossem factos apurados, sem fonte, período, plataforma ou número de avaliações identificável. Os mesmos valores aparecem em três zonas distintas, o que amplifica o risco em vez de o diluir: um visitante que desconfie de um badge encontra imediatamente a repetição na faixa de números e no texto dos testemunhos. Nenhum dos valores é acompanhado de data, de ligação à fonte ou de metodologia.

**Evidência.**
- `index.html:163-170` — badges do hero: `4,9/5 em 214 avaliações` e `12 min tempo médio de resposta`.
- `index.html:175-196` — faixa `.stats`: `+1.200 atendimentos remotos`, `94% resolvidos no mesmo dia`, `4,9/5 avaliação dos clientes`, `30 dias garantia`.
- `index.html:453` — lead dos testemunhos: «Mais de 1.200 atendimentos e uma avaliação média de 4,9 em 5.»
- `README.md` (secção «Antes de publicar») confirma que os números são dados de exemplo.

**Texto proposto.** Substituir as quatro métricas por diferenciais operacionais que a PTek cumpre em qualquer dia, e os badges por factos da oferta. Mantém-se a grelha de quatro colunas e o par `dt`/`dd`; os rótulos foram encurtados para não partir em mobile.

```html
<div class="floating-badge floating-badge--rating">
  <strong>0 deslocações</strong>
  <span>tudo por videochamada</span>
</div>
<div class="floating-badge floating-badge--time">
  <strong>30 dias</strong>
  <span>de garantia incluída</span>
</div>
```

```html
<dl class="stats-list">
  <div class="stat"><dt>Atendimento diário</dt><dd>8h–22h</dd></div>
  <div class="stat"><dt>Diagnóstico</dt><dd>Gratuito</dd></div>
  <div class="stat"><dt>Preço</dt><dd>Fechado</dd></div>
  <div class="stat"><dt>Garantia</dt><dd>30 dias</dd></div>
</dl>
```

Lead dos testemunhos (`index.html:453`):

```
Casos contados por clientes, com nomes abreviados a pedido.
```

**Condição de publicação dos testemunhos.** As três citações (`index.html:458-507`) só podem ficar com nome e localidade se existir autorização do cliente para publicar o texto. Sem autorização, manter o texto e trocar a identificação por `Cliente de Lisboa · Computador lento` (sem iniciais), ou remover a secção. Não reescrever citações para as tornar mais favoráveis: perdem o único valor que têm, que é soarem a pessoa real.

**Impacto.** Elimina a alegação de maior risco do site, troca-a por diferenciais que se verificam em cada atendimento e mantém a função da faixa (credibilidade imediata) sem depender de dados que o negócio ainda não tem. Efeito secundário positivo: `8h–22h` e `Fechado` respondem às duas objeções mais frequentes antes do primeiro scroll.

---

### A2 — [P0] Prazo de resposta — SLA de «12 minutos» repetido em três pontos

**Problema.** «12 minutos» é apresentado como tempo médio de resposta no badge do hero, na lista de diferenciais e no FAQ. É uma promessa operacional mensurável e falsificável: basta um dia atípico para se tornar incorreta. A formulação vizinha, «resposta em minutos», é mais segura mas vaga, e aparece no `<title>`/meta description, onde fica indexada e citada em resultados de pesquisa. «Estamos online» no CTA final e «Online agora» no mockup reforçam a expectativa de presença imediata a qualquer hora.

**Evidência.**
- `index.html:9` — meta description: «...e resposta em minutos pelo WhatsApp».
- `index.html:117` — ponto do hero: «Resposta em minutos».
- `index.html:167-170` — badge: `12 min` / «tempo médio de resposta».
- `index.html:404` — diferencial: «Em média respondemos em 12 minutos.»
- `index.html:567-569` — FAQ: «A maioria das mensagens é respondida em cerca de 12 minutos...»
- `index.html:586-589` — eyebrow do CTA final: «Estamos online».

**Texto proposto.**

- `index.html:117` (ponto do hero):
```
Atendimento todos os dias
```

- `index.html:404` (diferencial «Resposta em minutos»):
```
Atendimento das 8h às 22h, todos os dias. Os casos urgentes têm prioridade na fila.
```

- `index.html:167-170` — já coberto por A1; se se preferir manter um badge de tempo em vez de garantia:
```html
<div class="floating-badge floating-badge--time">
  <strong>8h–22h</strong>
  <span>atendimento todos os dias</span>
</div>
```

- `index.html:567-569` (resposta do FAQ):
```
Atendemos todos os dias, das 8h às 22h. Respondemos por ordem de chegada e os casos urgentes têm prioridade.
```

- `index.html:586-589` (eyebrow do CTA final):
```html
<p class="eyebrow eyebrow--light">
  <span class="status-dot" aria-hidden="true"></span>
  Atendimento das 8h às 22h
</p>
```

- `index.html:9` — ver A4 (a meta description proposta já remove «resposta em minutos»).

**Impacto.** Preserva a perceção de rapidez através do horário alargado e da prioridade a urgentes — ambos verificáveis — e retira a única promessa da página que um cliente pode cronometrar e contestar. O horário 8h–22h é, além disso, um argumento mais forte do que «minutos», porque responde à pergunta real («a esta hora, atendem-me?»).

---

### A3 — [P1] H1 — benefício certo, termo de pesquisa ausente

**Problema.** O H1 diz o que o cliente ganha («o seu equipamento a funcionar, sem sair de casa») mas não diz o que a PTek faz, para quem, nem onde. Quem pesquisa «assistência técnica online» ou «arranjar computador online» não encontra no elemento de maior peso semântico qualquer correspondência com a sua consulta. O eyebrow, que hoje repete a categoria, é o espaço natural para enumerar os serviços — informação útil para o visitante e para o crawler.

**Evidência.**
- `index.html:77-80` — eyebrow: «Assistência técnica online».
- `index.html:81-83` — H1: «O seu equipamento a funcionar, / sem sair de casa.»

**Texto proposto.** O H1 mantém o benefício e ganha a categoria; a enumeração de serviços desce para o eyebrow, onde cabe numa linha em desktop e em duas em mobile.

```html
<p class="eyebrow">
  <span class="status-dot" aria-hidden="true"></span>
  Computadores · Telemóveis · Redes
</p>
<h1 id="hero-title">
  Assistência técnica online
  <span class="highlight">sem sair de&nbsp;casa.</span>
</h1>
```

Nota de aplicação: o `&nbsp;` entre «de» e «casa» deve manter-se para o destaque não partir em duas linhas no mobile, tal como hoje em `index.html:83`.

**Impacto.** A expressão com maior intenção de busca passa a estar no H1, alinhada com o `<title>` (A4). A promessa não se perde — «sem sair de casa» continua em destaque visual — e o hero fica mais informativo para quem chega sem saber o que a PTek cobre.

---

### A4 — [P1] Metadados — title sem serviços, description com promessa instável

**Problema.** O `<title>` identifica a marca e o canal («pelo WhatsApp») mas não os serviços nem a geografia, que são os dois modificadores que o público acrescenta à pesquisa. A meta description repete a mesma estrutura e inclui «resposta em minutos» (ver A2), pelo que um excerto indexado pode conter uma promessa que a operação não garante. O Open Graph está tecnicamente correto: `og:locale`, `og:type` e ícone existem; falta apenas coerência de title.

**Evidência.**
- `index.html:6` — `<title>PTek — Assistência técnica online pelo WhatsApp</title>`.
- `index.html:7-10` — meta description.
- `index.html:17` — `og:title` (igual ao title).
- `index.html:18-21` — `og:description` (já boa; não mexer).

**Texto proposto.**

```html
<title>Assistência técnica online a computadores e Wi-Fi | PTek</title>
<meta
  name="description"
  content="Computadores lentos, vírus, Wi-Fi instável ou telemóveis: resolvemos por videochamada, em Portugal. Diagnóstico gratuito e preço fechado antes de começar."
/>
```

Open Graph (`index.html:17`):

```html
<meta property="og:title" content="Assistência técnica online a computadores e Wi-Fi | PTek" />
```

Se o domínio próprio for definido, acrescentar na mesma passagem `og:url`, `og:image` e `<link rel="canonical">` — o README já o prevê na secção «Antes de publicar».

**Impacto.** Title com 56 caracteres (cabe inteiro no resultado de pesquisa), com serviço + canal implícito na marca; description com serviços, geografia e oferta, sem alegações de tempo. Aumenta a taxa de clique para pesquisas de serviço e reduz a hipótese de o snippet citar uma promessa frágil.

---

### A5 — [P1] Hero — «nada a instalar» contradiz o FAQ na mesma página

**Problema.** O lead promete que não é preciso instalar nada; o FAQ, seis ecrãs abaixo, explica que, se for preciso acesso remoto, é enviado um link com instruções para abrir. A promessa é absoluta, a realidade é condicional, e a contradição é detetável por qualquer visitante que leia o FAQ — precisamente o visitante que está a decidir. O lead também não menciona o pagamento no final, que é o argumento de menor risco percebido e já está no passo 03.

**Evidência.**
- `index.html:85-89` — lead: «...e nada a instalar.»
- `index.html:572-578` — FAQ: «Não. Usamos a videochamada do WhatsApp... Se for preciso uma ferramenta de acesso remoto, enviamos o link e explicamos como abrir.»

**Texto proposto.**

```
Resolvemos problemas de computadores, telemóveis e redes por videochamada.
Diagnóstico gratuito, preço combinado antes de começar e pagamento no final.
```

**Impacto.** Alinha a promessa com o que a operação faz, substitui um absoluto por um benefício comercial concreto e reforça antecipadamente a resposta do FAQ sobre pagamento. Comprimento equivalente ao atual (duas linhas em mobile), pelo que o layout do hero não muda.

---

### A6 — [P1] Processo e serviços — promessas absolutas sobre pagamento, dados e segurança

**Problema.** Quatro formulações prometem um resultado absoluto em vez de descrever o trabalho: o pagamento fica dependente de «ficar satisfeito» (critério subjetivo, sem definição de satisfação nem de reembolso), a limpeza preserva «os seus dados intactos», o email «garante que nada se perde» e a remoção de vírus «protege os seus dados». São frases fortes em conversão e frágeis em execução: qualquer ficheiro apagado, qualquer infeção posterior ou qualquer cliente insatisfeito transforma a promessa em litígio. Nenhuma delas acrescenta informação sobre o que o cliente tem de fazer ou receber.

**Evidência.**
- `index.html:229-232` — passo 03: «Paga no final, apenas se ficar satisfeito, e fica com 30 dias de garantia.»
- `index.html:279-283` — «Vírus e segurança»: «Removemos ameaças e protegemos os seus dados.»
- `index.html:325-329` — «Telemóveis e tablets»: «...com os seus dados intactos.»
- `index.html:347-351` — «Email, contas e backups»: «...garanta que nada se perde.»

**Texto proposto.**

Passo 03 (`index.html:229-232`):

```
Resolvemos na hora sempre que possível. Paga no final, com 30 dias de garantia incluída.
```

Serviço «Vírus e segurança» (`index.html:280-283`):

```
Avisos estranhos, janelas a abrir sozinhas ou contas invadidas.
Removemos software malicioso e reforçamos as proteções do equipamento.
```

Serviço «Telemóveis e tablets» (`index.html:326-329`):

```
Pouco espaço, bateria a desaparecer, aplicações que não abrem.
Configuramos e limpamos o equipamento, mantendo os seus ficheiros no lugar.
```

Serviço «Email, contas e backups» (`index.html:348-351`):

```
Recupere o acesso ao email, organize ficheiros e deixe uma cópia de segurança a funcionar.
```

**Impacto.** Mantém o tom tranquilizador e a extensão de cada cartão (duas linhas), mas troca garantias de resultado por descrições de processo — o que a PTek controla. A condição comercial passa a ser objetiva: pagamento no final, 30 dias de garantia. Reduz discussão no fecho e alinha os cartões com a resposta do FAQ sobre privacidade (`index.html:548-555`), que já usa a formulação correta («acedemos ao que for necessário»).

---

### A7 — [P2] CTAs — oito verbos diferentes para a mesma ação

**Problema.** Todos os CTAs abrem a mesma conversa de WhatsApp, mas cada um usa um verbo e um modo distintos: «Falar», «Conversar», «Perguntar», «Contar», «Fale», «Tirar», «Ver», «Falar sobre isto». A variação não acrescenta informação — o destino é o mesmo — e dilui o reconhecimento do botão principal ao longo do scroll. Há ainda mistura de infinitivo («Falar») com imperativo formal («Fale connosco») no mesmo ecrã, quando o tratamento da página é formal e consistente.

**Evidência.**
- `index.html:67` e `102` — «Falar no WhatsApp».
- `index.html:268, 290, 314, 336, 358` — «Falar sobre isto →».
- `index.html:374` — «Contar o meu caso».
- `index.html:390` — «Tirar dúvidas frequentes».
- `index.html:527` — «Perguntar no WhatsApp».
- `index.html:607` — «Conversar no WhatsApp».
- `index.html:685` — «Fale connosco» (flutuante).

**Texto proposto.** Uma ação, um rótulo; mantém-se um único CTA diferenciado, no cartão final, porque aí o verbo descreve mesmo outra coisa.

```
Header (67), hero (102), FAQ (527), CTA final (607), flutuante (685):  Falar no WhatsApp
Cards de serviço (268, 290, 314, 336, 358):                            Falar sobre este serviço →
Bloco «Porque a PTek» (390):                                           Ver perguntas frequentes
Cartão «Não encontra o seu caso?» (374):                               Contar o meu caso  [manter]
```

Nas mensagens pré-preenchidas das URLs `wa.me` não é preciso alterar nada: cada `text=` continua contextual ao serviço, o que é o principal ganho de atrito já implementado.

**Impacto.** Consistência de rótulo e de modo verbal, hierarquia de conversão mais legível e menos carga cognitiva. O ganho é sobretudo de perceção de qualidade: oito sinónimos para o mesmo botão leem-se como falta de cuidado.

---

### A8 — [P2] SEO local — `areaServed` inválido e cobertura incoerente com o rodapé

**Problema.** O JSON-LD usa `"areaServed": "PT"`, que não corresponde a um tipo Schema.org válido (espera `Country`, `AdministrativeArea` ou `GeoShape`) e, por isso, é ignorado pelos consumidores. O mesmo bloco não declara `url`, `serviceType` nem idioma, apesar de ser um serviço remoto em que a cobertura geográfica é o principal qualificador. Em paralelo, o rodapé limita o atendimento a «todo o Portugal continental», enquanto os dados estruturados apontam para o país inteiro — e não há qualquer referência a localidade na página, o que enfraquece a intenção local.

**Evidência.**
- `index.html:689-705` — bloco `ProfessionalService` (sem `url`, `serviceType`, `availableLanguage`; `areaServed: "PT"`).
- `index.html:660` — rodapé: «Todo o Portugal continental».
- `index.html:6-21` — ausência de localidade em title/description.
- `index.html:694` — `description` já correta quanto ao serviço; manter.

**Texto proposto.** Substituir o bloco inteiro, mantendo a estrutura e o horário já existentes:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "PTek",
    "url": "https://EXEMPLO.pt/",
    "description": "Assistência técnica online para computadores, telemóveis e redes, por videochamada, em Portugal.",
    "telephone": "+351928124737",
    "serviceType": [
      "Assistência técnica remota",
      "Manutenção de computadores",
      "Configuração de redes"
    ],
    "areaServed": { "@type": "Country", "name": "Portugal" },
    "availableLanguage": "pt-PT",
    "priceRange": "€€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  }
</script>
```

Rodapé (`index.html:660`):

```
Atendimento em todo o país, por videochamada
```

**Impacto.** Dados estruturados válidos, com cobertura explícita e coerente com a oferta remota; o `url` cria a ligação que falta entre entidade e site. A alteração do rodapé resolve a divergência continental/país sem prometer deslocações. **Antes de publicar:** substituir `https://EXEMPLO.pt/` pelo domínio real e confirmar que o número em `telephone` é o mesmo das URLs `wa.me`.

---

## 3) Top 3 mudanças para já

1. **Retirar todos os números não comprovados** (badges do hero, faixa de stats, lead dos testemunhos, «12 min» nos três pontos onde aparece). É o risco legal mais direto e o principal travão de confiança: um número que o visitante não consegue confirmar desvaloriza tudo o resto, incluindo o que a página faz bem. A substituição por horário, diagnóstico gratuito, preço fechado e garantia mantém a faixa útil e cumpre-se todos os dias.
2. **H1 + title + meta description** com «assistência técnica online» e «computadores», mantendo «sem sair de casa» como benefício. São três alterações de poucas linhas, sem impacto no layout fora do hero, e cobrem a intenção de busca que hoje não está representada no elemento com mais peso.
3. **Corrigir «nada a instalar» e «apenas se ficar satisfeito»** — as duas frases que criam expectativas que a operação não controla. A primeira é desmentida pelo próprio FAQ; a segunda transfere para o momento do pagamento uma discussão sobre um critério subjetivo.

---

## 4) O que não devo mexer

- **Estrutura e ritmo do hero:** lead, três pontos de prova, mockup de conversa e dupla de botões. O mockup é decorativo (`aria-hidden`) e funciona como demonstração do serviço — é o elemento mais específico da página.
- **«Três passos, zero complicações»** e os passos 01 e 02: linguagem concreta, sem jargão, com o preço combinado antes de tocar no equipamento. Só o passo 03 precisa de ajuste (A6).
- **FAQ 1, 3 e 4** — «Como é que me ajudam à distância?», «Os meus ficheiros e dados ficam seguros?» e «Que equipamentos conseguem ajudar?». Respondem a objeções reais, com limites explícitos (avarias físicas encaminhadas), e a resposta sobre privacidade é o melhor parágrafo da página.
- **«Não encontra o seu caso?»** e **«Vamos resolver isso hoje?»** com o fecho «Sem compromisso, sem letras pequenas»: fecho forte, sem exclamações, com o telefone como alternativa ao WhatsApp.
- **Tratamento por «o seu»** — consistente em toda a página, incluindo «consigo» e «connosco». Não introduzir «tu» nem misturar registos ao aplicar as alterações.
- **`og:description` (linha 20), horário 8h–22h e garantia de 30 dias** — desde que a garantia seja real, documentada e com condições definidas. A `og:description` atual já cumpre o que A4 pede.
- **Ordem das secções e âncoras** (`#servicos`, `#como-funciona`, `#testemunhos`, `#perguntas`): a navegação e o README dependem delas; nenhuma alteração de copy justifica mexer aqui.

---

## Notas de aplicação

- **Ordem sugerida:** A1 → A2 → A4 → A3 → A5 → A6 → A7 → A8. As três primeiras eliminam risco; as restantes melhoram clareza e consistência.
- **Comprimentos:** os textos propostos mantêm a extensão dos originais (lead com duas linhas em mobile, cartões com duas linhas, H1 em duas linhas com `&nbsp;` antes de «casa»). Não há necessidade de ajustar CSS.
- **Dependências externas:** A8 exige o domínio real; A1 exige decisão sobre os testemunhos (autorização ou remoção). Nenhuma outra alteração depende de terceiros.
- **Verificação após aplicar:** validar o JSON-LD, confirmar que cada `text=` das URLs `wa.me` continua a corresponder ao serviço do respetivo botão e rever a página a 360 px para garantir que `8h–22h` e `Fechado` não quebram a grelha de estatísticas.
- **Fora do âmbito desta auditoria:** preços concretos, condições da garantia, política de privacidade e tratamento de dados de clientes. A copy atual não os menciona; se a PTek os definir, o FAQ é o local indicado para os acrescentar.

