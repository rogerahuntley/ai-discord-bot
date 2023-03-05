import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const close = () => {
  prisma.$disconnect()
}

export { close as dbClose, prisma }