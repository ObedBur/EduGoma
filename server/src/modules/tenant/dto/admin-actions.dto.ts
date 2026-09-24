import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ValidateTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'Validator name is required' })
  validatedBy: string;
}

export class RejectTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'Rejection reason is required' })
  reason: string;

  @IsOptional()
  @IsString()
  validatedBy?: string;
}
