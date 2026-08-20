import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, accessTokenCookieOptions, refreshTokenCookieOptions } from '../helpers';
import { hashPassword, verifyPassword, signJwt } from '../helpers';
import { findAdminByUsername, updateAdminPassword } from '../services';
import { blacklistToken } from '../libs';

const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { username, password } = req.body;

    const admin = await findAdminByUsername(username);
    if (!admin) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const accessToken = signJwt({ username: admin.username }, 'access', { expiresIn: '8h' });
    res.cookie('access_token', accessToken, accessTokenCookieOptions);

    const refreshToken = signJwt({ username: admin.username }, 'refresh', { expiresIn: '7d' });
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

const logoutHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (accessToken) {
      blacklistToken(accessToken, 8 * 60 * 60 * 1000);
    }
    if (refreshToken) {
      blacklistToken(refreshToken, 7 * 24 * 60 * 60 * 1000);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

const changePasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const username = (req as any).user?.username;
    const { currentPassword, newPassword } = req.body;

    const admin = await findAdminByUsername(username);
    if (!admin) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Hesap bulunamadı.' });
    }

    const isValid = await verifyPassword(currentPassword, admin.password);
    if (!isValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Mevcut şifre hatalı.' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await updateAdminPassword(username, hashedPassword);

    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

const verifyHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    return res.status(HTTP_STATUS_CODE.OK).json({ username: (req as any).user?.username });
  } catch (error) {
    next(error);
  }
};

export { loginHandler, logoutHandler, changePasswordHandler, verifyHandler };
