import { ApiProperty } from '@nestjs/swagger';

export class S3UploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (max 20 MB)',
  })
  file: Express.Multer.File;
}
