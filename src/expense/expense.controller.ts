import { Controller, Get, Param, Post, Body, Req, Delete, Put, Query } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { Expense } from '../models/expense.schema';
import { QueryDto } from './dto/query.dto';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    @Post('/create')
    create(@Body() Expensedto: CreateExpenseDto, @Req() req: Request): Promise<{ success: boolean }> {
        return this.expenseService.create(Expensedto, req['user'] as CreateUserDto);
    }

    @Get('/dashboard')
    getDashboardData(@Req() req: Request): any {
        console.log('req is', req['user'])
        return this.expenseService.getDashboardData(req['user'] as CreateUserDto);
    }

    @Get('/all')
    getAllExpenses(@Req() req: Request, @Query() query: QueryDto): Promise<{ expenses: Expense[], hasMore: boolean }> {
        console.log('query is', query)
        return this.expenseService.getAllExpenses(req['user'] as CreateUserDto, query);
    }

    @Get('/:id')
    getExpenseById(@Param('id') id: string): Promise<Expense | null> {
        return this.expenseService.getExpenseById(id);
    }

    @Put('/update/:id')
    updateExpense(@Param('id') id: string, @Body() expense: CreateExpenseDto): Promise<{ success: boolean }> {
        console.log('data is', id, expense)
        return this.expenseService.updateExpense(id, expense);
    }

    @Delete('/delete/:id')
    deleteExpense(@Param('id') id: string): Promise<{ success: boolean }> {
        return this.expenseService.deleteExpense(id);
    }
}
