import { IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortByField {
  AVG_SCORE = 'avgScore',
  NAME = 'name',
  LAST_INTERVIEW = 'lastInterview'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class GetCandidatesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(SortByField)
  sortBy?: SortByField = SortByField.AVG_SCORE;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
