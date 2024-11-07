import { object, string } from "zod";

export const registerUserSchema = object({
  full_name: string().min(2, "This field must contain valid full name"),
  email: string().email("This field must contain valid email address"),
  password: string().min(8, "This field must contain valid password"),
  password_confirmation: string().min(
    8,
    "This field must contain valid password"
  ),
}).refine((data) => data?.password === data?.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});
