import { Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Expense as ExpenseSchema } from "./expense.schema";
import { Model, Connection } from "mongoose";

@Injectable()
export class ExpenseService {
    constructor(@InjectModel(ExpenseSchema.name) private ExpenseModel: Model<ExpenseSchema>, @InjectConnection() private connection: Connection) { }

    async create(expense: ExpenseSchema) {
        console.log("This is the expense in service class:", expense);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const newExpense = await this.ExpenseModel.create([expense], { session });
            await session.commitTransaction();
            return newExpense;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    findAll() {
        console.log("This is the expenses in service class:");
    }
}