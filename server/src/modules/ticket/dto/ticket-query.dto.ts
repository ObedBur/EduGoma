import { IsOptional, Min, Max, IsInt, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'normal', 'urgent', 'critical'])
  priority?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
