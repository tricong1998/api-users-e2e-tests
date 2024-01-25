import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Gender, Nation, Role } from '../users.type';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: Nation })
  @IsEnum(Nation)
  nation: Nation;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
