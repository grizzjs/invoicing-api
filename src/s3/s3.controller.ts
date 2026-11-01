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
  StreamableFile,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as s3Service from './s3.service';
import { S3UploadDto } from './dto/s3.dto';

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
    schema: { type: 'string', format: 'binary' },
  })
  async downloadFile(
    @Param('resource') resource: s3Service.RESOURCES,
    @Param('id') id: string,
    @Param('key') key: string,
  ): Promise<StreamableFile> {
    const file = await this.s3Service.downloadFiles(resource, id, key);
    if (!file || !file?.Body) {
      throw new HttpNotFoundException(`Resource not found: ${key}`);
    } else {
      const bytes = await file.Body.transformToByteArray();
      return new StreamableFile(bytes, {
        type: file.ContentType ?? 'application/octet-stream',
        disposition: `attachment; filename*=UTF-8''${encodeURIComponent(key)}`,
        length: bytes.length,
      });
    }
  }

  @Post('/:resource/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Download file',
  })
  @ApiBody({ type: S3UploadDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('resource') resource: s3Service.RESOURCES,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    await this.s3Service.uploadFile(resource, id, file);
    return;
  }
}
