import { Body, Controller, Get, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { SettingsService } from "./settings.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  promptPayId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsString()
  companyTaxId?: string;

  @IsOptional()
  @IsString()
  companyPhone?: string;

  @IsOptional()
  @IsString()
  companyEmail?: string;
}

@Controller("settings")
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(@Inject(SettingsService) private readonly settingsService: SettingsService) {}

  @Get()
  get(@Req() req: any) {
    return this.settingsService.get(req.user.sub);
  }

  @Put()
  update(@Req() req: any, @Body() body: UpdateSettingsDto) {
    return this.settingsService.update(req.user.sub, body);
  }
}
