// Copy-to-clipboard with Safari fallback + toast
(function(){
  const copyBtn = document.getElementById('copyBtn');
  const addrEl  = document.getElementById('caText');
  const toast   = document.getElementById('toast');

  const text = () => (addrEl ? addrEl.textContent.trim() : '');

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg || 'Copied';
    toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=> toast.style.display = 'none', 1200);
  }

  async function copy(val){
    try{
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
        showToast('Copied');
        return;
      }
    }catch(e){}
    try{
      // Older Safari / fallback
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.top='-9999px';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied');
    }catch(e){
      // Last resort: select and instruct
      const range = document.createRange();
      range.selectNodeContents(addrEl);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      showToast('Press & hold → Copy');
    }
  }

  function bind(){
    if (copyBtn) copyBtn.addEventListener('click', ()=> copy(text()));
    if (addrEl)  addrEl.addEventListener('click', ()=> copy(text()));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else { bind(); }
})();

// Optional: hard scroll lock while interacting with chart (uncomment to enable)
/*
(function(){
  const wrap = document.getElementById('chartWrap');
  if (!wrap) return;
  let locked = false, y = 0;

  function lock(){
    if (locked) return;
    locked = true;
    y = window.scrollY || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.left = '0'; document.body.style.right = '0';
  }
  function unlock(){
    if (!locked) return;
    locked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = ''; document.body.style.right = '';
    window.scrollTo(0, y);
  }

  wrap.addEventListener('pointerdown', lock);
  wrap.addEventListener('pointerup', unlock);
  wrap.addEventListener('pointercancel', unlock);
  wrap.addEventListener('mouseleave', unlock);
  wrap.addEventListener('touchstart', lock, {passive:false});
  wrap.addEventListener('touchend', unlock);
  wrap.addEventListener('touchcancel', unlock);
  window.addEventListener('blur', unlock);
})();
*/
