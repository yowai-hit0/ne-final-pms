import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateParkingDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  address!: string;

  numberOfAvailableSpace!: number;

  @IsNumber()
  @IsPositive()
  chargingFeePerHour!: number;
}

export class UpdateParkingDTO {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  code?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @IsOptional()
  numberOfAvailableSpace?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  chargingFeePerHour?: number;
}

export class ListParkingDTO {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
