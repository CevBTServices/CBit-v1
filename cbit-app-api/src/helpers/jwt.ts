import { inflateSync } from 'zlib';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { logger } from '../libs/logger';

if (
  !process.env.ACCESS_PRIVATE_KEY_GLIB ||
  !process.env.ACCESS_PUBLIC_KEY_GLIB ||
  !process.env.REFRESH_PRIVATE_KEY_GLIB ||
  !process.env.REFRESH_PUBLIC_KEY_GLIB
) {
  throw new Error("JWT key'leri tanımlı değil");
}

const accessPrivateKEY = inflateSync(Buffer.from(process.env.ACCESS_PRIVATE_KEY_GLIB, 'base64')).toString('utf8');
const accessPublicKEY = inflateSync(Buffer.from(process.env.ACCESS_PUBLIC_KEY_GLIB, 'base64')).toString('utf8');

const refreshPrivateKEY = inflateSync(Buffer.from(process.env.REFRESH_PRIVATE_KEY_GLIB, 'base64')).toString('utf8');
const refreshPublicKEY = inflateSync(Buffer.from(process.env.REFRESH_PUBLIC_KEY_GLIB, 'base64')).toString('utf8');

const signJwt = (payload: JwtPayload, key: 'access' | 'refresh', options: SignOptions = {}) => {
  const usedKey = key === 'access' ? accessPrivateKEY : refreshPrivateKEY;

  return jwt.sign(payload, usedKey, {
    ...options,
    algorithm: 'RS256',
  });
};

const verifyJwt = (token: string, key: 'access' | 'refresh') => {
  const usedKey = key === 'access' ? accessPublicKEY : refreshPublicKEY;
  try {
    return jwt.verify(token, usedKey, { algorithms: ['RS256'] }) as JwtPayload;
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      logger.info(`[verifyJwt]: Token expired`);
    } else {
      logger.error(`[verifyJwt ERROR]: ${error}`);
    }
    return null;
  }
};

export { signJwt, verifyJwt };
