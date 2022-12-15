export default class UploadFileDto {
  readonly folder: string;

  readonly attribute: string;

  readonly file: Express.Multer.File;
}
