import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import nodemailer from 'nodemailer';
import { buildMail, checkSubmission, RateLimiter } from './contact.js';

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

const limiter = new RateLimiter(5, 60 * 60 * 1000);

export const sendContact = onRequest(
  {
    region: 'asia-south1',
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
    maxInstances: 2,
    memory: '256MiB',
    timeoutSeconds: 30,
    // Served same-origin through the Hosting rewrite, so no CORS is needed.
    cors: false,
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.set('Allow', 'POST').status(405).json({ error: 'Method not allowed' });
      return;
    }

    const ip = String(req.headers['x-forwarded-for'] ?? req.ip ?? 'unknown').split(',')[0].trim();
    if (!limiter.allow(ip)) {
      res.status(429).json({ error: 'Too many messages, try again in an hour' });
      return;
    }

    const verdict = checkSubmission(req.body);
    if (!verdict.ok) {
      if (verdict.silent) logger.info('contact: dropped as spam');
      res.status(verdict.status).json(verdict.silent ? { ok: true } : { error: verdict.error });
      return;
    }

    try {
      const user = GMAIL_USER.value();
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass: GMAIL_APP_PASSWORD.value() },
      });
      await transport.sendMail(buildMail(verdict.data, user));
      res.status(200).json({ ok: true });
    } catch (err) {
      logger.error('contact: send failed', err);
      res.status(502).json({ error: 'Mail service unavailable' });
    }
  },
);
