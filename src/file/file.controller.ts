import FileService from './file.service';
import AuthController from '../common/decorators/auth-controller.decorator';

@AuthController('file')
export default class FileController {
  constructor(private readonly fileService: FileService) {}
}
