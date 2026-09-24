import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+243[0-9]{9}$/, {
    message: 'Phone must be a valid RDC number (+243 followed by 9 digits)',
  })
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Goma', 'Karisimbi', 'Mugunga', 'Nyiragongo', 'Other'], {
    message: 'Commune must be one of: Goma, Karisimbi, Mugunga, Nyiragongo, Other',
  })
  commune?: string;

  @IsOptional()
  @IsString()
  @IsIn(['private', 'conventionned', 'community', 'public'], {
    message: 'Type must be one of: private, conventionned, community, public',
  })
  type?: string;
}
