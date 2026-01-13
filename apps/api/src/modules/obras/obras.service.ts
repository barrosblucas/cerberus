
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateObraInput, CreateObraInputSchema, UpdateObraInput } from "@repo/contracts";
import { ObrasRepo } from "./obras.repo";

@Injectable()
export class ObrasService {
    constructor(private readonly repo: ObrasRepo) { }

    async create(data: unknown) {
        const parsed = CreateObraInputSchema.parse(data);
        return this.repo.create(parsed);
    }

    async list() {
        return this.repo.list();
    }

    async get(id: string) {
        const obra = await this.repo.findById(id);
        if (!obra) throw new NotFoundException("Obra not found");
        return obra;
    }

    async update(id: string, data: unknown) {
        // TODO: Schema validation for update
        const validated = data as UpdateObraInput;
        return this.repo.update(id, validated);
    }
}
