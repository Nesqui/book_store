import { ApiProperty, } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class AcceptUserDto {
  @ApiProperty({
    type: String,
    description: 'Confirmation bcrypt hash',
  })
  @IsString()
  confirmationHash: string;

  @ApiProperty({
    type: String,
    description: 'Username for confirmation bcrypt hash',
  })
  @IsString()
  username: string;
}
