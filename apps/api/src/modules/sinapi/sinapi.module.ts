import { Module, Global } from "@nestjs/common";
import { MongoService } from "../../shared/mongo.service";
import { SinapiIngesterService } from "./sinapi-ingester.service";
import { SinapiProviderService } from "./sinapi-provider.service";
import { SinapiController } from "./sinapi.controller";
import { PrismaService } from "../../shared/prisma.service";

@Global()
@Module({
    providers: [
        MongoService,
        SinapiIngesterService,
        SinapiProviderService,
        PrismaService,
    ],
    controllers: [SinapiController],
    exports: [SinapiProviderService, SinapiIngesterService, MongoService],
})
export class SinapiModule { }
