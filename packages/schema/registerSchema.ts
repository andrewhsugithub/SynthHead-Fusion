import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
});

export type RegisterUserFormSchema = z.infer<typeof RegisterUserSchema>;
