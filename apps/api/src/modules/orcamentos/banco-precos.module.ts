import { Module } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { BancoPrecosController } from "./banco-precos.controller";
import { BancoPrecosRepo } from "./banco-precos.repo";
import { BancoPrecosService } from "./banco-precos.service";

@Module({
  controllers: [BancoPrecosController],
  providers: [BancoPrecosService, BancoPrecosRepo, PrismaService],
})
export class BancoPrecosModule {}
