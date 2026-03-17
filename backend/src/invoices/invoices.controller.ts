import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { IsString, IsArray, IsNumber, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InvoicesService } from "./invoices.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

class InvoiceItemDto {
  @IsString()
  description!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  unitPrice!: number;

  @IsNumber()
  amount!: number;
}

class CreateInvoiceDto {
  @IsString()
  clientId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items!: InvoiceItemDto[];

  @IsNumber()
  subtotal!: number;

  @IsBoolean()
  vatEnabled!: boolean;

  @IsNumber()
  vatAmount!: number;

  @IsNumber()
  total!: number;

  @IsBoolean()
  depositEnabled!: boolean;

  @IsNumber()
  depositPercent!: number;

  @IsNumber()
  depositAmount!: number;

  @IsNumber()
  amountDue!: number;

  @IsString()
  dueDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  promptPayId?: string;

  @IsOptional()
  installments?: any;
}

@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(@Inject(InvoicesService) private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.invoicesService.findAll(req.user.sub);
  }

  @Get(":id")
  findOne(@Req() req: any, @Param("id") id: string) {
    return this.invoicesService.findOne(req.user.sub, id);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateInvoiceDto) {
    return this.invoicesService.create(req.user.sub, body);
  }

  @Put(":id")
  update(@Req() req: any, @Param("id") id: string, @Body() body: any) {
    return this.invoicesService.update(req.user.sub, id, body);
  }

  @Delete(":id")
  remove(@Req() req: any, @Param("id") id: string) {
    return this.invoicesService.remove(req.user.sub, id);
  }

  @Post(":id/mark-paid")
  markPaid(@Req() req: any, @Param("id") id: string) {
    return this.invoicesService.markPaid(req.user.sub, id);
  }
}
