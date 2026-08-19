import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';
import { createHaber, listAllHaber, updateHaber, deleteHaber, findHaberById } from '../services';

const createHaberHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await createHaber(req.body);
    return res.sendStatus(HTTP_STATUS_CODE.CREATED).end();
  } catch (error) {
    next(error);
  }
};

const listAllHaberHandler = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const allHaber = await listAllHaber();
    return res.status(HTTP_STATUS_CODE.OK).send(allHaber);
  } catch (error) {
    next(error);
  }
};

const updateHaberHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const haberId = String(req.params.id);
  try {
    await updateHaber(haberId, req.body);
    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir haber bulunamadı.' });
    }
    next(error);
  }
};

const deleteHaberHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const haberId = String(req.params.id);
  try {
    await deleteHaber(haberId);
    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir haber bulunamadı.' });
    }
    next(error);
  }
};

const findHaberHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const haberId = String(req.params.id);

  try {
    const haber = await findHaberById(haberId);
    if (!haber) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir haber bulunamadı.' });
    }

    return res.status(HTTP_STATUS_CODE.OK).send(haber);
  } catch (error) {
    next(error);
  }
};

export { createHaberHandler, listAllHaberHandler, updateHaberHandler, deleteHaberHandler, findHaberHandler };
