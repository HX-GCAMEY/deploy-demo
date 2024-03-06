import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { Todo } from '../entities/todo.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async saveFile(
    name: string,
    mimeType: string,
    data: Buffer,
    todo: Todo,
  ): Promise<File> {
    const file = new File();
    file.name = name;
    file.mimeType = mimeType;
    file.data = data;
    file.todo = todo;

    return this.fileRepository.save(file);
  }
}
