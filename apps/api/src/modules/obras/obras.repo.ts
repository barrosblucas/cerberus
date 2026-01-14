import { Injectable } from "@nestjs/common";
import type { CreateObraInput, UpdateObraInput } from "@repo/contracts";
import { PrismaService } from "../../shared/prisma.service";

@Injectable()
export class ObrasRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateObraInput) {
    const { dotacoes, ...obraData } = data;
    return this.prisma.obra.create({
      data: {
        ...obraData,
        dotacoes: dotacoes?.length ? { create: dotacoes } : undefined,
      },
      include: { dotacoes: true },
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
      include: { dotacoes: true },
    });
  }

  async update(id: string, data: UpdateObraInput) {
    const { dotacoes, ...obraData } = data;
    return this.prisma.obra.update({
      where: { id },
      data: {
        ...obraData,
        dotacoes: dotacoes
          ? {
              deleteMany: {},
              create: dotacoes,
            }
          : undefined,
      },
      include: { dotacoes: true },
    });
  }

  async remove(id: string) {
    return this.prisma.obra.delete({
      where: { id },
      include: { dotacoes: true },
    });
  }
}
