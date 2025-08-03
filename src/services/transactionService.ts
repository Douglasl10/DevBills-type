import type {
	CreateTransactionDTO,
	MontlyItem,
	Transaction,
	TransactionFilter,
	TransactionSummary,
} from "../types/transaction";
import { api } from "./api";

export const getTransactions = async (
	filter?: Partial<TransactionFilter>,
): Promise<Transaction[]> => {
	const response = await api.get<Transaction[]>("/transactions", {
		params: filter,
	});
	return response.data;
};

export const getTransactionsSummary = async (
	month: number,
	year: number,
): Promise<TransactionSummary> => {
	const response = await api.get<TransactionSummary>("/transactions/summary", {
		params: {
			month: String(month).padStart(2, "0"),
			year,
		},
	});
	return response.data;
};

export const getTransactionsMontly = async (
	month: number,
	year: number,
	months?: number,
): Promise<{ history: MontlyItem[] }> => {
	const response = await api.get("/transactions/historical", {
		params: {
			month,
			year,
			months,
		},
	});
	return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
	await api.delete(`/transactions/${id}`);
};

export const createTransaction = async (
	transaction: CreateTransactionDTO,
): Promise<Transaction> => {
	const response = await api.post<Transaction>("/transactions", transaction);
	return response.data;
};
