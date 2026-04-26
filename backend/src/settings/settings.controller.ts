import { Body, Controller, Get, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { SettingsService } from "./settings.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../common/types/authenticated-request.js";
import { UpdateSettingsDto } from "./dto/settings.dto.js";

@Controller("settings")
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(@Inject(SettingsService) private readonly settingsService: SettingsService) {}

  @Get()
  get(@Req() req: AuthenticatedRequest) {
    return this.settingsService.get(req.user.sub);
  }

  @Put()
  update(@Req() req: AuthenticatedRequest, @Body() body: UpdateSettingsDto) {
    return this.settingsService.update(req.user.sub, body);
  }
}
