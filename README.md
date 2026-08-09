# Palivo Tattoo V3

Versão multipágina estática, mobile-first, pronta para GitHub + Cloudflare Pages.

## Páginas
- `/` Home
- `/projeto/` triagem → WhatsApp
- `/projetos/` projetos autorais/promocionais (em breve)
- `/cuidados/` resumo do protocolo pós-tattoo

## Mídias
- 19 fotos reais do portfólio convertidas para WebP
- foto institucional e foto de trabalho
- 3 vídeos otimizados e sem áudio para background
- logo em WebP

## Funcionalidades
- portfólio horizontal com scroll-snap
- desktop: hover recupera cor
- mobile: card central recupera cor automaticamente
- fade lateral na galeria
- formulário em 4 etapas com celular/WhatsApp
- Zoho Forms para anamnese
- localizações de Jacobina, Ourolândia e Umburanas
- GA4 G-HSJXMCBCYZ
- SEO básico, robots e sitemap

## Antes de trocar o domínio
Teste primeiro no pages.dev, especialmente vídeo, formulário, links de Maps e visual em iPhone/Android.


## Correção V3.1
Todos os caminhos de CSS, JS, imagens, vídeos e páginas internas foram convertidos para caminhos relativos, permitindo abrir `index.html` diretamente no computador e também publicar no Cloudflare Pages.


## V3.2
- Adicionado "Início" ao menu.
- Adicionado "Localização" ao menu, apontando para a seção das três cidades.
- Logo do topo substituída pela nova versão enviada e ampliada.
- Instagram e WhatsApp agora usam ícones das marcas.
- Região do corpo também passou a ser obrigatória; todos os campos do formulário são validados antes do WhatsApp.
- Item de remoção de seção pendente: o print correspondente não chegou junto à solicitação.


## V3.3
- Ícones de Instagram e WhatsApp migrados para Font Awesome Brands.
- Botão flutuante do WhatsApp não abre mais conversa diretamente: leva ao formulário.
- WhatsApp do rodapé também leva ao formulário.
- CTAs de contato/orçamento passam obrigatoriamente pela página `projeto/`.
- O WhatsApp só é aberto após a validação e envio do formulário.


## V3.4
- Dourado mais presente e brilhante, mantendo visual premium.
- Botões principais receberam gradiente metálico e brilho em hover.
- Bordas, campos ativos, progresso, menu, cards e portfólio ganharam detalhes dourados sutis.
- Efeito aplicado com moderação para preservar o fundo escuro e a identidade sofisticada.


## V3.5 — correção crítica
- Corrigido erro de sintaxe em `script.js` que impedia animações e fazia textos/legendas permanecerem invisíveis.
- Sistema de animação agora é fail-safe: textos ficam visíveis por padrão, mesmo se JavaScript falhar.
- Mantidos dourado premium, Font Awesome Brands e funil CTA → formulário → WhatsApp.
- Conferidas as 19 legendas do portfólio.


## V3.6
- Removida da Home a seção "Experiência — Do projeto à pele".
- Removido junto o card "Processo criativo — História vira composição".
- Restante da V3.5 preservado.
