import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
	month: number;
	year: number;
	onMonthChange: (month: number) => void;
	onYearChange: (year: number) => void;
}

const monthNames: readonly string[] = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

const MonthYearSelect = ({
	month,
	onMonthChange,
	onYearChange,
	year,
}: MonthYearSelectProps) => {
	const currentYear = new Date().getFullYear();
	const years: number[] = Array.from(
		{ length: 11 },
		(_, i) => currentYear - 5 + i,
	);

	const handleNextMonth = (): void => {
		if (month === 12) {
			onMonthChange(1);
			onYearChange(year + 1);
		} else {
			onMonthChange(month + 1);
		}
	};

	const handlePreviousMonth = (): void => {
		if (month === 1) {
			onMonthChange(12);
			onYearChange(year - 1);
		} else {
			onMonthChange(month - 1);
		}
	};

	return (
		<div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
			<button
				type="button"
				className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
				aria-label="Mes anterior"
				onClick={handlePreviousMonth}
			>
				<ChevronLeft />
			</button>

			<div className="flex gap-4">
				<label
					className="text-sm font-medium text-gray-400 sr-only"
					htmlFor="month"
				>
					Selecionar mês
				</label>
				<select
					value={month}
					onChange={(e) => onMonthChange(Number(e.target.value))}
					id="month"
					className="bg-gray-800 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus: outline-none focus:ring-1 ring-primary-500"
				>
					{monthNames.map((name, index) => (
						<option key={name} value={index + 1}>
							{name}
						</option>
					))}
				</select>

				<label
					className="text-sm font-medium text-gray-400 sr-only"
					htmlFor="month"
				>
					Selecionar ano
				</label>
				<select
					value={year}
					onChange={(e) => onYearChange(Number(e.target.value))}
					id="year"
					className="bg-gray-800 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus: outline-none focus:ring-1 ring-primary-500"
				>
					{years.map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
				</select>
			</div>
			<button
				type="button"
				className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
				aria-label="Mes anterior"
				onClick={handleNextMonth}
			>
				<ChevronRight />
			</button>
		</div>
	);
};

export default MonthYearSelect;
