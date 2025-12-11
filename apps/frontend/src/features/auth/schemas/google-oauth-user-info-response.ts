import z from "zod";

export const GoogleOAuthUserInfoResponseSchema = z.object({
  sub: z.string().min(1, "Google user ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  email_verified: z.boolean(),
  picture: z.string().url("Invalid picture URL").default(""),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  locale: z.string().optional(),
});