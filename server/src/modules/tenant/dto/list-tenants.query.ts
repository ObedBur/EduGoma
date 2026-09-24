import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORT_FIELDS = ['name', 'createdAt', 'validatedAt', 'status', 'commune'] as const;
const ORDERS = ['asc', 'desc'] as const;

export class ListTenantsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort?: (typeof SORT_FIELDS)[number] = 'createdAt';

  @IsOptional()
  @IsIn(ORDERS)
  order?: (typeof ORDERS)[number] = 'desc';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['all', 'pending', 'active', 'suspended', 'rejected'])
  status?: 'all' | 'pending' | 'active' | 'suspended' | 'rejected' = 'all';

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['all', 'trial', 'active', 'overdue', 'suspended'])
  subscription?: 'all' | 'trial' | 'active' | 'overdue' | 'suspended' = 'all';
}

export class ListPageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  @IsOptional()
  @IsIn(['all', 'pending', 'active', 'suspended', 'rejected'])
  status?: 'all' | 'pending' | 'active' | 'suspended' | 'rejected';

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['all', 'trial', 'active', 'overdue', 'suspended'])
  subscription?: 'all' | 'trial' | 'active' | 'overdue' | 'suspended';

  @IsOptional()
  @IsString()
  search?: string;
}
