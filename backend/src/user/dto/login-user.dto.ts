import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length, Matches } from "class-validator"

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'The username of the user. Only alphabetic characters are allowed. Length between 2 and 15 characters.',
    example: 'JohnDoe',
    minLength: 2,
    maxLength: 15,
    pattern: '^[a-zA-Z]+$',
  })
  @IsString()
  @Matches(/^[a-z]+$/i, { message: 'Username must contain only alphabetic characters' })
  @Length(2, 15, { message: 'Username must be between 2 and 15 characters long' })
  username: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user.',
    example: 'password123',
  })
  @IsString()
  password: string;
}
