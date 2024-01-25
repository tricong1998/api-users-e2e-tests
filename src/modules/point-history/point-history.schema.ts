import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument, BaseSchemaClass } from 'src/shared/base/base-repository';

export type PointHistoryDocument = HydratedDocument<PointHistorySchemaClass> & BaseDocument;

@Schema({ timestamps: true })
export class PointHistorySchemaClass extends BaseSchemaClass {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  totalPoint: number;

  @Prop({ required: true })
  inputPoint: number;

  @Prop({ required: true })
  balanceBefore: number;

  @Prop({ required: true })
  balanceAfter: number;
}

export const PointHistorySchema = SchemaFactory.createForClass(PointHistorySchemaClass);
