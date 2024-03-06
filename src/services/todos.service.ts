import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { TodosRepository } from '../repositories/todos.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @Inject('ACCESS_TOKEN') private accessToken: string,
    @InjectRepository(Todo) private todosDBRepository: Repository<Todo>,
    private todosRepository: TodosRepository,
  ) {}

  // getTodos() {
  //   return this.accessToken === 'EstaEsMiClaveSecreta'
  //     ? this.todosRepository.getTodos()
  //     : 'No tienes acceso a esta información';
  // }

  getTodos() {
    return this.todosDBRepository.find({
      relations: ['files'],
    });
  }

  getTodoById(id: number) {
    return 'Este es el todo con id ' + id;
  }

  findById(id: number) {
    return this.todosDBRepository.findOneBy({ id });
  }

  create(todo: Todo) {
    return this.todosDBRepository.save(todo);
  }
}
