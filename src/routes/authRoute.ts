import { NextFunction, Request, Router, Response } from "express";
import {
  LoginForm,
  LoginSchemaType,
  RegisterForm,
  RegisterSchemaType,
} from "./formTypes.js";

const authRouter = Router();

// routes
authRouter.post("/login", Login).post("/register", Register);

// controllers
async function Login(req: Request, res: Response, next: NextFunction) {
  const formData: LoginSchemaType = req.body;

  try {
    const validForm = LoginForm.parse(formData);

    res.json({ msg: "Login route", payload: validForm });
  } catch (error) {
    next(error);
  }
}

async function Register(req: Request, res: Response, next: NextFunction) {
  const formData: RegisterSchemaType = req.body;

  try {
    const validForm = RegisterForm.parse(formData);

    res.json({ msg: "Register route", payload: validForm });
  } catch (error) {
    next(error);
  }
}

export default authRouter;
