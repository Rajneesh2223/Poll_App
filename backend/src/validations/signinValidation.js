import { z } from "zod";

const signinSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .min(1, "Email is required.")
    .max(200, "Email cant be more then 200 charecters.")
    .email("Invalid email input"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password cant be less than 6 charecters")
    .max(50, "Password cant be more than 50 charecters"),
});

export default signinSchema;
