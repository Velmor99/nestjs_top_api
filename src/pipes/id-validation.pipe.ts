import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_NOT_CORRECT_ERROR } from './id-validation.constants';

export class IdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') {
      return value;
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ID_NOT_CORRECT_ERROR);
    }
    return value;
  }
}
