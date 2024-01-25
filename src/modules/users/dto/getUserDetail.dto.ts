import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsObjectId } from 'src/decorators/isObjectId.decorator';

export class UserByIdDto {
  @ApiProperty()
  @IsObjectId()
  @IsString()
  id: string;
}
