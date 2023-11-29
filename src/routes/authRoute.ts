import { NextFunction, Request, Router, Response } from "express";
import {
  LoginForm,
  LoginSchemaType,
  RegisterForm,
  RegisterSchemaType,
} from "./formTypes.js";
import { prismaDB } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import { AuthorizeAccess, GenToken } from "./jwt.js";
import {
  EventHandler,
  EventNames,
  MutateRefreshTokenPayloadObj,
} from "../utils/events.js";

const authRouter = Router();

// routes
authRouter
  .post("/login", Login)
  .post("/register", Register)
  .post("/logout", AuthorizeAccess, Logout);

// controllers
async function Login(req: Request, res: Response, next: NextFunction) {
  const formData: LoginSchemaType = req.body;

  try {
    const validForm = LoginForm.parse(formData);

    // check if user exists
    let user = await prismaDB.user.findUniqueOrThrow({
      where: {
        email: validForm.email,
      },
    });

    // check password hash
    if (!(await bcrypt.compare(validForm.password, user.password))) {
      next({ message: "Invalid credentials", status: 400 });

      return;
    }

    // remember to gen token
    let accessToken = GenToken({
      userData: {
        userId: user.userId,
        email: user.email,
      },
    });

    EventHandler.emit(EventNames[0], {
      token: GenToken({
        userData: {
          userId: user.userId,
          email: user.email,
        },
        isRefresh: true,
      }),
      userId: user.userId,
      type: "save",
    } as MutateRefreshTokenPayloadObj);

    res
      .setHeader("authorization", `Bearer ${accessToken}`)
      .json({ msg: "Login route", user: user });
  } catch (error) {
    next(error);
  }
}

async function Register(req: Request, res: Response, next: NextFunction) {
  const formData: RegisterSchemaType = req.body;

  try {
    const validForm = RegisterForm.parse(formData);

    await prismaDB.user.create({
      data: {
        email: validForm.email,
        password: await bcrypt.hash(validForm.password, bcrypt.genSaltSync(10)),
        username: validForm.username,
      },
    });

    res.status(201).json({ msg: "User created success" });
  } catch (error) {
    next(error);
  }
}

async function Logout(req: Request, res: Response, next: NextFunction) {
  EventHandler.emit(EventNames[0], {
    userId: req.userID,
    type: "remove",
  } as MutateRefreshTokenPayloadObj);

  res.setHeader("authorization", "").json({ msg: "Logged out success" });
}

export default authRouter;
