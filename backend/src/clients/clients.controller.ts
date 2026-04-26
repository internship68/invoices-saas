import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { ClientsService } from "./clients.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../common/types/authenticated-request.js";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto.js";

@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(@Inject(ClientsService) private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.clientsService.findAll(req.user.sub);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateClientDto) {
    return this.clientsService.create(req.user.sub, body);
  }

  @Put(":id")
  update(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() body: UpdateClientDto) {
    return this.clientsService.update(req.user.sub, id, body);
  }

  @Delete(":id")
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.clientsService.remove(req.user.sub, id);
  }
}
