import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsNumber,  IsString, ValidateIf } from "class-validator"
import { Type } from "class-transformer"

export class CreateBookDto {

  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string

  @ApiProperty({
    type: String,
  })
  @IsString()
  author: string

  @ApiProperty({
    type: String,
  })
  @IsString()
  publicationDate: string

  @ApiProperty({
    type: [String],
    isArray: true,
  })
  @IsArray()
  @Type(() => String)
  genres: string[];
}
