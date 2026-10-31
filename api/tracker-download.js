const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'tracker-private', 'TRU-11-Plus-Tracker-2027.html');
const HOURS = 72;

function fail(res, code, msg) {
  res.status(code).setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Download</title>' +
    '<body style="font:17px/1.5 system-ui,sans-serif;max-width:560px;margin:12vh auto;padding:0 24px;color:#222">' +
    '<h1 style="font-size:24px">' + msg + '</h1><p>Email <a href="mailto:info@tutorsareus.co.uk">info@tutorsareus.co.uk</a> with your Stripe receipt and we will send your file.</p>' +
    '<p><a href="/11-plus-tracker/">Back to the tracker page</a></p></body>');
}

module.exports = async (req, res) => {
  const id = String((req.query && req.query.session_id) || '');
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)) return fail(res, 400, 'We could not find an order reference.');
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PAYMENT_LINK_ID) return fail(res, 500, 'Downloads are not set up yet.');
  let s;
  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(id), {
      headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY }
    });
    if (!r.ok) return fail(res, 404, 'We could not find that order.');
    s = await r.json();
  } catch (e) {
    return fail(res, 502, 'We could not check your payment just now. Please refresh in a minute.');
  }
  if (s.payment_link !== process.env.STRIPE_PAYMENT_LINK_ID) return fail(res, 403, 'That order is not for the 11+ Tracker.');
  if (s.payment_status !== 'paid') return fail(res, 402, 'Payment has not completed yet.');
  if (Date.now() / 1000 - s.created > HOURS * 3600) return fail(res, 410, 'This download link has expired.');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="TRU-11-Plus-Tracker-2027.html"');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(200).send(fs.readFileSync(FILE));
};
