import { Request, Response } from 'express';
import { prisma } from '../libs';

// Tüm iş ortaklarını getir
export const getAllIsOrtaklari = async (req: Request, res: Response) => {
  try {
    const isOrtaklari = await prisma.isOrtagi.findMany({
      orderBy: [
        { sira: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    res.json(isOrtaklari);
  } catch (error) {
    console.error('İş Ortakları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

// Yeni iş ortağı ekle
export const createIsOrtagi = async (req: Request, res: Response) => {
  try {
    const { adi, kategori, sira, resim } = req.body;

    if (!adi || !resim) {
      return res.status(400).json({ error: 'Adı ve resim zorunludur' });
    }

    const newIsOrtagi = await prisma.isOrtagi.create({
      data: {
        adi,
        kategori: kategori || null,
        resim,
        sira: sira ? parseInt(sira) : 0,
      },
    });

    res.status(201).json(newIsOrtagi);
  } catch (error) {
    console.error('İş Ortağı ekleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

// İş ortağını sil
export const deleteIsOrtagi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const isOrtagi = await prisma.isOrtagi.findUnique({
      where: { id },
    });

    if (!isOrtagi) {
      return res.status(404).json({ error: 'İş ortağı bulunamadı' });
    }

    await prisma.isOrtagi.delete({
      where: { id },
    });

    res.json({ message: 'İş ortağı başarıyla silindi' });
  } catch (error) {
    console.error('İş Ortağı silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

// Sıralama veya bilgileri güncelle
export const updateIsOrtagi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adi, kategori, sira, resim } = req.body;

    const existingIsOrtagi = await prisma.isOrtagi.findUnique({
      where: { id },
    });

    if (!existingIsOrtagi) {
      return res.status(404).json({ error: 'İş ortağı bulunamadı' });
    }

    const updateData: any = {
      adi,
      kategori: kategori || null,
      sira: sira !== undefined ? parseInt(sira) : existingIsOrtagi.sira,
    };

    if (resim) {
      updateData.resim = resim;
    }

    const updatedIsOrtagi = await prisma.isOrtagi.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedIsOrtagi);
  } catch (error) {
    console.error('İş Ortağı güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
