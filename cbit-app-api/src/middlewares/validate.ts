import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HTTP_STATUS_CODE } from '../helpers';

function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({ error: 'Interval Server Error' });
      }
    }
  };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateId(req: Request, res: Response, next: NextFunction): any {
  if (!UUID_REGEX.test(req.params.id)) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'Geçersiz ID formatı.' });
  }
  next();
}

export { validate, validateId };
