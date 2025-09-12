export class CreateExpenseDto {
    id: string;
    amount: number;
    date: Date;
    category: string;
    description: string;
    title: string;
    reimbursable: boolean;
    type: string;
    createdAt: Date
}