import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
