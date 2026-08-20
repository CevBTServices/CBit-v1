import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, accessTokenCookieOptions } from '../helpers';
import { verifyJwt, signJwt } from '../helpers';
import { isTokenBlacklisted } from '../libs';

const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.cookies?.access_token;

  if (token && !isTokenBlacklisted(token)) {
    const decoded = verifyJwt(token, 'access');
    if (decoded) {
      (req as any).user = decoded;
      return next();
    }
  }

  // Access token is missing, expired, or blacklisted, check refresh token
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken || isTokenBlacklisted(refreshToken)) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Oturum süresi dolmuş veya geçersiz.' });
  }

  const decodedRefresh = verifyJwt(refreshToken, 'refresh');
  if (!decodedRefresh) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Oturum süresi dolmuş veya geçersiz.' });
  }

  // Issue a new access token automatically (keep session alive)
  const newAccessToken = signJwt({ username: decodedRefresh.username }, 'access', { expiresIn: '8h' });
  res.cookie('access_token', newAccessToken, accessTokenCookieOptions);

  (req as any).user = decodedRefresh;
  next();
};

export { authMiddleware };
