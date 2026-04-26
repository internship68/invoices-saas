import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export interface InstallmentInput {
  number: number;
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
  paidAt?: string;
}

export class InvoiceItemDto {
  @IsString()
  description!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  unitPrice!: number;

  @IsNumber()
  amount!: number;
}

export class CreateInvoiceDto {
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
  installments?: InstallmentInput[];
}

export type UpdateInvoiceDto = Partial<CreateInvoiceDto> & {
  status?: "draft" | "sent" | "paid";
};
