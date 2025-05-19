import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSpotDTO {
  @IsString()
  @IsNotEmpty()
  spotNumber!: string;
}

export class GenerateSpotsDTO {
  @IsString()
  @IsNotEmpty()
  prefix!: string;    // e.g. "A"

  @IsNotEmpty()
  count!: string;     // how many to generate
}

export class ListSpotsDTO {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
