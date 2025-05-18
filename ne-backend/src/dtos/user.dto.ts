import { IsEmail, IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Role } from '@prisma/client';

/** Used when a user updates their own profile */
export class UpdateUserDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
}

/** Used by admins to update any user (including role) */
export class AdminUpdateUserDto extends UpdateUserDto {
  @IsOptional() @IsEnum(Role) role?: Role;
}

/** Query params for listing users */
export class ListUserQueryDto {
  @IsOptional() @IsString() searchKey?: string;
  @IsOptional() @IsInt() @Min(1) page?: number;
  @IsOptional() @IsInt() @Min(1) limit?: number;
}
