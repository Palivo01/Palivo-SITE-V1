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
  const shuffled=[...scroller.querySelectorAll('.portfolio-card')];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
  const fragment=document.createDocumentFragment();shuffled.forEach(card=>fragment.appendChild(card));scroller.appendChild(fragment);
  const cards=[...scroller.querySelectorAll('.portfolio-card')],playback=document.querySelector('#portfolioPlayback');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let down=false,startX=0,startScroll=0,hover=false,focused=false,paused=motion.matches,visible=false,resumeAt=0,frame=0,last=0,direction=1,cursor=scroller.scrollLeft;
  const syncButton=()=>{if(!playback)return;playback.textContent=paused?'Continuar':'Pausar';playback.setAttribute('aria-pressed',String(paused));playback.setAttribute('aria-label',paused?'Retomar movimento do portfólio':'Pausar movimento do portfólio')};
  syncButton();playback?.addEventListener('click',()=>{paused=!paused;syncButton()});
  motion.addEventListener('change',e=>{paused=e.matches;syncButton()});
  const hold=()=>{resumeAt=performance.now()+4500};
  scroller.addEventListener('pointerdown',e=>{hold();if(e.pointerType==='mouse'){down=true;startX=e.clientX;startScroll=scroller.scrollLeft}});
  window.addEventListener('pointerup',()=>{if(down){down=false;hold()}});
  window.addEventListener('pointercancel',()=>{down=false;hold()});
  scroller.addEventListener('pointermove',e=>{if(down){scroller.scrollLeft=startScroll-(e.clientX-startX)*1.2;hold()}});
  scroller.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true});
  scroller.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;down=false}});
  scroller.addEventListener('wheel',hold,{passive:true});
  scroller.addEventListener('keydown',hold);
  scroller.addEventListener('focusin',()=>{focused=scroller.matches(':focus-visible')});
  scroller.addEventListener('focusout',e=>{focused=scroller.contains(e.relatedTarget);hold()});
  const setActive=()=>{
    const center=scroller.getBoundingClientRect().left+scroller.clientWidth/2;let best=null,dist=Infinity;
    cards.forEach(c=>{const r=c.getBoundingClientRect(),d=Math.abs((r.left+r.width/2)-center);if(d<dist){dist=d;best=c}});
    cards.forEach(c=>c.classList.toggle('is-active',c===best));
  };
  let activeTimer=0;scroller.addEventListener('scroll',()=>{if(!activeTimer)activeTimer=setTimeout(()=>{activeTimer=0;setActive()},120)},{passive:true});setActive();
  const animate=now=>{
    frame=0;if(!visible)return;
    const elapsed=last?Math.min(now-last,50):0;last=now;
    if(!paused&&!hover&&!focused&&!down&&!document.hidden&&now>=resumeAt){
      const max=scroller.scrollWidth-scroller.clientWidth;
      if(max>0){cursor+=direction*elapsed*.032;if(cursor>=max){cursor=max;direction=-1}else if(cursor<=0){cursor=0;direction=1}scroller.scrollLeft=cursor}
    }else cursor=scroller.scrollLeft;
    frame=requestAnimationFrame(animate);
  };
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);last=0;if(visible&&!frame)frame=requestAnimationFrame(animate);else if(!visible&&frame){cancelAnimationFrame(frame);frame=0}},{threshold:.05});
  observer.observe(scroller);
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
 const msg=`Olá, Palivo! Quero solicitar um orçamento pelo site.\n\n${promo?`*Projeto:* ${promo}\n`:''}*Nome:* ${value('nome')}\n*Celular:* ${value('celular')}\n*Cidade:* ${value('cidade')}\n*Tamanho aproximado:* ${value('tamanho')}\n*Estilo:* ${value('estilo')}\n*Região do corpo:* ${value('areas')||'Não informada'}\n*Ideia / referência:* ${value('ideia')}\n\nVou enviar as imagens de referência nesta conversa.`;gtag('event','lead_whatsapp');location.href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`});
}
