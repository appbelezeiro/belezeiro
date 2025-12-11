import z from "zod";

export const LoginAuthServiceResponseSchema = z.object({
  created: z.boolean(),
  /** Only present when onboarding is not completed (false means onboarding required) */
  onboarding: z.boolean().optional(),
});

export type LoginAuthServiceResponse = z.infer<typeof LoginAuthServiceResponseSchema>;
