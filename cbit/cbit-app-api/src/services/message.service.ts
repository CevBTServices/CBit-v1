import { prisma } from '../libs';
import { sendContactEmail } from './email.service';

interface IMessageData {
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
}

const createMessage = async (data: IMessageData) => {
  const m = await prisma.message.create({ data });

  // Send email notification (fire-and-forget, don't block the response)
  sendContactEmail(data).catch((err) => {
    console.error('[EMAIL ERROR] E-posta gönderilemedi:', err.message);
  });

  return m;
};

const listAllMessages = async () => {
  return prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
};

const deleteMessage = async (id: string) => {
  const m = await prisma.message.delete({ where: { id } });
  return m;
};

export { createMessage, listAllMessages, deleteMessage };
