import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from './prisma';

// Ensure getDatabaseUrl is passed along to anything importing it from here
export { getDatabaseUrl };

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Reuse the global instance if it exists, otherwise create a new one
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Single, clean default export
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;