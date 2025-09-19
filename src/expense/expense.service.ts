import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";
import { ExpenseDocument, Expense } from "../models/expense.schema";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { UsersService } from "../users/users.service";
import { QueryDto } from "./dto/query.dto";
@Injectable()
export class ExpenseService {
    constructor(@InjectModel(Expense.name) private ExpenseModel: Model<ExpenseDocument>, @InjectConnection() private connection: Connection, private readonly usersService: UsersService) { }

    async create(expense: CreateExpenseDto, user: CreateUserDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const expenseModel = new this.ExpenseModel(expense);
            const userModel = await this.usersService.findByEmail(user.email);
            if (!userModel) {
                throw new BadRequestException('User not found');
            }
            expenseModel.userId = (userModel as any)._id;
            await expenseModel.save({ session });
            await session.commitTransaction();
            return {
                success: true,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllExpenses(user: CreateUserDto, query: QueryDto) {
        try {
            const userModel = await this.usersService.findByEmail(user.email);
            if (!userModel) {
                throw new BadRequestException('User not found');
            }

            if (query.title == null && query.category == null && query.type == null && query.category == null) {
                console.log("if runs", query)
                const totalExpenses = await this.ExpenseModel.find({ userId: (userModel as any)._id }).sort({ createdAt: -1 });
                const hasMore: boolean = totalExpenses.length > (query.page * query.limit);
                return {
                    expenses: totalExpenses.slice((query.page - 1) * query.limit, query.page * query.limit),
                    hasMore
                };
            }

            const totalExpenses = await this.ExpenseModel.find({ userId: (userModel as any)._id }).sort({ createdAt: -1 });
            // console.log("expenses for page", query.page, "is ", expenses, "and limit is", query.limit)
            const categories = query.category && query.category !== '' ? query.category.split(',') : [];
            const types = query.type && query.type !== '' ? query.type.split(',') : [];
            const hasTitle = query.title && query.title !== '';

            const filteredExpenses = totalExpenses.filter((expense: any) => {
                let matches = true;

                if (hasTitle) {
                    matches = matches && expense.title?.toLowerCase().includes(query.title.toLowerCase());
                }

                if (categories.length > 0) {
                    matches = matches && categories.includes(expense.category);
                }

                if (types.length > 0) {
                    matches = matches && types.includes(expense.type);
                }

                return matches;
            });

            const ExpenseToSend = filteredExpenses.slice((query.page - 1) * query.limit, query.page * query.limit);
            console.log("ExpenseToSend in service class:", ExpenseToSend);
            console.log("filteredExpenses in service class:", filteredExpenses);
            const hasMore = filteredExpenses.length > (query.page * query.limit);
            console.log("hasMore in service class:", hasMore);

            return {
                expenses: ExpenseToSend,
                hasMore
            };
        } catch (error) {
            console.log("error in getAllExpenses in service class:", error);
            throw error;
        }
    }

    async deleteExpense(id: string) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.ExpenseModel.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            return {
                success: true,
            };
        } catch (error) {
            console.log("error in deleteExpense in service class:", error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getExpenseById(id: string) {
        try {
            const expense = await this.ExpenseModel.findById(id).select('-userId');
            return expense;
        } catch (error) {
            console.log("error in getExpenseById in service class:", error);
            throw error;
        }
    }

    async updateExpense(id: string, expense: CreateExpenseDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.ExpenseModel.findByIdAndUpdate(id, expense, { new: true, session });
            await session.commitTransaction();
            return {
                success: true,
            };
        } catch (error) {
            console.log("error in updateExpense in service class:", error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getDashboardData(user: CreateUserDto) {
        try {
            const userModel = await this.usersService.findByEmail(user?.email);

            if (!userModel) {
                throw new BadRequestException('User not found');
            }

            const allTransactions = await this.ExpenseModel.find({ userId: (userModel as any)._id });
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            const last3DaysExpenses: any = allTransactions.filter((transaction: Expense) => transaction.date >= threeDaysAgo);

            let totalIncome = 0;
            let totalExpense = 0;

            allTransactions.forEach(transaction => {
                if (transaction.type.toLowerCase() === 'income') {
                    totalIncome += transaction.amount;
                } else if (transaction.type.toLowerCase() === 'expense') {
                    totalExpense += transaction.amount;
                }
            });

            const totalBalance = totalIncome - totalExpense;

            return {
                calculation: {
                    totalBalance,
                    totalIncome,
                    totalExpense
                },
                graphData: {
                    income: totalIncome,
                    expense: totalExpense
                },
                last3DaysExpenses
            };
        }
        catch (error) {
            console.log("error in getDashboardData in service class:", error);
            throw error;
        }
    }
}