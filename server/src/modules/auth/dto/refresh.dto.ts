import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RefreshDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken?: string;
}
