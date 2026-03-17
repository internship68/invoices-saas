import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { IsString, IsOptional, IsEmail } from "class-validator";
import { ClientsService } from "./clients.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

class CreateClientDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(@Inject(ClientsService) private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.clientsService.findAll(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateClientDto) {
    return this.clientsService.create(req.user.sub, body);
  }

  @Put(":id")
  update(@Req() req: any, @Param("id") id: string, @Body() body: CreateClientDto) {
    return this.clientsService.update(req.user.sub, id, body);
  }

  @Delete(":id")
  remove(@Req() req: any, @Param("id") id: string) {
    return this.clientsService.remove(req.user.sub, id);
  }
}
