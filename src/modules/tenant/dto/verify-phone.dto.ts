import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class VerifyPhoneDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+243[0-9]{9}$/, { 
    message: 'Phone must be a valid RDC number (+243 followed by 9 digits)' 
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  code: string;
}
