const views = document.querySelectorAll('.view');
let toastTimer;
function showToast(title, desc = '') {
  clearTimeout(toastTimer);
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-desc').textContent = desc;
  document.getElementById('toast').classList.add('show');
  toastTimer = setTimeout(() => document.getElementById('toast').classList.remove('show'), 3600);
}
function switchView(viewId, updateHistory = true) {
  const target = [...views].find(v => v.id === viewId);
  if (!target) return;
  views.forEach(v => v.classList.toggle('active', v === target));
  window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  if (updateHistory && location.hash !== `#${viewId}`) history.pushState({viewId}, '', viewId === 'overview' ? location.pathname + location.search : `#${viewId}`);
  const heading = target.querySelector('h1');
  if (heading && updateHistory) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
  window.dispatchEvent(new CustomEvent('academy-view', {detail:viewId}));
}
const serviceIds=['service-rf','service-ai','service-transition','service-fresh'];
const booking = document.getElementById('booking-dialog');
serviceIds.forEach(id => {
  const section=document.getElementById(id), a=document.createElement('a');
  a.href=section.querySelector('.cta-action-btn').getAttribute('href');
  a.textContent=section.querySelector('h1').textContent;
  document.getElementById('booking-options').append(a);
});
function openBooking(){if(!booking.open) booking.showModal();}
document.addEventListener('click', async e => {
  const nav=e.target.closest('[data-target]');
  if(nav){e.preventDefault();switchView(nav.dataset.target);}
  const book=e.target.closest('[data-booking]');
  if(book){e.preventDefault();openBooking();window.dispatchEvent(new Event('academy-bell'));}
  const copy=e.target.closest('.copy-email-btn');
  if(copy){
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(copy.dataset.email);}
      else{throw new Error('Clipboard API unavailable');}
      showToast('已複製信箱地址！',copy.dataset.email);
    }catch{
      const field=document.createElement('textarea');field.value=copy.dataset.email;
      field.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.append(field);
      field.select();let copied=false;
      try{copied=document.execCommand('copy');}catch{}finally{field.remove();copy.focus({preventScroll:true});}
      showToast(copied?'已複製信箱地址！':'請選取並複製信箱：',copy.dataset.email);
    }
  }
});
document.querySelectorAll('[role="button"][data-target]').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();switchView(el.dataset.target);}}));
function syncHash(){const id=location.hash.slice(1);switchView(serviceIds.includes(id)?id:'overview',false);}
window.addEventListener('popstate',syncHash);window.addEventListener('hashchange',syncHash);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(booking.open){booking.close();return;}if(!document.getElementById('service-preview').hidden){document.getElementById('service-preview').hidden=true;window.dispatchEvent(new Event('academy-reset'));}else if(!document.getElementById('overview').classList.contains('active'))switchView('overview');}});
document.getElementById('close-booking').onclick=()=>booking.close();
document.getElementById('greet-teacher').onclick=()=>{showToast('嗨～歡迎來到小小諮詢教室！','今天想了解哪一項服務呢？');window.dispatchEvent(new Event('academy-wave'));};
document.querySelectorAll('[data-room]').forEach(button=>button.onclick=()=>{if(window.academyExplore)window.academyExplore(button.dataset.room);else switchView(button.dataset.room);});
syncHash();
