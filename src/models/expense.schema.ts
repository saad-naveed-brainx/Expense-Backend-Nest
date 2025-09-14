import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';


export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    reimbursable: boolean;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true, type: Types.ObjectId, ref: User.name })
    userId: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);