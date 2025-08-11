import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentsAboutMeDto {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  relationship: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  status: string;
}
