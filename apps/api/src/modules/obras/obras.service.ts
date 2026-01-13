import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateObraInputSchema, ObraSchema, UpdateObraInputSchema } from "@repo/contracts";
import { ObrasRepo } from "./obras.repo";

@Injectable()
export class ObrasService {
  constructor(private readonly repo: ObrasRepo) {}

  async create(data: unknown) {
    const parsed = CreateObraInputSchema.parse(data);
    const obra = await this.repo.create(parsed);
    return ObraSchema.parse(obra);
  }

  async list() {
    const obras = await this.repo.list();
    return obras.map((obra) => ObraSchema.parse(obra));
  }

  async get(id: string) {
    const obra = await this.repo.findById(id);
    if (!obra) throw new NotFoundException("Obra not found");
    return ObraSchema.parse(obra);
  }

  async update(id: string, data: unknown) {
    const validated = UpdateObraInputSchema.parse(data);
    const obra = await this.repo.update(id, validated);
    return ObraSchema.parse(obra);
  }
}
