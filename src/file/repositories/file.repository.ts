import * as path from 'path';
import * as fs from 'fs';
import { StreamableFile } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Op } from 'sequelize';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import getAudioDurationInSeconds from 'get-audio-duration';
import getVideoDurationInSeconds from 'get-video-duration';
import File from '../models/file.model';
import { FileWithFileDto, UploadFileDto } from '../dto';
import StorageS3Service from '../../storage-s3/storage-s3.service';
import { FileTypeEnum } from '../enums';
import FileArticle from '../models/file-article.model';
import FileExercise from '../models/file-exercise.model';
import FileMeal from '../models/file-meal.model';

export default class FileRepository extends File {
  public static async getContent(id: number, extension: string): Promise<StreamableFile> {
    const filePath = path.resolve(__dirname, '../../..', `public/files/${id}/${id}.${extension}`);
    const fileContent = fs.createReadStream(filePath);

    return new StreamableFile(fileContent);
  }

  public static async updateFiles(
    files: FileWithFileDto[],
    relationId: number,
    relationKey: string,
    fileRelation: Repository<FileArticle | FileExercise | FileMeal>,
  ) {
    const existsFileIds: number[] = [];

    let lastIndex: number = 0;
    const uploadFiles = async (index): Promise<boolean> => {
      if (!files[index]) {
        return true;
      }
      const file: FileWithFileDto = files[index];

      let updatedFile: File;
      // File exists
      if (file.id > 0) {
        // eslint-disable-next-line no-underscore-dangle
        const relationModel = await fileRelation.findOne({
          where: {
            fileId: file.id,
            [relationKey]: relationId,
          },
        });

        if (!relationModel) {
          await uploadFiles(index + 1);
          return true;
        }

        updatedFile = await File.findByPk(file.id);
        if (!updatedFile) {
          await uploadFiles(index + 1);
          return true;
        }

        const extension = file.file
          ? String(file.file.originalname.split('.').pop() || 'unk').toLowerCase()
          : updatedFile.extension;

        if (file.file && file.file.originalname && file.file.size) {
          const result = await StorageS3Service.deleteFile(path.join('files/files/', updatedFile.id.toString(), `${updatedFile.id}.${updatedFile.extension}`));

          if (!result) {
            await uploadFiles(index + 1);
            return true;
          }
        }
        await File.update({
          type: file.type,
          name: file.file ? file.file.originalname : updatedFile.name,
          size: file.file ? file.file.size : updatedFile.size,
          index: lastIndex,
          title: file.title ? file.title : updatedFile.title,
          description: file.description ? file.description : updatedFile.description,
          extension,
        }, { where: { id: updatedFile.id } });

        existsFileIds.push(updatedFile.id);
        lastIndex += 1;
        // New file
      } else {
        if (!(file.file && file.file.size && file.file.originalname)) {
          await uploadFiles(index + 1);
          return true;
        }

        try {
          const extension = String(file.file.originalname.split('.').pop() || 'unk').toLowerCase();
          updatedFile = await File.create({
            type: file.type,
            name: file.file.originalname,
            size: file.file.size,
            index: lastIndex,
            title: file.title,
            description: file.description,
            extension,
          });

          await fileRelation.create({
            fileId: updatedFile.id,
            [relationKey]: relationId,
          });

          existsFileIds.push(updatedFile.id);
          lastIndex += 1;
        } catch (e) {
          await uploadFiles(index + 1);

          return true;
        }
      }

      if (file.file && file.file.originalname && file.file.size) {
        const filePath = await StorageS3Service.uploadFile(
          file.file.buffer,
          path.join('files/files', updatedFile.id.toString(), `${updatedFile.id}.${String(file.file.originalname.split('.').pop() || 'unk').toLowerCase()}`),
        );

        if (!filePath) {
          await fileRelation.destroy({
            where: {
              fileId: updatedFile.id,
              [relationKey]: relationId,
            },
          });
          await File.destroy({ where: { id: updatedFile.id } });
        } else {
          await File.update({
            path: `/${filePath}`,
          }, { where: { id: updatedFile.id } });
        }

        try {
          let duration = null;
          if (file.type === FileTypeEnum.Audio) {
            const folderPath = path.resolve(__dirname, '../../..', 'tmp');
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath);
            }
            fs.writeFileSync(
              path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`),
              file.file.buffer,
            );
            duration = await getAudioDurationInSeconds(path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`));
            duration = Math.round(duration);
            fs.rmSync(path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`));
          } else if (file.type === FileTypeEnum.Video) {
            const folderPath = path.resolve(__dirname, '../../..', 'tmp');
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath);
            }
            fs.writeFileSync(
              path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`),
              file.file.buffer,
            );
            duration = await getVideoDurationInSeconds(path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`));
            duration = Math.round(duration);
            fs.rmSync(path.join(folderPath, `${updatedFile.id}.${updatedFile.extension}`));
          }
          await File.update({
            duration,
          }, { where: { id: updatedFile.id } });
        } catch (e) {
          fs.rmSync(path.join(path.resolve(__dirname, '../../..', 'tmp'), `${updatedFile.id}.${updatedFile.extension}`));
          await uploadFiles(index + 1);

          return true;
        }
      }

      await uploadFiles(index + 1);
      return true;
    };

    try {
      await uploadFiles(0);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    // Delete old files
    const oldFiles = await fileRelation.findAll({
      where: {
        fileId: { [Op.notIn]: existsFileIds },
        [relationKey]: relationId,
      },
    });

    const deleteFiles: Promise<boolean>[] = oldFiles.map(
      (oldFile) => StorageS3Service.deleteFile(path.join('files/files/', String(oldFile.get('fileId')))),
    );
    Promise.all(deleteFiles);

    const deleteFileIds: number[] = oldFiles.map((oldFile) => oldFile.get('fileId') as number);

    await fileRelation.destroy({
      where: {
        fileId: { [Op.notIn]: existsFileIds },
        [relationKey]: relationId,
      },
    });
    await File.destroy({ where: { id: { [Op.in]: deleteFileIds } } });
  }

  public static async deleteFiles(
    relationId: number,
    relationKey: string,
    fileRelation: Repository<FileArticle | FileExercise | FileMeal>,
  ) {
    const oldFiles = await fileRelation.findAll({
      where: {
        [relationKey]: relationId,
      },
    });
    const deleteFiles: Promise<boolean>[] = oldFiles.map(
      (oldFile) => StorageS3Service.deleteFile(path.join('files/files/', String(oldFile.get('fileId')))),
    );
    Promise.all(deleteFiles);

    const deleteFileIds: number[] = oldFiles.map((oldFile) => oldFile.get('fileId') as number);

    await fileRelation.destroy({
      where: {
        [Op.or]: [
          { [relationKey]: relationId },
          { fileId: { [Op.in]: deleteFileIds } },
        ],
      },
    });
    await File.destroy({ where: { id: { [Op.in]: deleteFileIds } } });
  }

  public static async uploadFile(recordId: number, fileDto: UploadFileDto): Promise<string> {
    const fileName = `${fileDto.attribute}-${uuidv4()}.${fileDto.file.originalname.split('.').pop().toLowerCase()}`;

    const filePath = await StorageS3Service.uploadFile(
      fileDto.file.buffer,
      path.join('files', fileDto.folder, `${recordId}`, fileName),
    );

    return `/${filePath}`;
  }

  public static async deleteFile(filePath: string): Promise<boolean> {
    const result = await StorageS3Service.deleteFile(filePath);

    return result;
  }
}
