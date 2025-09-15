import { Module } from "@nestjs/common";
import { ExpenseController } from "./expense.controller";
import { ExpenseService } from "./expense.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Expense, ExpenseSchema } from "../models/expense.schema";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [MongooseModule.forFeature([
        { name: Expense.name, schema: ExpenseSchema },
    ]), UsersModule],
    controllers: [ExpenseController],
    providers: [ExpenseService],
    exports: [ExpenseService],
})

export class ExpenseModule { }