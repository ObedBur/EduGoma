import { IsEmail, IsString, IsNotEmpty, MinLength, Matches, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.phone)
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email or phone is required' })
  email?: string;

  @ValidateIf(o => !o.email)
  @IsString()
  @IsNotEmpty({ message: 'Email or phone is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid international format' })
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1, { message: 'Password cannot be empty' })
  password: string;
}
