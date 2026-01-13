import { Injectable } from "@nestjs/common";
import { CreateObraInput, UpdateObraInput } from "@repo/contracts";
import { PrismaService } from "../../shared/prisma.service";

@Injectable()
export class ObrasRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateObraInput) {
    return this.prisma.obra.create({
      data: {
        ...data,
      },
    });
  }

  async list() {
    return this.prisma.obra.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.obra.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateObraInput) {
    return this.prisma.obra.update({
      where: { id },
      data,
    });
  }
}
