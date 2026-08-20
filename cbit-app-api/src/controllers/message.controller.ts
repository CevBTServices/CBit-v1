import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';
import { createMessage, listAllMessages, deleteMessage } from '../services';
import { createMessageSchema } from '../schemas/message.schema';

const createMessageHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const validatedBody = createMessageSchema.parse(req.body);
    const message = await createMessage(validatedBody);
    return res.status(HTTP_STATUS_CODE.CREATED).send(message);
  } catch (error) {
    next(error);
  }
};

const listAllMessagesHandler = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const messages = await listAllMessages();
    return res.status(HTTP_STATUS_CODE.OK).send(messages);
  } catch (error) {
    next(error);
  }
};

const deleteMessageHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const messageId = String(req.params.id);
  try {
    await deleteMessage(messageId);
    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Böyle bir mesaj bulunamadı.' });
    }
    next(error);
  }
};

export { createMessageHandler, listAllMessagesHandler, deleteMessageHandler };
