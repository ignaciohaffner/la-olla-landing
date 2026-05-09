import { prisma } from '../lib/prisma';

export function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({ where: { email } });
}
