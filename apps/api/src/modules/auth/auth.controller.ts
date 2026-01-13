import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { LoginDTO, LoginSchema } from "@repo/contracts";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      throw new UnauthorizedException("Invalid input");
    }

    const { access_token, user } = await this.authService.login(result.data);

    // Set httpOnly cookie
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token");
    return { message: "Logged out" };
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getUserProfile(req.user.userId);
    if (!user) throw new UnauthorizedException("User not found");
    return { user };
  }
}
