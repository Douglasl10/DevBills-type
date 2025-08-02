import type { Category, CategorySummary } from "./category";

export enum TransactionType {
	INCOME = "income",
	EXPENSE = "expense",
}

export interface CreateTransactionDTO {
	description: string;
	amount: number;
	date: Date | string;
	categoryId: string;
	type: TransactionType;
}

export interface Transaction {
	id: string;
	userId: string;
	description: string;
	amount: number;
	date: Date | string;
	categoryId: string;
	category: Category;
	type: TransactionType;
	updatedAt: Date | string;
	createdAt: Date | string;
}
export interface TransactionFilter {
	month: number;
	year: number;
	categoryId?: string;
	type?: TransactionType;
}

export interface TransactionSummary {
	totalIncomes: number;
	totalExpenses: number;
	balance: number;
	expensesByCategory: CategorySummary[];
}

export interface MontlyItem {
	name: string;
	expense: number;
	income: number;
}
