// import { PrismaClient } from '@prisma/client';

// // TODO : downgraded @types/node to 15.14.1 to avoid error on NodeJS.Global
// interface CustomNodeJsGlobal extends Global {
//   prisma: PrismaClient;
// }

// // Prevent multiple instances of Prisma Client in development
// declare const global: CustomNodeJsGlobal;

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV === 'development') {
//   global.prisma = prisma;
// }

// export default prisma;

// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
 