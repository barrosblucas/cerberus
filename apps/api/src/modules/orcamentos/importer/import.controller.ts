import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImportService } from "./import.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";

@Controller("tabelas-referencia/:id/import")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportController {
  constructor(private service: ImportService) { }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@Param("id") id: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException("File is required");

    const result = await this.service.importInsumos(id, file.buffer);
    return result;
  }

  @Post("sync-sinapi")
  async syncSinapi(@Param("id") id: string) {
    return this.service.syncFromMongo(id);
  }
}
