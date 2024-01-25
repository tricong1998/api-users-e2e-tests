import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class AddPointDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsInt()
  point: number;
}
