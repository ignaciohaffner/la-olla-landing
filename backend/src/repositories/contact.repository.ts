import { prisma } from '../lib/prisma';

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const createContactMessage = (data: CreateContactInput) =>
  prisma.contactMessage.create({ data });
