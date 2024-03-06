import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  createdAt: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin?: boolean;
}
