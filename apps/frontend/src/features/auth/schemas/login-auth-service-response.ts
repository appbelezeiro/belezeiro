import z from "zod";

export const LoginAuthServiceResponseSchema = z.object({
  created: z.boolean(),
  pending_actions: z.record(z.string(), z.string()).optional(),
});

export type LoginAuthServiceResponse = z.infer<typeof LoginAuthServiceResponseSchema>;
