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

  @IsInt()
  @Min(1)
  count!: number;     // how many to generate
}

export class ListSpotsDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
