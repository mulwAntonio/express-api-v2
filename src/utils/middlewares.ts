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

  if (err instanceof ZodError) {
    let { formErrors } = err;
    statusCode = 400;
    msg = formErrors.fieldErrors;
  }

  res.status(statusCode).json({ msg, stack });
}
