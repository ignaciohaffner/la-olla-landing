import { prisma } from '../lib/prisma';

export const getPizzaPartyConfig = () =>
  prisma.pizzaPartyConfig.findUniqueOrThrow({ where: { id: 1 } });

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
