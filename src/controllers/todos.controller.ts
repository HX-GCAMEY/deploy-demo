import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TodosService } from '../services/todos.service';
import { FileService } from '../services/file.service';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(
    private todosService: TodosService,
    private fileService: FileService,
  ) {}
  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getTodoById(@Param('id') id: number) {
    console.log(typeof id);
    return `Este es el todo con id ${id}`;
  }

  @Post()
  createTodo(@Body() todo: any) {
    return this.todosService.create(todo);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const todo = await this.todosService.findById(id);

    return this.fileService.saveFile(
      file.originalname,
      file.mimetype,
      file.buffer,
      todo,
    );
  }
}
