import { registerDecorator, ValidationOptions } from 'class-validator';
import mongoose from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return mongoose.Types.ObjectId.isValid(value);
        },
        defaultMessage() {
          return `$property must be a bson object id`;
        },
      },
    });
  };
}
