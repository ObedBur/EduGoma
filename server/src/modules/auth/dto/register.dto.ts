import { IsEmail, IsString, IsNotEmpty, MinLength, Matches, IsOptional, ValidateIf } from 'class-validator';

export class RegisterDto {
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Password must contain uppercase, lowercase, number and special character' }
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Tenant ID is required' })
  tenantId: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
}
