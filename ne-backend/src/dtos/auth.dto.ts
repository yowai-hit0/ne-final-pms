import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
} from "class-validator";

export class RegisterDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  password!: string;

  // ─── NEW ─── Vehicle Plate ────────────────────────────────────
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9\-]{1,10}$/, {
    message: "vehiclePlateNumber must be 1–10 chars: A–Z, 0–9 or dash",
  })
  vehiclePlateNumber?: string;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class EmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
