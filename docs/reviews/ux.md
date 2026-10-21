# Auditoria UX e conversão — PTek

**Âmbito:** `index.html`, `styles.css`, `script.js`, `README.md` (leitura estática e medição por CSS; sem edições ao produto).
**Papel:** UX Strategist — arquitetura de informação, hierarquia de conversão e jornada mobile-first.
**Data:** 21 de outubro de 2026.

## 1) Diagnóstico (3 bullets)

- **A página está tecnicamente acima da média, mas a promessa é genérica.** O H1 (“O seu equipamento a funcionar”) não diz o que se resolve nem para quem; quem chega com o PC lento ou com um vírus tem de deduzir nos parágrafos seguintes. O problema central não é falta de CTAs — há **12 entradas WhatsApp com 9 mensagens pré-preenchidas distintas** — é falta de reconhecimento imediato e de confiança verificável.
- **A fricção real é confiança, não cliques.** Uma pessoa com o computador avariado decide em três perguntas: “quanto custa?”, “é seguro dar acesso?” e “ainda está aberto?”. Preço e segurança só aparecem na FAQ, abaixo de cinco módulos; o estado “online” é sempre verde, mesmo às 3h.
- **No mobile o atalho permanente existe, mas é mudo.** Círculo de 52×52 px, sem rótulo visível (o texto só surge em `hover`), sem safe-area, a competir com o CTA final e a tapar conteúdo. O primeiro ecrã é 100% texto; o único cartão visual e a prova social chegam depois do primeiro ecrã.

## 2) Achados priorizados

**[P0] Hero / promessa —** O H1 e o lead descrevem categoria, não sintoma; “equipamento” é vago e não qualifica o visitante. **Evidência:** `index.html:81-89`. **Proposta:** H1 orientado ao problema, ex.: “Computador lento, com vírus ou sem internet? Resolvemos hoje, por videochamada.”; manter “sem sair de casa” como sublinhado. **Impacto:** reconhecimento em 5 s, menos saídas antes do CTA.

**[P0] Primeiro paint / hero invisível —** `.hero-copy` e `.hero-visual` têm `data-reveal`; o CSS esconde (`opacity:0`) e só o JS com `defer` revela com transição de 600 ms. Num 4G lento, o primeiro ecrã nasce em branco. **Evidência:** `index.html:76,128`; `styles.css:1337-1341`; `script.js:87-100`. **Proposta:** remover `data-reveal` do hero e reservar a animação para conteúdo abaixo da dobra. **Impacto:** LCP e primeira impressão imediatos.

**[P0] Prova social —** “4,9/5 em 214 avaliações”, “+1.200 atendimentos” e “94%” não têm fonte, data nem ligação a Google/Trustpilot; 214 avaliações convivem com 3 testemunhos de iniciais. O próprio README assume que são exemplos. **Evidência:** `index.html:163-170,175-194`; `README.md:57-59,80`. **Proposta:** ou ligar a uma fonte externa verificável (com link e data) ou retirar os números e manter apenas garantia/horário. **Impacto:** credibilidade; números redondos sem prova geram desconfiança activa.

**[P1] Objeção “quanto custa” —** O preço só é explicado na segunda pergunta da FAQ, depois de serviços, diferenciais e testemunhos; o hero diz “preço combinado” sem âncora. **Evidência:** `index.html:541-547` (FAQ) vs. CTA em `91-104`. **Proposta:** bloco de 3 linhas imediatamente antes de `#servicos`: “Diagnóstico 0 € · valor fixo aprovado antes de mexer · pagamento no fim (MB Way/transferência)”, com intervalo de preços real a confirmar pelo negócio. **Impacto:** elimina a principal razão de abandono no primeiro clique.

**[P1] Estado “online” sempre activo —** Três indicadores verdes (“Assistência técnica online”, “Online agora”, “Estamos online”) independentes do horário 8h–22h anunciado. **Evidência:** `index.html:77-80,134,586-589`; `styles.css:400-407`. **Proposta:** calcular estado em `Europe/Lisbon` no `script.js`: “Online agora · resposta ~12 min” vs. “Fora de horário · respondemos às 8h”, mantendo o link WhatsApp. **Impacto:** honestidade e urgência credível.

**[P1] CTA flutuante no mobile —** Ícone sem rótulo (`.float-label` só em `hover:hover`), 52 px em vez de 56, sem `env(safe-area-inset-bottom)`, fixo sobre o fim do rodapé e sobre o CTA final. **Evidência:** `index.html:671-687`; `styles.css:1327-1333,1499-1509`. **Proposta:** barra inferior a 100% (altura 56 px + safe-area) com “Falar no WhatsApp · resposta ~12 min”; esconder quando `#cta-title` estiver visível. **Impacto:** CTA legível, deixa de tapar FAQ/rodapé.

**[P1] Contradição “nada a instalar” —** O hero promete “nada a instalar”; a FAQ admite enviar link de acesso remoto para instalar. Além disso, telefone só existe no CTA final e rodapé. **Evidência:** `index.html:88` vs. `573-577`; telefone em `609-611,658`. **Proposta:** reformular para “Nada a instalar para falar consigo; se for preciso acesso, enviamos o link e explicamos” e acrescentar “Prefere telefone? 928 124 737” sob o CTA do hero. **Impacto:** remove uma quebra de confiança no momento da decisão e cobre quem não tem WhatsApp no PC.

**[P2] Mockup de chat no mobile —** Cartão decorativo (`aria-hidden`) com 4 mensagens + indicador de escrita ocupa ~1 ecrã e empurra estatísticas; os dois selos flutuantes (incluindo a avaliação) desaparecem a ≤560 px. **Evidência:** `index.html:129-170`; `styles.css:515-525,1478-1488`. **Proposta:** a ≤560 px cortar para 2 mensagens e subir `.stats` para antes de `.hero-visual` via `order`. **Impacto:** prova social ~1 ecrã mais cedo.

## 3) Top 3 mudanças para já

1. **Reescrever o H1 para o sintoma** e acrescentar, sob o CTA do hero, a linha de preço + telefone (P0/P1 acima). É a alteração de maior efeito por menor esforço.
2. **Tirar o `data-reveal` do hero** e tornar o estado online real por horário. Duas correcções pequenas que recuperam o primeiro ecrã e a credibilidade.
3. **Substituir o círculo flutuante por barra inferior rotulada** com safe-area e ocultação no CTA final. Resolve o único ponto em que o mobile está pior que o desktop.

## 4) O que não devo mexer

- **Mensagens pré-preenchidas por serviço** (`index.html:264,286,310,332,354,370,523,598`): são o melhor mecanismo de conversão da página; mantê-las e apenas alinhar o rótulo.
- **FAQ nativo em `<details>`** (`index.html:532-579`): acessível, sem JS, indexável. Só tirar o `open` do primeiro item, que empurra a lista.
- **Sistema de CTA e cabeçalho** (`styles.css:197-220`): header sticky de 72 px, `scroll-padding-top` de 88 px e menu mobile com `Esc`/clique-fora estão correctos.
- **Paleta, tipografia de sistema e ausência de imagens bitmap**: identidade já consistente e rápida; mexer aqui não melhora conversão.
- **Repetições actuais** — “diagnóstico gratuito” 9×, “30 dias” 6×, “12 min” 3×: não acrescentar mais; a saturação já é visível e novas menções diluem.


