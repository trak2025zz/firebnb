import { object, string } from "zod";

export const loginUserSchema = object({
  email: string().email("This field must contain valid email address"),
  password: string().min(8, "This field must contain valid password"),
});
