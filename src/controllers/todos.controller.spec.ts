import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from '../services/todos.service';
import { FileService } from '../services/file.service';
import { Todo } from '../entities/todo.entity';
import { Readable } from 'stream';

describe('TodosController', () => {
  let mockController: TodosController;
  let mockTodosService: Partial<TodosService>;
  let mockFileService: Partial<FileService>;

  const mockTodo: Partial<Todo> = {
    title: 'Todo 1',
    description: 'Description 1',
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'example',
    originalname: 'example.txt',
    encoding: 'utf-8',
    mimetype: 'text/plain',
    size: 0,
    buffer: Buffer.from([]),
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  };

  beforeEach(async () => {
    mockTodosService = {
      getTodos: (): Promise<Todo[]> =>
        Promise.resolve([{ ...mockTodo, id: 1, isCompleted: false } as Todo]),
      findById: (id: number): Promise<Todo> =>
        Promise.resolve({ ...mockTodo, id, isCompleted: true } as Todo),
      create: (todo: Partial<Todo>): Promise<Todo> =>
        Promise.resolve({
          ...todo,
          id: 1,
          isCompleted: false,
        } as Todo),
    };
    mockFileService = {
      saveFile: () =>
        Promise.resolve({
          id: 1,
          name: 'example.txt',
          mimeType: 'text/plain',
          data: Buffer.from([]),
          todo: {
            ...mockTodo,
            id: 1,
            isCompleted: false,
          } as Todo,
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    mockController = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(mockController).toBeDefined();
  });

  it('getTodos() should return an array of todos', async () => {
    const todos = await mockController.getTodos();

    expect(todos).toEqual([
      {
        id: 1,
        title: 'Todo 1',
        description: 'Description 1',
        isCompleted: false,
      },
    ]);
  });

  it('createTodo() should create a new todo', async () => {
    const todo = await mockController.createTodo(mockTodo);
    expect(todo).toEqual({
      id: 1,
      title: 'Todo 1',
      description: 'Description 1',
      isCompleted: false,
    });
  });

  it('uploadFile() should upload a file', async () => {
    const file = await mockController.uploadFile(1, mockFile);

    expect(file).toEqual({
      id: 1,
      name: 'example.txt',
      mimeType: 'text/plain',
      data: Buffer.from([]),
      todo: {
        id: 1,
        title: 'Todo 1',
        description: 'Description 1',
        isCompleted: false,
      },
    });
  });
});
