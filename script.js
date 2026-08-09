const WA='5571996754698';
const ANAMNESE='https://forms.zohopublic.com/Roteirizze/form/Anamnese/formperma/wH5jOCuFPOMempETkKO8yI7azF52WTNBIakCX9_cHEc';

document.querySelectorAll('[data-anamnese]').forEach(a=>{a.href=ANAMNESE;a.target='_blank';a.rel='noopener'});
const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.menu');toggle?.addEventListener('click',()=>menu.classList.toggle('open'));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const fadeEls=[...document.querySelectorAll('.fade-up')];
fadeEls.forEach(el=>el.classList.add('reveal-ready'));
const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
fadeEls.forEach(el=>reveal.observe(el));

const scroller=document.querySelector('.portfolio-scroller');
if(scroller){
  let down=false,startX=0,startScroll=0;
  scroller.addEventListener('mousedown',e=>{down=true;startX=e.pageX;startScroll=scroller.scrollLeft});
  window.addEventListener('mouseup',()=>down=false);
  scroller.addEventListener('mouseleave',()=>down=false);
  scroller.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();scroller.scrollLeft=startScroll-(e.pageX-startX)*1.2});
  const cards=[...scroller.querySelectorAll('.portfolio-card')],bar=document.querySelector('.drag-line i');
  const setActive=()=>{
    const center=scroller.getBoundingClientRect().left+scroller.clientWidth/2;
    let best=null,dist=Infinity;
    cards.forEach(c=>{const r=c.getBoundingClientRect(),d=Math.abs((r.left+r.width/2)-center);if(d<dist){dist=d;best=c}});
    cards.forEach(c=>c.classList.toggle('is-active',c===best));
    const max=scroller.scrollWidth-scroller.clientWidth;const pct=max?scroller.scrollLeft/max:0;if(bar)bar.style.transform=`translateX(${pct*455}%)`;
  };
  scroller.addEventListener('scroll',()=>requestAnimationFrame(setActive),{passive:true});setActive();
}

const form=document.querySelector('#projectForm');
if(form){
 const steps=[...form.querySelectorAll('.step')],progress=form.querySelector('.progress i');let current=0;const areas=[];const promo=new URLSearchParams(location.search).get('promo')||'';
 const show=n=>{steps.forEach((s,i)=>s.classList.toggle('active',i===n));progress.style.width=`${((n+1)/steps.length)*100}%`;window.scrollTo({top:Math.max(0,form.offsetTop-92),behavior:'smooth'})};
 const value=n=>form.elements[n]?.value?.trim()||'';
 form.querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>{
   const req=[...steps[current].querySelectorAll('[required]')];
   const miss=req.find(x=>!x.value.trim());
   if(miss){
     if(miss.name==='areas'){
       const choices=steps[current].querySelector('.choices');
       choices?.classList.add('required-alert');
       setTimeout(()=>choices?.classList.remove('required-alert'),900);
       choices?.scrollIntoView({behavior:'smooth',block:'center'});
     }else{miss.focus()}
     return
   }
   current++;
   if(current===steps.length-1)review();
   show(current)
 });
 form.querySelectorAll('[data-prev]').forEach(b=>b.onclick=()=>{current=Math.max(0,current-1);show(current)});
 form.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const a=b.dataset.area;b.classList.toggle('active');const i=areas.indexOf(a);i>=0?areas.splice(i,1):areas.push(a);form.elements.areas.value=areas.join(', ')});
 function review(){document.querySelector('#review').innerHTML=`${promo?`<p><strong>Projeto:</strong> ${promo}</p>`:''}<p><strong>Nome:</strong> ${value('nome')}</p><p><strong>Celular:</strong> ${value('celular')}</p><p><strong>Cidade:</strong> ${value('cidade')}</p><p><strong>Tamanho:</strong> ${value('tamanho')}</p><p><strong>Estilo:</strong> ${value('estilo')}</p><p><strong>Região:</strong> ${value('areas')||'Não informada'}</p><p><strong>Ideia:</strong> ${value('ideia')}</p>`}
 form.addEventListener('submit',e=>{e.preventDefault();
 const allRequired=[...form.querySelectorAll('[required]')];
 const missing=allRequired.find(x=>!x.value.trim());
 if(missing){
   if(missing.name==='areas'){current=1;show(current);const choices=form.querySelector('.choices');choices?.classList.add('required-alert');setTimeout(()=>choices?.classList.remove('required-alert'),900)}
   else {const stepIndex=steps.findIndex(s=>s.contains(missing));if(stepIndex>=0){current=stepIndex;show(current);setTimeout(()=>missing.focus(),350)}}
   return
 }
 const msg=`Olá, Palivo! Quero solicitar um orçamento pelo site.\n\n${promo?`*Projeto:* ${promo}\n`:''}*Nome:* ${value('nome')}\n*Celular:* ${value('celular')}\n*Cidade:* ${value('cidade')}\n*Tamanho aproximado:* ${value('tamanho')}\n*Estilo:* ${value('estilo')}\n*Região do corpo:* ${value('areas')||'Não informada'}\n*Ideia / referência:* ${value('ideia')}\n\nVou enviar as imagens de referência nesta conversa.`;location.href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`});
}
