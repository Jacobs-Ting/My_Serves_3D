// 頁面視圖管理
const views = document.querySelectorAll('.view');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastDesc = document.getElementById('toast-desc');
let toastTimer;

function showToast(title, desc = '') {
  clearTimeout(toastTimer);
  toastTitle.textContent = title;
  toastDesc.textContent = desc;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function switchView(viewId, updateHistory = true) {
  const target = document.getElementById(viewId);
  if (!target) return;

  views.forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (updateHistory) {
    history.pushState({ viewId }, '', viewId === 'overview' ? window.location.pathname : `#${viewId}`);
  }
}

// 點擊觸發導航 (卡片與返回按鈕)
document.querySelectorAll('[data-target]').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const targetView = trigger.dataset.target;
    switchView(targetView);
  });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      switchView(trigger.dataset.target);
    }
  });
});

// 複製信箱按鈕
document.querySelectorAll('.copy-email-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const email = btn.dataset.email;
    navigator.clipboard.writeText(email).then(() => {
      showToast('已複製信箱地址！', email);
    }).catch(() => {
      showToast('信箱地址：', email);
    });
  });
});

// 瀏覽器上一頁/下一頁處理 (popstate)
window.addEventListener('popstate', (e) => {
  const hash = window.location.hash.slice(1);
  const targetView = hash && document.getElementById(hash) ? hash : 'overview';
  switchView(targetView, false);
});

// 鍵盤 Esc 鍵返回總覽
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeView = document.querySelector('.view.active');
    if (activeView && activeView.id !== 'overview') {
      switchView('overview');
    }
  }
});

// 初始頁面加載時依 URL Hash 決定顯示
const initHash = window.location.hash.slice(1);
if (initHash && document.getElementById(initHash)) {
  switchView(initHash, false);
}
