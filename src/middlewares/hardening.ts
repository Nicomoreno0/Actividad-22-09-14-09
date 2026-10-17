import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const corsOptions = cors();

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login. Probá más tarde.' }
});
