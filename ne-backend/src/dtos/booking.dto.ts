import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class CreateBookingDTO {
  @IsString()
  @IsNotEmpty()
  spotId!: string;
}

export class ReleaseBookingDTO {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;
}

export class ListBookingsDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: string;

  @IsOptional()
  @Min(1)
  limit?: string;

  // allows UI to sort ongoing vs completed
  @IsOptional()
  @Matches(/^(ongoing|completed)$/)
  status?: 'ongoing' | 'completed';
}
