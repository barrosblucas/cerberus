import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserInputSchema, CreateUserOutput, ListUsersOutput } from "@repo/contracts";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiBody({ description: "Create user", schema: { example: { email: "a@b.com", name: "Alice" } } })
  @ApiOkResponse({ description: "Created", schema: { example: { user: { id: "uuid", email: "a@b.com", name: "Alice", createdAt: "2026-01-01T00:00:00.000Z" } } } })
  async create(@Body() body: unknown): Promise<CreateUserOutput> {
    return this.usersService.createUser(body);
  }

  @Get()
  async list(): Promise<ListUsersOutput> {
    return this.usersService.listUsers();
  }
}
