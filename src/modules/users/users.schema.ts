import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument, BaseSchemaClass } from 'src/shared/base/base-repository';
import { Gender, Nation, Role } from './users.type';

export type UsersDocument = HydratedDocument<UsersSchemaClass> & BaseDocument;

@Schema({ timestamps: true })
export class UsersSchemaClass extends BaseSchemaClass {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ enum: Nation, required: true })
  nation: Nation;

  @Prop({ enum: Role, required: true })
  role: Role;

  @Prop({ required: true, default: 0 })
  point: number;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(UsersSchemaClass);
