import { NextFunction, Request, Router, Response } from "express";
import {
  LoginForm,
  LoginSchemaType,
  RegisterForm,
  RegisterSchemaType,
} from "./formTypes.js";
import { prismaDB } from "../utils/prisma.js";
import bcrypt from "bcryptjs";

const authRouter = Router();

// routes
authRouter.post("/login", Login).post("/register", Register);

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

    res.json({ msg: "Login route", user: user });
  } catch (error) {
    next(error);
  }
}

async function Register(req: Request, res: Response, next: NextFunction) {
  const formData: RegisterSchemaType = req.body;

  try {
    const validForm = RegisterForm.parse(formData);

    let newUser = await prismaDB.user.create({
      data: {
        email: validForm.email,
        password: await bcrypt.hash(validForm.password, bcrypt.genSaltSync(10)),
        username: validForm.username,
      },
    });

    res.json({ msg: "Register route", user: newUser });
  } catch (error) {
    next(error);
  }
}

export default authRouter;
