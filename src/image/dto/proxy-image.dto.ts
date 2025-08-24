import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProxyImageDto {
  @ApiProperty({
    description: 'Base64 encoded Cloudinary image URL',
    example:
      'aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20veW91ci1jbG91ZC1uYW1lL2ltYWdlL3VwbG9hZC92MTIzNDU2Nzg5MC9zYW1wbGUuanBn',
  })
  @IsString()
  @IsNotEmpty()
  encodedUrl: string;
}
