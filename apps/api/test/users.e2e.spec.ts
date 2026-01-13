import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/modules/app/app.module";

describe("Users API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /v1/users validates input", async () => {
    const res = await request(app.getHttpServer()).post("/v1/users").send({ email: "invalid", name: "A" });
    expect(res.status).toBe(400);
  });
});
