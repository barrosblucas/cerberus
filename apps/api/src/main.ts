import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { AppModule } from "./modules/app/app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.use(
    pinoHttp({
      level: process.env.LOG_LEVEL ?? "info",
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.token",
      ],
    }),
  );

  app.setGlobalPrefix("v1");

  const config = new DocumentBuilder()
    .setTitle("AI-Native API")
    .setDescription("API gerada e mantida por IA com contracts e gates.")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Forcing 5500 as the frontend expects it and PORT might be set to 4000 in this env
  const port = 5500;
  console.log(`[API] Starting on port ${port}`);
  await app.listen(port);
}
void bootstrap();
