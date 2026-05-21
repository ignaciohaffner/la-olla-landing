import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  findAllContactMessages,
  setContactMessageReadStatus,
  countUnreadMessages,
} from '../../repositories/contact.repository';

const MarkReadSchema = z.object({ read: z.boolean() });

export async function listMessages(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await findAllContactMessages());
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { read } = MarkReadSchema.parse(req.body);
    const id = Number(req.params.id);
    const message = await setContactMessageReadStatus(id, read);
    res.json({ id: message.id, read: message.read });
  } catch (err) {
    next(err);
  }
}

export async function unreadCount(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await countUnreadMessages();
    res.json({ count });
  } catch (err) {
    next(err);
  }
}
