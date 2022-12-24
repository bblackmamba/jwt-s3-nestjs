import { Injectable } from '@nestjs/common';
import * as process from 'process';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
import { ListObjectsOutput } from '@aws-sdk/client-s3';

@Injectable()
export default class StorageS3Service {
  static async uploadFile(body, path: string): Promise<string | null> {
    try {
      const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(process.env.STORAGE_S3_ENDPOINT),
        region: process.env.STORAGE_S3_REGION,
        accessKeyId: process.env.STORAGE_S3_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_S3_ACCESS_SECRET,
      });

      const promise = await s3.upload(
        {
          Bucket: process.env.STORAGE_S3_BUCKET,
          Key: path,
          Body: body,
        },
      ).promise();

      return promise.Key;
    } catch (e) {
      return null;
    }
  }

  static async deleteFile(path: string): Promise<boolean> {
    try {
      let filePath = path;
      if (path.slice(0, 1) === '/') {
        filePath = filePath.slice(1);
      }
      const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(process.env.STORAGE_S3_ENDPOINT),
        region: process.env.STORAGE_S3_REGION,
        accessKeyId: process.env.STORAGE_S3_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_S3_ACCESS_SECRET,
      });

      await s3.deleteObject({
        Bucket: process.env.STORAGE_S3_BUCKET,
        Key: filePath,
      }).promise();

      return true;
    } catch (e) {
      return false;
    }
  }

  static async listObjects(path: string): Promise<ListObjectsOutput | null> {
    try {
      const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(process.env.STORAGE_S3_ENDPOINT),
        region: process.env.STORAGE_S3_REGION,
        accessKeyId: process.env.STORAGE_S3_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_S3_ACCESS_SECRET,
      });

      const s3objects: ListObjectsOutput = await s3.listObjects({
        Bucket: process.env.STORAGE_S3_BUCKET,
        Prefix: path,
      }).promise();

      return s3objects;
    } catch (e) {
      return null;
    }
  }
}
