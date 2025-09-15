export class CreateExpenseDto {
    amount: number;
    date: Date;
    category: string;
    description: string;
    title: string;
    reimbursable: boolean;
    type: string;
}