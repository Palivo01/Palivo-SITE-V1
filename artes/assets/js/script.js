const CONFIG={whatsapp:"5571996754698",instagram:"https://www.instagram.com/palivotattoo/",ga4:"G-PWEH5VKX5H"};
const categoryOrder=[["fine-art","Fine Art"],["fine-line","Fine Line"],["cristao","Cristão"],["realismo","Realismo"],["escrita","Escrita"]];
let tattoos=[];
let cart=[];

function track(name,params={}){if(typeof window.gtag==="function")window.gtag("event",name,params)}
function escapeHTML(value=""){return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c])}
function money(value){return Number(value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function imageURL(path){if(!path)return"";if(/^https?:\/\//i.test(path))return path;return`${window.PALIVO_SUPABASE.url}/storage/v1/object/public/tattoos/${path}`}
function normalizedTattoo(row){return{uuid:row.id,id:row.codigo,categoria:row.categoria,categoriaNome:row.categoria_nome,imagem:imageURL(row.imagem_path),status:row.status,precoDe:money(row.preco_de),precoPor:money(row.preco_por)}}

function cardHTML(t){
  const unavailable=t.status!=="disponivel";
  const added=cart.some(item=>item.id===t.id);
  const statusLabel=t.status==="em_negociacao"?"Em negociação":unavailable?"Indisponível":"Disponível";
  return `<article class="tattoo-card ${unavailable?"is-unavailable":""}" data-id="${escapeHTML(t.id)}">
    <button type="button" class="tattoo-art preview-art" data-id="${escapeHTML(t.id)}" aria-label="Ampliar arte ${escapeHTML(t.id)}"><img loading="lazy" width="700" height="900" src="${escapeHTML(t.imagem)}" alt="Tatuagem ${escapeHTML(t.id)}"><span class="zoom-hint">Ampliar</span></button>
    <div class="tattoo-info"><div class="tattoo-top"><span class="tattoo-id">${escapeHTML(t.id)}</span><span class="status ${escapeHTML(t.status)}">${statusLabel}</span></div>
    <small>${escapeHTML(t.categoriaNome)}</small><div class="price-block"><span class="price-from">DE: <strong>${escapeHTML(t.precoDe)}</strong></span><span class="price-to">POR: <strong>${escapeHTML(t.precoPor)}</strong></span></div>
    <button type="button" class="btn ${added?"btn-ghost":unavailable?"btn-ghost":"btn-primary"} choose-tattoo" ${unavailable||added?"disabled":""} data-id="${escapeHTML(t.id)}">${added?"Adicionada ao pedido ✓":unavailable?statusLabel:"Adicionar ao pedido"}</button></div></article>`;
}

function renderCatalog(){
  categoryOrder.forEach(([slug])=>{const el=document.querySelector(`[data-carousel="${slug}"]`);if(!el)return;const items=tattoos.filter(t=>t.categoria===slug);el.innerHTML=items.length?items.map(cardHTML).join(""):'<div class="catalog-empty">Nenhuma arte cadastrada nesta categoria.</div>'});
  document.querySelectorAll(".choose-tattoo:not([disabled])").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();addToCart(btn.dataset.id)}));
  document.querySelectorAll(".preview-art").forEach(btn=>btn.addEventListener("click",()=>openLightbox(btn.dataset.id)));
}

let catalogLoading=false;
function catalogState(kind){
  const status=document.querySelector("#catalogStatus"),ready=kind==="ready";
  status.hidden=ready;status.classList.toggle("is-error",kind==="error");
  document.querySelectorAll("[data-catalog-content]").forEach(el=>el.hidden=!ready);
  document.querySelector("#catalogStatusTitle").textContent=kind==="error"?"Artes promocionais indisponíveis no momento.":"Carregando as artes…";
  document.querySelector("#catalogStatusText").textContent=kind==="error"?"Não foi possível consultar as artes agora. Tente novamente mais tarde ou fale comigo pelo WhatsApp.":"Estamos consultando a disponibilidade das tatuagens.";
  document.querySelector("#catalogStatusActions").hidden=kind!=="error";
  document.querySelector("#catalogEntry").href=ready?"#catalogo":"#catalogStatus";
}
async function catalogRows(){
  const cfg=window.PALIVO_SUPABASE;
  if(!cfg||!/^https:\/\//.test(cfg.url)||!cfg.publishableKey)throw new Error("Configuração indisponível.");
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000),rows=[];
  try{
    let offset=0;
    for(;;){
      const url=new URL("/rest/v1/tattoos",cfg.url);
      url.search=new URLSearchParams({select:"*",order:"ordem.asc,criado_em.desc,id.asc",limit:"500",offset:String(offset)});
      const response=await fetch(url,{headers:{apikey:cfg.publishableKey,Accept:"application/json",Prefer:"count=exact"},signal:controller.signal,cache:"no-store"});
      if(!response.ok)throw new Error("Catálogo temporariamente indisponível.");
      const page=await response.json();if(!Array.isArray(page))throw new Error("Resposta inválida do catálogo.");
      rows.push(...page);offset+=page.length;
      const count=response.headers.get("Content-Range")?.split("/")[1],total=count&&count!=="*"?Number(count):null;
      if(!page.length||(total!==null&&Number.isFinite(total)?offset>=total:page.length<500))break;
    }
    return rows;
  }finally{clearTimeout(timer)}
}
async function loadCatalog(){
  if(catalogLoading)return;catalogLoading=true;catalogState("loading");
  try{
    const rows=await catalogRows();tattoos=rows.map(normalizedTattoo);
    cart=cart.map(item=>tattoos.find(t=>t.uuid===item.uuid&&t.status==="disponivel")).filter(Boolean);
    updateCart();renderCatalog();catalogState("ready");
  }catch(error){
    tattoos=[];cart=[];closeLightbox();updateCart();catalogState("error");console.warn("Catálogo temporariamente indisponível.");
  }finally{catalogLoading=false}
}

function addToCart(id){
  const item=tattoos.find(t=>t.id===id&&t.status==="disponivel");
  if(!item||cart.some(t=>t.id===id))return;
  cart.push(item);updateCart();renderCatalog();
  track("select_tattoo",{tattoo_id:item.id,tattoo_style:item.categoria,cart_size:cart.length});
  document.querySelector("#reserva").scrollIntoView({behavior:"smooth",block:"start"});
}
function removeFromCart(id){cart=cart.filter(item=>item.id!==id);updateCart();renderCatalog()}
function updateCart(){
  const box=document.querySelector("#selectedPreview"),submit=document.querySelector("#submitWhatsapp");
  document.querySelector("#tattooId").value=cart.map(item=>item.id).join(",");
  if(!cart.length){box.classList.remove("show");box.innerHTML="";submit.disabled=true;submit.setAttribute("aria-disabled","true");return}
  box.innerHTML=`<div class="cart-title"><strong>Seu pedido</strong><span>${cart.length} ${cart.length===1?"arte selecionada":"artes selecionadas"}</span></div><div class="cart-items">${cart.map(item=>`<article class="cart-item"><img src="${escapeHTML(item.imagem)}" alt=""><div><strong>${escapeHTML(item.id)}</strong><span>${escapeHTML(item.categoriaNome)}</span><small>${escapeHTML(item.precoPor)}</small></div><button type="button" class="remove-item" data-id="${escapeHTML(item.id)}" aria-label="Remover ${escapeHTML(item.id)}">Remover</button></article>`).join("")}</div>`;
  box.classList.add("show");submit.disabled=false;submit.removeAttribute("aria-disabled");
  box.querySelectorAll(".remove-item").forEach(btn=>btn.addEventListener("click",()=>removeFromCart(btn.dataset.id)));
}

function openLightbox(id){const item=tattoos.find(t=>t.id===id);if(!item)return;const modal=document.querySelector("#artLightbox");document.querySelector("#lightboxImage").src=item.imagem;modal.hidden=false;modal.setAttribute("aria-hidden","false");document.body.classList.add("lightbox-open");document.querySelector("#closeLightbox").focus()}
function closeLightbox(){const modal=document.querySelector("#artLightbox");modal.hidden=true;modal.setAttribute("aria-hidden","true");document.querySelector("#lightboxImage").src="";document.body.classList.remove("lightbox-open")}
function setupLightbox(){const modal=document.querySelector("#artLightbox");document.querySelector("#closeLightbox").addEventListener("click",closeLightbox);modal.addEventListener("click",e=>{if(e.target===modal)closeLightbox()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeLightbox()})}

function setupCarousels(){document.querySelectorAll(".carousel").forEach(carousel=>{let down=false,startX=0,startScroll=0;carousel.addEventListener("pointerdown",e=>{if(e.target.closest("button,a,input,select,textarea"))return;down=true;startX=e.clientX;startScroll=carousel.scrollLeft;carousel.classList.add("dragging");carousel.setPointerCapture?.(e.pointerId)});carousel.addEventListener("pointermove",e=>{if(down)carousel.scrollLeft=startScroll-(e.clientX-startX)});["pointerup","pointercancel","pointerleave"].forEach(ev=>carousel.addEventListener(ev,()=>{down=false;carousel.classList.remove("dragging")}))});document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>{const carousel=document.querySelector(`[data-carousel="${btn.dataset.scroll}"]`);carousel?.scrollBy({left:(btn.dataset.dir==="next"?1:-1)*Math.min(420,carousel.clientWidth*.8),behavior:"smooth"})}))}
function setupSectionSelector(){const select=document.querySelector("#sectionSelect");select?.addEventListener("change",()=>{let target=document.querySelector(select.value);if(target?.hidden)target=document.querySelector("#catalogStatus");target?.scrollIntoView({behavior:"smooth",block:"start"})})}
function setupForm(){
  const form=document.querySelector("#leadForm"),msg=document.querySelector("#formMessage"),submit=document.querySelector("#submitWhatsapp");submit.disabled=true;submit.setAttribute("aria-disabled","true");
  form.addEventListener("submit",e=>{e.preventDefault();msg.classList.remove("show");if(!cart.length){msg.textContent="Adicione pelo menos uma tatuagem ao pedido.";msg.classList.add("show");return}const data=new FormData(form),nome=(data.get("nome")||"").trim(),telefone=(data.get("telefone")||"").trim();if(!nome||!telefone){msg.textContent="Preencha seu nome e WhatsApp.";msg.classList.add("show");return}const obs=(data.get("observacao")||"").trim();const arts=cart.map((item,index)=>`${index+1}. *${item.id}* — ${item.categoriaNome}\n   DE: ${item.precoDe} · POR: ${item.precoPor}`).join("\n\n");const text=`Olá! Vim pelo catálogo de artes promocionais do Palivo Tattoo Studio e montei este pedido:\n\n${arts}\n\n*Quantidade de artes:* ${cart.length}\n*Nome:* ${nome}\n*Meu WhatsApp:* ${telefone}\n*Atendimento:* Jacobina${obs?`\n*Observação:* ${obs}`:""}\n\nQuero confirmar os valores, a disponibilidade e os próximos passos.`;track("lead_whatsapp",{event_category:"tattoo_offer",tattoo_ids:cart.map(item=>item.id).join(","),cart_size:cart.length,atendimento:"jacobina"});window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,"_blank","noopener")});
}
function setupReveal(){if(!("IntersectionObserver"in window)){document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}
document.addEventListener("DOMContentLoaded",()=>{
  setupCarousels();setupSectionSelector();setupForm();setupReveal();setupLightbox();
  document.querySelector("#retryCatalog").addEventListener("click",loadCatalog);
  loadCatalog();
});
