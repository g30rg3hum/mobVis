import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// attaching the prisma instance to the global object to avoid creating multiple instances
const prismaGlobal = global as unknown as { prisma: typeof prisma };
if (process.env.NODE_ENV !== "production") prismaGlobal.prisma = prisma;

export default prisma;
