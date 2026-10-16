import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMail, checkSubmission, RateLimiter } from './contact.js';

const good = { name: 'Ada', email: 'ada@example.com', message: 'We need a Flutter plugin for BLE.', company: '', t: 0 };

test('accepts a valid submission', () => {
  const v = checkSubmission(good, 10_000);
  assert.equal(v.ok, true);
});

test('rejects invalid email and short message', () => {
  assert.deepEqual(checkSubmission({ ...good, email: 'nope' }), { ok: false, status: 400, error: 'Invalid email' });
  assert.equal(checkSubmission({ ...good, message: 'hi' }).ok, false);
});

test('silently drops honeypot and too-fast submissions', () => {
  const hp = checkSubmission({ ...good, company: 'spam.biz' });
  assert.equal(hp.ok, false);
  assert.equal(!hp.ok && hp.silent, true);
  const fast = checkSubmission({ ...good, t: 9_000 }, 10_000);
  assert.equal(!fast.ok && fast.silent, true);
});

test('rate limiter allows N per window then blocks', () => {
  const rl = new RateLimiter(2, 1000);
  assert.equal(rl.allow('a', 0), true);
  assert.equal(rl.allow('a', 1), true);
  assert.equal(rl.allow('a', 2), false);
  assert.equal(rl.allow('a', 2000), true);
});

test('mail escapes HTML and strips header newlines', () => {
  const m = buildMail({ ...good, name: 'Eve\r\nBcc: x@y.z', message: '<script>x</script>' }, 'me@gmail.com');
  assert.ok(!m.subject.includes('\n'));
  assert.ok(m.html.includes('&lt;script&gt;'));
  assert.equal(m.to, 'me@gmail.com');
});
