import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { Link } from "react-router";
import MonthYearSelect from "../components/MonthYearSelect";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import Card from "../components/Card";
import { TransactionType, type Transaction } from "../types/transaction";
import {
	deleteTransaction,
	getTransactions,
} from "../services/transactionService";
import Button from "../components/Button";
import { formatCurrency, formatDate } from "../utils/formater";
import { toast } from "react-toastify";

const Transactios = () => {
	const currentDate = new Date();
	const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [deleteId, setDeleteId] = useState<string>("");
	const [searchText, setSearchText] = useState<string>("");
	const [filteredTransactions, setFilteredTransactions] = useState<
		Transaction[]
	>([]);

	const fetchTransactions = async (): Promise<void> => {
		try {
			setLoading(true);
			setError("");
			const data = await getTransactions({ month, year });
			setTransactions(data);
			setFilteredTransactions(data);
		} catch (err) {
			setError("Erro ao buscar transações");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string): Promise<void> => {
		try {
			setDeleteId(id);
			await deleteTransaction(id);
			toast.success("Sucesso ao deletar transação");

			// garante sincronização dos dois estados
			setTransactions((prev) => prev.filter((t) => t.id !== id));
			setFilteredTransactions((prev) => prev.filter((t) => t.id !== id));
		} catch (err) {
			toast.error("Erro ao deletar transação");
			console.error(err);
		} finally {
			setDeleteId("");
		}
	};

	const confirmDelete = (id: string): void => {
		if (window.confirm("Tem Certeza que deseja deletar essa transação?")) {
			handleDelete(id);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, [month, year]);

	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = event.target.value;
		setSearchText(value);
		setFilteredTransactions(
			transactions.filter((transaction) =>
				transaction.description.toUpperCase().includes(value.toUpperCase()),
			),
		);
	};

	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0 text-primary-500 uppercase">
					Transações
				</h1>
				<Link
					to="/transacoes/nova"
					className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center 
                    justify-center hover:bg-primary-600 transition-all"
				>
					<Plus className="mr-2 w-4 h-4" />
					Nova Transação
				</Link>
			</div>
			<Card className="mb-6">
				<MonthYearSelect
					month={month}
					year={year}
					onMonthChange={setMonth}
					onYearChange={setYear}
				/>
			</Card>

			<Card className="mb-6">
				<Input
					placeholder="Pesquisar"
					icon={<Search className="w-4 h-4" />}
					onChange={handleSearchChange}
					value={searchText}
					fullWidth
				/>
			</Card>

			<Card className="overflow-hidden">
				{loading ? (
					<div className="flex justify-center items-center">
						<div className="animate-spin rounded-full border-t-2 border-b-2 border-primary-500 w-10 h-10"></div>
					</div>
				) : error ? (
					<div className="p-8 text-center">
						<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<p>{error}</p>
						<Button onClick={fetchTransactions} className="mx-auto mt-6">
							Tentar Novamente
						</Button>
					</div>
				) : transactions?.length === 0 ? (
					<div className="py-12 items-center">
						<p className=" text-gray-500 mb-4 text-center">
							Nenhuma transação encontrada
						</p>
						<Link
							to="/transacoes/nova"
							className=" w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center 
                    justify-center hover:bg-primary-600 transition-all"
						>
							<Plus className="mr-2 w-4 h-4" />
							Adicionar Transação
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="divide-y divide-gray-700 min-h-full w-full">
							<thead>
								<tr>
									<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Descrição
									</th>
									<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Data
									</th>
									<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Categoria
									</th>
									<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Valor
									</th>
									<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										{" "}
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{filteredTransactions.map((transaction) => (
									<tr
										key={
											transaction.id ||
											`${transaction.description}-${transaction.date}`
										}
										className="hover:bg-gray-800"
									>
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											<div className="flex items-center">
												<div className="mr-2">
													{transaction.type === TransactionType.INCOME ? (
														<ArrowUp className="w-4 h-4 text-primary-600" />
													) : (
														<ArrowDown className="w-4 h-4 text-red-600" />
													)}
												</div>
												<span className="font-medium text-gray-50">
													{transaction.description}
												</span>
											</div>
										</td>
										<td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
											{formatDate(transaction.date)}
										</td>
										<td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
											<div className="flex items-center">
												<div
													className="mr-2 w-2 h-2 rounded-full"
													style={{
														backgroundColor:
															transaction.category?.color || "#999",
													}}
												/>
												<span className="text-sm text-gray-400">
													{transaction.category?.name ?? "Sem categoria"}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
											<span
												className={`${
													transaction.type === TransactionType.INCOME
														? "text-green-600"
														: "text-red-700"
												}`}
											>
												{formatCurrency(transaction.amount)}
											</span>
										</td>
										<td className="px-3 py-4 whitespace-nowrap">
											<button
												type="button"
												onClick={() => confirmDelete(transaction.id)}
												className="text-red-400 hover:text-red-700 rounded-full cursor-pointer"
												disabled={deleteId === transaction.id}
											>
												{deleteId === transaction.id ? (
													<span className="inline-block w-4 h-4 border-2 border-red-500 rounded-full border-t-transparent animate-spin" />
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Transactios;
