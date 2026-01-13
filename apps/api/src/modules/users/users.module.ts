import { Module } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { UsersController } from "./users.controller";
import { UsersRepo } from "./users.repo";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersRepo, UsersService],
})
export class UsersModule {}
