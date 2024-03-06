import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger';
// import { AuthGuard } from './guards/usersAuth.guard';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config } from './config/auth0';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription(
      'Esta es una API construida con Nest empleada como demos para el modulo 4 de la especialidad Backend de la carrera Fullstack Developer de Henry',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(loggerGlobal);
  // app.useGlobalGuards(new AuthGuard());;
  app.use(auth(config));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert:
            'Se han detectado los siguientes errores en la peticion y te mandamos este mensaje personalizado',
          errors: cleanErrors,
        });
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
