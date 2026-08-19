import { Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';
import { getOrCreateAyarlar, updateAyarlar } from '../services';

const getAyarlarHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ayarlar = await getOrCreateAyarlar();
    res.status(HTTP_STATUS_CODE.OK).json(ayarlar);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Ayarlar alınamadı.' });
  }
};

const updateAyarlarHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projelerAktif, haberlerAktif, isOrtaklariAktif } = req.body as { projelerAktif?: boolean; haberlerAktif?: boolean; isOrtaklariAktif?: boolean };
    const ayarlar = await updateAyarlar({ projelerAktif, haberlerAktif, isOrtaklariAktif });
    res.status(HTTP_STATUS_CODE.OK).json(ayarlar);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Ayarlar güncellenemedi.' });
  }
};

export { getAyarlarHandler, updateAyarlarHandler };
