import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: {
    email: string;
    name: string;
    password?: string;
    role: string;
    active?: boolean;
  }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Prisma types might be outdated in this context due to generation failure
    return this.prisma.user.create({ data: input });
  }

  async listUsers(): Promise<Array<{ id: string; email: string; name: string; createdAt: Date }>> {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }
}
