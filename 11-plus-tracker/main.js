const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/cNi14oaI8a8IaXa3qX1VK05";
document.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); window.location.href = STRIPE_PAYMENT_LINK; }));
const tokenBtn = document.getElementById('token-copy-btn');
if (tokenBtn) tokenBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(document.getElementById('preview-token').textContent.trim()); } catch {}
  const l = document.getElementById('token-copy-label');
  tokenBtn.classList.add('is-copied'); l.textContent = 'Copied';
  setTimeout(() => { tokenBtn.classList.remove('is-copied'); l.textContent = 'Copy'; }, 1600);
});
