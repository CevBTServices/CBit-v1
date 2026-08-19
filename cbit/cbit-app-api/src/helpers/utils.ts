import { CookieOptions } from 'express';
import moment from 'moment';

const { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, NODE_ENV } = process.env;

if (!ACCESS_TOKEN_EXPIRES_IN || !REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error('Token süreleri tanımlı değil');
}

const isProd = NODE_ENV === 'production';
const sameSiteOption = (process.env.COOKIE_SAME_SITE as any) || (isProd ? 'none' : 'lax');

const accessTokenCookieOptions: CookieOptions = {
  expires: moment().add(ACCESS_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000,
  httpOnly: true,
  secure: isProd,
  sameSite: sameSiteOption,
};

const refreshTokenCookieOptions: CookieOptions = {
  expires: moment().add(REFRESH_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: isProd,
  sameSite: sameSiteOption,
};

export const sanitizeInput = (val: string | any): any => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]*)/gi, '');
};

export { accessTokenCookieOptions, refreshTokenCookieOptions };
