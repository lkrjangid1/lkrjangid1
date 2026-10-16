import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional().default(''),
  t: z.coerce.number().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

export type Verdict =
  | { ok: true; data: Contact }
  | { ok: false; status: number; error: string; silent?: boolean };

const MIN_FILL_MS = 3000;

/** Validates the payload and applies the honeypot and fill-time spam checks. */
export function checkSubmission(body: unknown, now = Date.now()): Verdict {
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return { ok: false, status: 400, error: field ? `Invalid ${String(field)}` : 'Invalid request' };
  }
  const data = parsed.data;
  // Bots: pretend success so they don't retry.
  if (data.company) return { ok: false, status: 200, error: 'ok', silent: true };
  if (data.t && now - data.t < MIN_FILL_MS) return { ok: false, status: 200, error: 'ok', silent: true };
  return { ok: true, data };
}

/** Fixed-window limiter per key, held in instance memory. Good enough for a single small instance. */
export class RateLimiter {
  private hits = new Map<string, { count: number; reset: number }>();
  constructor(private limit = 5, private windowMs = 60 * 60 * 1000) {}

  allow(key: string, now = Date.now()): boolean {
    const h = this.hits.get(key);
    if (!h || now > h.reset) {
      this.hits.set(key, { count: 1, reset: now + this.windowMs });
      return true;
    }
    h.count++;
    return h.count <= this.limit;
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function buildMail(c: Contact, to: string) {
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');
  return {
    from: `"Portfolio contact" <${to}>`,
    to,
    replyTo: { name: oneLine(c.name), address: c.email },
    subject: `Portfolio: message from ${oneLine(c.name)}`.slice(0, 150),
    text: `${c.message}\n\n— ${c.name} <${c.email}>`,
    html: `<p style="white-space:pre-wrap">${esc(c.message)}</p><p>— ${esc(c.name)} &lt;${esc(c.email)}&gt;</p>`,
  };
}
