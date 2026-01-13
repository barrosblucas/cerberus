import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CreateUserInputSchema,
  CreateUserOutput,
  ListUsersOutput,
  UserSchema,
} from "@repo/contracts";
import * as bcrypt from "bcrypt";
import { UsersRepo } from "./users.repo";

/**
 * Service com lógica previsível, validando input no início.
 */
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepo) { }

  async createUser(raw: unknown): Promise<CreateUserOutput> {
    const input = CreateUserInputSchema.safeParse(raw);
    if (!input.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: input.error.flatten(),
      });
    }

    const { password, ...rest } = input.data;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const created = await this.repo.createUser({
      ...rest,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = UserSchema.parse({
      id: created.id,
      email: created.email,
      name: created.name,
      role: created.role,
      active: created.active,
      createdAt: created.createdAt.toISOString(),
    });

    return { user };
  }

  async listUsers(): Promise<ListUsersOutput> {
    const users = await this.repo.listUsers();
    return {
      users: users.map((u) =>
        UserSchema.parse({
          id: u.id,
          email: u.email,
          name: u.name,
          createdAt: u.createdAt.toISOString(),
        }),
      ),
    };
  }
}
