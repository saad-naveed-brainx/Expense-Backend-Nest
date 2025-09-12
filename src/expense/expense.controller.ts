import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { Expense } from './interfaces/cat.interface';
import { Expense as ExpenseSchema } from './expense.schema';

@Controller('expense')
export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    @Get()
    findAll(): void {
        console.log("This action will return all expenses");
        this.expenseService.findAll();
    }

    @Post('/create')
    create(@Body() dto: CreateExpenseDto): void {
        console.log("This is the dto recieved in controller function:", dto);
        this.expenseService.create(dto as ExpenseSchema);
    }

    @Get('filtered')
    async findAllFiltered(@Query('type') type: string, @Query('category') category: string): Promise<any> {
        console.log("This is the type:", type);
        console.log("This is the category:", category);
        return "this action will return expenses based on types and categories";
    }

    @Get(":id")
    findOne(@Param() params: any): string {
        console.log(params.id);
        return 'This action will return an expense of specific id';
    }
}
