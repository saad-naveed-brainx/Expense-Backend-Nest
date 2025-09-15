import { Controller, Get, Param, Post, Body, Req, Delete, Put } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Expense } from 'src/models/expense.schema';

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
        return this.expenseService.getDashboardData(req['user'] as CreateUserDto);
    }

    @Get('/all')
    getAllExpenses(@Req() req: Request): Promise<Expense[] | []> {
        return this.expenseService.getAllExpenses(req['user'] as CreateUserDto);

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
