import { Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";
import { ExpenseDocument, Expense } from "../models/expense.schema";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { UserDocument, User } from "src/models/user.schema";
@Injectable()
export class ExpenseService {
    constructor(@InjectModel(Expense.name) private ExpenseModel: Model<ExpenseDocument>, @InjectConnection() private connection: Connection, @InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async create(expense: CreateExpenseDto, user: CreateUserDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const expenseModel = new this.ExpenseModel(expense);
            const userModel = new this.UserModel(user);
            expenseModel.userId = userModel._id;
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