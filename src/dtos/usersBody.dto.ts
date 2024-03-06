import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { PickType } from '@nestjs/swagger';
// import { ApiProperty } from '@nestjs/swagger';

// export class UsersBodyDto {
//   @ApiProperty({
//     description:
//       'Asignada por la base de datos al momento de crear el usuario en forma de UUID',
//   })
//   id: string;

//   @ApiProperty({
//     description:
//       'Asignada por default al momento de crear el usuario por el interceptor DateAdderInterceptor',
//   })
//   createdAt?: string;

//   @ApiProperty({
//     description:
//       'Asignada por default al momento de crear el usuario, no debe ser incluida en el body',
//     default: false,
//   })
//   @IsEmpty()
//   isAdmin?: boolean;

//   @ApiProperty({
//     description: 'Debe ser mayor a 5 caracteres',
//   })
//   @IsNotEmpty()
//   @IsString()
//   @MinLength(5)
//   password: string;

//   @ApiProperty({
//     description: 'Debe ser mayor a 3 caracteres',
//     example: 'Bartolomiau',
//   })
//   @IsNotEmpty()
//   @IsString()
//   @MinLength(3)
//   name: string;

//   @ApiProperty({
//     description: 'Debe ser un email válido',
//   })
//   @IsNotEmpty()
//   @IsEmail()
//   email: string;
// }

export class UsersBodyDto {
  /**
   * Asignada por la base de datos al momento de crear el usuario en forma de UUID
   * @example
   */
  id: string;

  /**
   * Asignada por default al momento de crear el usuario por el interceptor DateAdderInterceptor
   * @example
   */
  createdAt?: string;

  /**
   * Asignada por default al momento de crear el usuario, no debe ser incluida en el body
   * @default false
   * @example
   */
  @IsEmpty()
  isAdmin?: boolean;

  /**
   * Debe ser mayor a 5 caracteres
   * @example 'password12345'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  /**
   * Debe ser mayor a 3 caracteres
   * @example 'Bartolomiau'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  /**
   * Debe ser un email válido
   * @example 'bar@gmail.com'
   */

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UsersCredentialsDto extends PickType(UsersBodyDto, [
  'password',
  'email',
]) {}
