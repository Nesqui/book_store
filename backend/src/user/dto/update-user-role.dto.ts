import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Role } from 'src/guards';

export class UpdateUserRoleDto {
    @ApiProperty({
        enum: Role,
        example: Role.ADMIN
    })
    @IsEnum(Role)
    role: Role;
}
