import { IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AlertQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
