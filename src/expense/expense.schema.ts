import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type CatDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop({ required: true, unique: true })
    id: string;

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
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);