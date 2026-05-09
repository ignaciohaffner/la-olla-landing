import { RequestHandler } from 'express';
import { z } from 'zod';
import { submitContact } from '../services/contact.service';

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export const createContact: RequestHandler = async (req, res, next) => {
  try {
    const data = ContactSchema.parse(req.body);
    await submitContact(data);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
