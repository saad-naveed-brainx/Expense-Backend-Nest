import { IsString, IsOptional, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class QueryDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsOptional()

    @IsString()
    type?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page = 1;



    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit = 2;
}
