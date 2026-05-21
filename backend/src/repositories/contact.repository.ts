import { prisma } from '../lib/prisma';

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const createContactMessage = (data: CreateContactInput) =>
  prisma.contactMessage.create({ data });

export const findAllContactMessages = () =>
  prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

export const setContactMessageReadStatus = (id: number, read: boolean) =>
  prisma.contactMessage.update({ where: { id }, data: { read } });

export const countUnreadMessages = () =>
  prisma.contactMessage.count({ where: { read: false } });
