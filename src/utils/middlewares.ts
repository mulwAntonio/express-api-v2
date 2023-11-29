import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface errorObj {
  message: string | ZodError["formErrors"]["fieldErrors"];
  stack?: string;
  status?: number;
}
export function GlobalErrorHandler(
  err: errorObj,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let msg = err.message;
  let stack = err.stack ?? msg;
  let statusCode = err.status ?? 500;

  // schema validator (zod) errors
  if (err instanceof ZodError) {
    let { formErrors } = err;
    statusCode = 400;
    msg = formErrors.fieldErrors;
  }

  // prisma (ORM) errors
  else if (err instanceof PrismaClientKnownRequestError) {
    let { code, meta } = err;

    let field = meta?.target;

    statusCode = 400;
    msg = "Prisma error";

    if (code === "P2002") {
      msg = "Unique constraint ".concat(field as string);
    }
  }

  res.status(statusCode).json({ msg, stack });
}
