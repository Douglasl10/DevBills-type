import { useEffect, useState } from "react";
import MonthYearSelect from "../components/MonthYearSelect";
import {
	getTransactionsMontly,
	getTransactionsSummary,
} from "../services/transactionService";
import type { MontlyItem, TransactionSummary } from "../types/transaction";
import Card from "../components/Card";
import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formater";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { LabelProps } from "recharts";

const initialSummary: TransactionSummary = {
	balance: 0,
	totalIncomes: 0,
	totalExpenses: 0,
	expensesByCategory: [],
};

const Dashboard = () => {
	const currentDate = new Date();
	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
	const [montlyItemsData, setMontlyItemsData] = useState<MontlyItem[]>([]);

	useEffect(() => {
		async function loadTrasactionsSummary() {
			const response = await getTransactionsSummary(month, year);
			setSummary(response);
		}
		loadTrasactionsSummary();
	}, [month, year]);

	useEffect(() => {
		async function loadTrasactionsMontly() {
			const response = await getTransactionsMontly(month, year, 4);
			setMontlyItemsData(response.history);
		}
		loadTrasactionsMontly();
	}, [month, year]);

	const renderPieChartLabel = ({ name, percent }: LabelProps) => {
		return `${name} - ${(percent * 100).toFixed(1)}%`;
	};

	const formatToolTipValue = (value: number | string): string => {
		return formatCurrency(typeof value === "number" ? value : 0);
	};

	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0 text-primary-500 uppercase">
					Dashboard
				</h1>
				<MonthYearSelect
					month={month}
					onMonthChange={setMonth}
					year={year}
					onYearChange={setYear}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card
					icon={<Wallet size={20} className="text-primary-500" />}
					title="Saldo"
					hover={true}
					glowEffect={summary.balance > 0}
				>
					<p
						className={`text-2xl font-semibold mt-2
				${summary.balance > 0 ? "text-green-500" : "text-red-600"}
				
				`}
					>
						{formatCurrency(summary.balance)}
					</p>
				</Card>

				<Card
					icon={<ArrowUp size={20} className="text-primary-500" />}
					title="Receitas"
					hover={true}
					glowEffect={true}
				>
					<p className={`text-2xl font-semibold mt-2 text-green-500`}>
						{formatCurrency(summary.totalIncomes)}
					</p>
				</Card>

				<Card
					icon={<Wallet size={20} className="text-red-600" />}
					title="Despesas"
					hover={true}
					glowEffect={summary.totalExpenses > 0}
				>
					<p className={`text-2xl font-semibold mt-2 text-red-600`}>
						{formatCurrency(summary.totalExpenses)}
					</p>
				</Card>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
				<Card
					icon={<TrendingUp size={20} className="text-primary-500" />}
					title="Despesas por Categorias"
					className="min-h-[300px]"
					hover={true}
				>
					{summary.expensesByCategory.length > 0 ? (
						<div className="height-72">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={summary.expensesByCategory}
										cx="50%"
										cy="50%"
										outerRadius={80}
										dataKey="amount"
										nameKey="categoryName"
										label={renderPieChartLabel}
									>
										{summary.expensesByCategory.map((entry) => (
											<Cell key={entry.categoryId} fill={entry.categoryColor} />
										))}
									</Pie>
									<Tooltip formatter={formatToolTipValue} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="flex justify-center items-center h-65 text-gray-500">
							Nenhuma despesa registrada
						</div>
					)}
				</Card>

				<Card
					icon={<Calendar size={20} className="text-primary-500" />}
					title="Historico Mensal"
					className="min-h-80 p-2.5"
					hover={true}
					glowEffect={true}
				>
					<div className="h-72 mt-4">
						{montlyItemsData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={montlyItemsData} margin={{ left: 40 }}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="rgba(255, 255, 255, 0.1)"
									/>
									<XAxis
										dataKey="name"
										stroke="#9aa3b8"
										tick={{ style: { textTransform: "capitalize" } }}
									/>
									<YAxis
										stroke="#9aa3b8"
										tickFormatter={formatCurrency}
										tick={{ style: { fontSize: "12px" } }}
									/>
									<Tooltip
										formatter={formatCurrency}
										contentStyle={{
											backgroundColor: "#1a1a1a",
											borderColor: "#2a2a2a",
										}}
										labelStyle={{ color: "#f8f8f8" }}
									/>
									<Legend />
									<Bar
										dataKey="expense"
										name="Despesas"
										stackId="a"
										fill="#de0232"
									/>
									<Bar dataKey="income" fill="#00fc32" name="Receitas" />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="flex justify-center items-center h-65 text-gray-500">
								Nenhuma despesa registrada
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
