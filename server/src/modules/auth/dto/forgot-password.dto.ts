import { IsEmail, IsString, IsNotEmpty, ValidateIf, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @ValidateIf(o => !o.phone)
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email or phone is required' })
  email?: string;

  @ValidateIf(o => !o.email)
  @IsString()
  @IsNotEmpty({ message: 'Email or phone is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid international format' })
  phone?: string;
}