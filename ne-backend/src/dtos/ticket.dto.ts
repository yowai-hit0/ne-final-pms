import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateTicketDTO {
  @IsString()
  @IsNotEmpty()
  parkingId!: string;      // ref to Parking.id
}

export class CheckoutTicketDTO {
  @IsString()
  @IsNotEmpty()
  ticketId!: string;
}

export class ListTicketsDTO {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}

export class ReportDTO {
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
