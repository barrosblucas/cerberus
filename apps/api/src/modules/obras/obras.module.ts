import { Module } from "@nestjs/common";
import { ObrasController } from "./obras.controller";
import { ObrasRepo } from "./obras.repo";
import { ObrasService } from "./obras.service";
import { PrismaService } from "../../shared/prisma.service";

@Module({
  controllers: [ObrasController],
  providers: [ObrasService, ObrasRepo, PrismaService],
  exports: [ObrasService],
})
export class ObrasModule {}
