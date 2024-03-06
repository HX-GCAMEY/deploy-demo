import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class MinSizeValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const minSize = 10000;

    if (value.size < minSize) {
      throw new BadRequestException('El tamaño del archivo es muy pequeño.');
    }
    return value;
  }
}
