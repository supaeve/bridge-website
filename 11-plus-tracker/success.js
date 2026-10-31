(function () {
  const id = new URLSearchParams(location.search).get('session_id') || '';
  const btn = document.getElementById('dl-btn');
  document.getElementById('rc-date').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)) {
    document.getElementById('sx-h').innerHTML = 'No order found.';
    document.getElementById('sx-lede').textContent = 'This page only works straight after checkout. If you have paid, email info@tutorsareus.co.uk and we will send your file.';
    btn.style.display = 'none';
    return;
  }
  document.getElementById('rc-order').textContent = id.slice(-10).toUpperCase();
  const url = '/api/tracker-download?session_id=' + encodeURIComponent(id);
  btn.href = url;
  setTimeout(() => { window.location.href = url; }, 900);
})();
