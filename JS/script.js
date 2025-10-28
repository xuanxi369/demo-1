/* script.js — 前端交互辅助函数（与后端端点对接时替换 fakeApiCall） */

/* ---------- UI 工具函数 ---------- */
function setLoading(btn, isLoading, text) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="loading">${text || '处理中...'}</span>`;
    btn.style.opacity = 0.8;
  } else {
    btn.disabled = false;
    if (btn.dataset.orig) {
      btn.innerHTML = btn.dataset.orig;
      delete btn.dataset.orig;
    }
    btn.style.opacity = 1;
  }
}

function showMsg(text, type = 'info', id = '') {
  const el = id ? document.getElementById(id) : (document.querySelector('.msg') || null);
  if (!el) return;
  el.textContent = text;
  el.classList.remove('success', 'error');
  if (type === 'success') el.classList.add('success');
  if (type === 'error') el.classList.add('error');
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  document.querySelectorAll('.msg').forEach(m => m.textContent = '');
}

function showFieldError(name, text) {
  const el = document.querySelector(`.field-error[data-for="${name}"]`);
  if (el) el.textContent = text;
  else showMsg(text, 'error');
}

/* countdown for "获取验证码" 按钮 */
function startCountdown(btn, seconds = 60) {
  if (!btn) return;
  let t = seconds;
  btn.disabled = true;
  const orig = btn.innerHTML;
  const timer = setInterval(() => {
    if (t <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.innerHTML = orig;
    } else {
      btn.innerHTML = `重新获取 (${t--})`;
    }
  }, 1000);
}

/* ---------- 实际后端请求 ---------- */
async function fakeApiCall(path, payload = {}) {
  const base = 'https://7777-bonus-b72e.millychck-033.workers.dev'; // ✅ Cloudflare Worker 地址
  try {
    const resp = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error('网络错误:', err);
    return { ok: false, error: '网络请求失败，请稍后再试' };
  }
}

/* ---------- 导出函数到全局作用域 ---------- */
window.setLoading = setLoading;
window.showMsg = showMsg;
window.clearFieldErrors = clearFieldErrors;
window.showFieldError = showFieldError;
window.startCountdown = startCountdown;
window.fakeApiCall = fakeApiCall;
