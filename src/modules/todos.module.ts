import { Module } from '@nestjs/common';
import { TodosService } from '../services/todos.service';
import { TodosController } from '../controllers/todos.controller';
import { TodosRepository } from '../repositories/todos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { FileService } from '../services/file.service';
import { File } from '../entities/file.entity';

const ACCESS = 'EstaEsMiClaveSecreta';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, File])],
  controllers: [TodosController],
  providers: [
    TodosService,
    FileService,
    TodosRepository,
    {
      provide: 'ACCESS_TOKEN',
      useValue: ACCESS,
    },
  ],
})
export class TodosModule {}
