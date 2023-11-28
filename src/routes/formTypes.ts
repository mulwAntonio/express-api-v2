import { z } from "zod";

export const LoginForm = z
  .object({
    email: z
      .string({
        required_error: "Email required",
      })
      .email({ message: "Invalid email!" }),
    password: z
      .string({
        required_error: "Password required",
        invalid_type_error: "Invalid password",
      })
      .min(5, { message: "5 characters or more required!" }),
  })
  .required();

export type LoginSchemaType = z.infer<typeof LoginForm>;

export const RegisterForm = LoginForm.extend({
  username: z.string({
    required_error: "Username required",
    invalid_type_error: "Invalid username",
  }),
}).required();

export type RegisterSchemaType = z.infer<typeof RegisterForm>;
