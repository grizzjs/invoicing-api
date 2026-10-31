import {
  Controller,
  Get,
  Param,
  NotFoundException as HttpNotFoundException,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as s3Service from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: s3Service.S3Service) {}

  @Get('/:resource/:id')
  @ApiOkResponse({
    description: 'List of files',
    type: [String],
  })
  getFiles(
    @Param('resource') resource: s3Service.RESOURCES,
    @Param('id') id: string,
  ): Promise<string[]> {
    return this.s3Service.listFiles(resource, id);
  }

  @Get('/:resource/:id/:key')
  @ApiOkResponse({
    description: 'Download file',
    type: Buffer,
  })
  async downloadFile(
    @Param('resource') resource: s3Service.RESOURCES,
    @Param('id') id: string,
    @Param('key') key: string,
  ): Promise<Buffer> {
    const file = await this.s3Service.downloadFiles(resource, id, key);
    if (!file || !file?.Body) {
      throw new HttpNotFoundException(`Resource not found: ${key}`);
    } else {
      const bytes = await file.Body.transformToByteArray();
      return Buffer.from(bytes);
    }
  }

  @Post('/:resource/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Download file',
  })
  async uploadFile(
    @Param('resource') resource: s3Service.RESOURCES,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    await this.s3Service.uploadFile(resource, id, file);
    return;
  }
}
