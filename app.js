// --- COPY TO CLIPBOARD (unchanged behavior, robust on Safari) ---
(function(){
  const copyBtn = document.getElementById('copyBtn');
  const addrEl  = document.getElementById('caText');
  const toast   = document.getElementById('toast');  // optional tiny toast if present

  const value = () => (addrEl ? addrEl.textContent.trim() : '');

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg || 'Copied';
    toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=> toast.style.display = 'none', 1200);
  }

  async function copyText(text){
    try{
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showToast('Copied');
        return;
      }
    }catch(e){}
    try{
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.top='-9999px';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      showToast('Copied');
    }catch(e){
      const r = document.createRange(); r.selectNodeContents(addrEl);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      showToast('Press & hold → Copy');
    }
  }

  function bindCopy(){
    copyBtn?.addEventListener('click', ()=> copyText(value()));
    addrEl ?.addEventListener('click', ()=> copyText(value()));
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', bindCopy)
    : bindCopy();
})();


// --- CHART SCROLL ISOLATION (Safari-friendly hard lock) ---
(function(){
  const wrap = document.getElementById('chartWrap');
  if (!wrap) return;

  let locked = false;
  let y = 0;

  function lock(){
    if (locked) return;
    locked = true;
    // Remember current scroll and freeze body without jump
    y = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add('scroll-fixed');
    document.body.style.top = `-${y}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  }

  function unlock(){
    if (!locked) return;
    locked = false;
    document.body.classList.remove('scroll-fixed');
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, y);
  }

  // Lock when you start interacting anywhere over the chart area
  wrap.addEventListener('pointerdown', lock);
  wrap.addEventListener('touchstart',  lock, {passive:false});

  // Unlock on release/leave/cancel
  wrap.addEventListener('pointerup',     unlock);
  wrap.addEventListener('pointercancel', unlock);
  wrap.addEventListener('mouseleave',    unlock);
  wrap.addEventListener('touchend',      unlock);
  wrap.addEventListener('touchcancel',   unlock);

  // Safety: if the tab loses focus, unlock
  window.addEventListener('blur', unlock);

  // Prevent the page from scrolling while locked (iOS Safari)
  const killScroll = (e)=>{ if (locked) e.preventDefault(); };
  document.addEventListener('touchmove', killScroll, {passive:false});
  document.addEventListener('wheel',     killScroll, {passive:false});
})();
