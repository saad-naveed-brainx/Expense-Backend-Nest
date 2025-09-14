import { Controller, Get, Param, Post, Body, Query, Req } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    @Get()
    findAll(): void {
        console.log("This action will return all expenses");
        this.expenseService.findAll();
    }

    @Post('/create')
    create(@Body() dto: CreateExpenseDto, @Req() req: Request): void {
        this.expenseService.create(dto, req['user'] as CreateUserDto);
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
