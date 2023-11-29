import type { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

declare global {
  var prisma: PrismaClient;

  namespace Express {
    interface Request extends RequestHandler {
      userID?: string;
    }
  }
}

export {};
