/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common';
import * as nestjsS3 from 'nestjs-s3';
import { S3_CONFIG } from '../config/config';
import * as config from '@nestjs/config';

export type RESOURCES =
  | 'customer'
  | 'delivery-receipt'
  | 'invoices'
  | 'purchase-order'
  | 'collection-receipt';

const filenameToKey = (originalname: string): string => {
  // Multer decodes UTF-8 names as latin1; restore them
  const name = Buffer.from(originalname, 'latin1').toString('utf8');

  const encoded = encodeURIComponent(name).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  // "." and ".." are valid after encoding but problematic as keys
  const safe = /^\.+$/.test(encoded) ? encoded.replace(/\./g, '%2E') : encoded;

  return safe;
};

const keyToFilename = (key: string): string => {
  return decodeURIComponent(key);
};

@Injectable()
export class S3Service {
  constructor(
    @nestjsS3.InjectS3() private readonly s3: nestjsS3.S3,
    @Inject(S3_CONFIG.KEY)
    private s3Config: config.ConfigType<typeof S3_CONFIG>,
  ) {}

  async listFiles(type: RESOURCES, id: string): Promise<string[]> {
    const keys = (await this.s3.listObjectsV2({
      Bucket: this.s3Config.bucket,
      Prefix: `${type}/${id}/`,
    })) as unknown as { Contents: { Key: string }[] };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-return
    return keys.Contents
      ? keys.Contents.map((key) => {
          const key_parts = key.Key.split('/');
          const filename = keyToFilename(key_parts[key_parts.length - 1]);
          return filename;
        })
      : [];
  }

  async downloadFiles(type: RESOURCES, id: string, key: string) {
    const file = await this.s3.getObject({
      Bucket: this.s3Config.bucket,
      Key: `${type}/${id}/${filenameToKey(key)}`,
    });

    if (!file.Body) {
      throw new Error(`No object body returned for ${key}.`);
    }

    return file;
  }

  async uploadFile(type: RESOURCES, id: string, file: Express.Multer.File) {
    const params = {
      Bucket: this.s3Config.bucket,
      Key: `${type}/${id}/${filenameToKey(file.originalname)}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.putObject(params);
  }
}
