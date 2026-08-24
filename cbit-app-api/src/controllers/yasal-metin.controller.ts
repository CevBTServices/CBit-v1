import { Request, Response } from 'express';
import {
  getAllYasalMetinler,
  getYasalMetinById,
  createYasalMetin,
  updateYasalMetin,
  deleteYasalMetin,
} from '../services/yasal-metin.service';
import { createYasalMetinSchema, updateYasalMetinSchema } from '../schemas/yasal-metin.schema';
import { z } from 'zod';

const getList = async (req: Request, res: Response) => {
  try {
    const data = await getAllYasalMetinler();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const data = await getYasalMetinById(req.params.id);
    if (!data) {
      res.status(404).json({ message: 'Yasal metin bulunamadı' });
      return;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const data = createYasalMetinSchema.parse(req.body);
    const result = await createYasalMetin(data);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const data = updateYasalMetinSchema.parse(req.body);
    const result = await updateYasalMetin(req.params.id, data);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    await deleteYasalMetin(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { getList, getById, create, update, remove };
