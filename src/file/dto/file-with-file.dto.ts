import FileTypeDto from './file-type.dto';

export default class FileWithDto extends FileTypeDto {
  readonly file?: Express.Multer.File;
}
