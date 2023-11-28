import { PrismaClient } from "@prisma/client";

var prismaDB = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "DEV") {
  global.prisma = prismaDB;
}

export { prismaDB };
