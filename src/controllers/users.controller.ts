import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersDbService } from '../services/usersDb.service';
import { AuthGuard } from '../guards/usersAuth.guard';
import { DateAdderInterceptor } from '../interceptors/dateAdder.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../services/cloudinary.service';
import { AuthService } from '../services/auth.service';
// import { User as UserEntity } from 'src/entities/user.entity';
import { UsersBodyDto, UsersCredentialsDto } from '../dtos/usersBody.dto';
import { MinSizeValidationPipe } from '../pipes/MinSizeValidator.pipe';
import { Express } from 'express';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersDbService: UsersDbService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService,
  ) {}

  @Get('auth0/protected')
  getAuth0Protected(@Req() request) {
    return JSON.stringify(request.oidc.user);
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Esta es una ruta protegida';
  }

  @Get()
  getUsers(@Query('name') name: string) {
    if (name) {
      return this.usersService.getByName(name);
    }
    return this.usersService.getUsers();
  }

  // @Get('profile')
  // getProfile(@Headers('token') token: string) {
  //   if (token !== '1234') {
  //     return 'No tienes acceso';
  //   }
  //   return 'Este es el perfil del usuario';
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() request) {
    return `Este es el perfil del usuario ${request.user.email} tu token expira en ${request.user.exp}`;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile/images')
  getProfilePics() {
    return 'Esta ruta devuelve las imágenes del perfil del usuario';
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(MinSizeValidationPipe)
  async uploadProfilePic(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'El archivo debe ser menor a 100 Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadImage(file);
  }

  @HttpCode(418)
  @Get('coffee')
  makeCoffee() {
    return 'No puedo preparar cafe! Soy una tetera!';
  }

  @Get('message')
  getMessage(@Res() response) {
    response.status(200).send('Este es un mensaje');
  }

  @Get('request')
  getRequest(@Req() request) {
    console.log(request);
    return 'Esta ruta devuelve el request';
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(@Body() user: UsersBodyDto, @Req() request) {
    const modifiedUser = { ...user, createdAt: request.createdAt };

    return this.authService.signup(modifiedUser);
  }

  @Post('signin')
  async signin(@Body() user: UsersCredentialsDto) {
    return this.authService.signin(user.email, user.password);
  }

  @Put()
  updateUser() {
    return 'Esta ruta actualiza un usuario';
  }

  @Delete()
  deleteUser() {
    try {
      throw new Error();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de café fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersDbService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
