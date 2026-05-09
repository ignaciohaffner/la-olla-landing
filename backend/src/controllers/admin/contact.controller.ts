import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  findAllContactMessages,
  markContactMessageRead,
  countUnreadMessages,
} from '../../repositories/contact.repository';

const MarkReadSchema = z.object({ read: z.literal(true) });

export async function listMessages(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await findAllContactMessages());
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    MarkReadSchema.parse(req.body);
    const id = Number(req.params.id);
    const message = await markContactMessageRead(id);
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
