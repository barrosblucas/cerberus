import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { ObrasModule } from "../obras/obras.module";
import { BancoPrecosModule } from "../orcamentos/banco-precos.module";
import { OrcamentosAdminModule } from "../orcamentos/orcamentos-admin.module";
import { OrcamentosModule } from "../orcamentos/orcamentos.module";
import { ReportsModule } from "../reports/reports.module";
import { SinapiModule } from "../sinapi/sinapi.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ObrasModule,
    BancoPrecosModule,
    OrcamentosAdminModule,
    OrcamentosModule,
    ReportsModule,
    SinapiModule,
  ],
})
export class AppModule { }
