import { log } from "console";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

interface payloadObj {
  userData: {
    userId: string;
    email: string;
  };
  isRefresh?: boolean;
}
export function GenToken(payload: payloadObj): string {
  let { userData, isRefresh } = payload;

  let timeOut = "10m";
  let secret = process.env.JWT_SECRET!;

  // refresh token
  if (isRefresh) {
    let timeOut = "1h";
    let secret = process.env.JWT_REFRESH!;

    let token = jsonwebtoken.sign({ userId: userData.userId }, secret, {
      expiresIn: timeOut,
      issuer: process.env.JWT_ISSUER!,
      audience: userData.userId,
      subject: "authorization-refresh",
    });

    return token;
  }

  let token = jsonwebtoken.sign({ userId: userData.userId }, secret, {
    expiresIn: timeOut,
    issuer: process.env.JWT_ISSUER!,
    audience: userData.userId,
    subject: "authorization-access",
  });

  return token;
}

export async function AuthorizeAccess(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        next(err);

        return;
      }

      let { iss, aud, userId } = decoded as JwtPayload;

      if (iss === process.env.JWT_ISSUER!) {
        if (aud === userId) {
          req.userID = userId;
          next();
        } else {
          next({ message: "Unauthorized", status: 401 });
        }
      } else {
        next({ message: "Unknown token", status: 401 });
      }

      next();
    });

    next();
  } else {
    next({ message: "Unauthorized", status: 401 });
  }
}
