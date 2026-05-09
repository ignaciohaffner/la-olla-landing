import { prisma } from '../lib/prisma';
import { PizzaPartyStatus } from '@prisma/client';

export const getPizzaPartyConfig = () =>
  prisma.pizzaPartyConfig.findUniqueOrThrow({ where: { id: 1 } });

export const updatePizzaPartyConfig = (data: Partial<{
  pricePerPerson: number;
  minimumGuests: number;
  baseHours: number;
  extraHourPrice: number;
  mozzoPrice: number;
  serviceDetails: string;
}>) => prisma.pizzaPartyConfig.update({ where: { id: 1 }, data });

export const listPizzaPartyRequests = (status?: PizzaPartyStatus) =>
  prisma.pizzaPartyRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });

export const updatePizzaPartyRequest = (id: number, data: Partial<{
  status: PizzaPartyStatus;
  adminNotes: string | null;
}>) => prisma.pizzaPartyRequest.update({ where: { id }, data });

export interface CreateRequestInput {
  name: string;
  email: string;
  phone: string;
  eventDate: Date;
  guests: number;
  extraHours: number;
  extraMozzos: number;
  message?: string;
  totalPrice: number;
}

export const createPizzaPartyRequest = (data: CreateRequestInput) =>
  prisma.pizzaPartyRequest.create({ data });
