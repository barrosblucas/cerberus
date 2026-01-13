import { z } from "zod";

/**
 * Contracts do domínio `users`.
 * SSOT: este arquivo define a forma dos dados na borda (API/Web).
 */


export const UserIdSchema = z.string().uuid();

export enum UserRole {
  ADMIN = "ADMIN",
  ENGENHEIRO = "ENGENHEIRO",
  FISCAL = "FISCAL",
  CONVIDADO = "CONVIDADO",
}

export const UserSchema = z.object({
  id: UserIdSchema,
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: z.nativeEnum(UserRole).default(UserRole.CONVIDADO),
  active: z.boolean(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CONVIDADO),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const CreateUserOutputSchema = z.object({
  user: UserSchema,
});

export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;

export const ListUsersOutputSchema = z.object({
  users: z.array(UserSchema),
});

export type ListUsersOutput = z.infer<typeof ListUsersOutputSchema>;
