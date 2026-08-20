import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';
import { createProje, listAllProjeler, findProjeById, updateProje, deleteProje } from '../services';

const createProjeHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await createProje(req.body);
    return res.sendStatus(HTTP_STATUS_CODE.CREATED);
  } catch (error) {
    next(error);
  }
};

const listAllProjelerHandler = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projeler = await listAllProjeler();
    return res.status(HTTP_STATUS_CODE.OK).send(projeler);
  } catch (error) {
    next(error);
  }
};

const findProjeHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const projeId = String(req.params.id);
  try {
    const proje = await findProjeById(projeId);
    if (!proje) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir proje bulunamadı.' });
    }
    return res.status(HTTP_STATUS_CODE.OK).send(proje);
  } catch (error) {
    next(error);
  }
};

const updateProjeHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const projeId = String(req.params.id);
  try {
    await updateProje(projeId, req.body);
    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir proje bulunamadı.' });
    }
    next(error);
  }
};

const deleteProjeHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const projeId = String(req.params.id);
  try {
    await deleteProje(projeId);
    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir proje bulunamadı.' });
    }
    next(error);
  }
};

export { createProjeHandler, listAllProjelerHandler, findProjeHandler, updateProjeHandler, deleteProjeHandler };
