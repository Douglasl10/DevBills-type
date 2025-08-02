import {
	useEffect,
	useId,
	useState,
	type ChangeEvent,
	type FormEvent,
} from "react";
import {
	TransactionType,
	type CreateTransactionDTO,
} from "../types/transaction";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import Input from "../components/Input";
import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import Select from "../components/Select";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { createTransaction } from "../services/transactionService";
import { toast } from "react-toastify";

interface FormData {
	description: string;
	amount: number;
	date: string;
	type: TransactionType;
	categoryId: string;
}

const initialFormData = {
	description: "",
	amount: 0,
	date: "",
	type: TransactionType.EXPENSE,
	categoryId: "",
};

const TransactiosForm = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const formId = useId();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async (): Promise<void> => {
			const response = await getCategories();
			setCategories(response);
		};
		fetchCategories();
	}, []);

	const validateForm = (): boolean => {
		if (
			!formData.description ||
			!formData.amount ||
			!formData.date ||
			!formData.categoryId
		) {
			setError("Preencha todos os campos");
			return false;
		}

		if (formData.amount <= 0) {
			setError("O valor deve ser maior que zero");
			return false;
		}

		return true;
	};

	const filteredCategories = categories.filter(
		(category) => category.type === formData.type,
	);

	const handleSubmit = async (
		event: FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (!validateForm()) {
				return;
			}

			const transactionData: CreateTransactionDTO = {
				description: formData.description,
				amount: formData.amount,
				date: `${formData.date}T12:00:00.000Z`,
				type: formData.type,
				categoryId: formData.categoryId,
			};

			await createTransaction(transactionData);
			toast.success("Transação criada com sucesso!");
			navigate("/transacoes");
		} catch (error) {
			setError("Erro ao salvar a transação");
			console.error(error);
			toast.error("Erro ao salvar a transação");
		} finally {
			setLoading(false);
		}
	};

	const handleTransactionType = (itemType: TransactionType) => {
		setFormData((prev) => ({ ...prev, type: itemType }));
	};

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	): void => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => {
		navigate("/");
	};

	return (
		<div className="container-app py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-6 uppercase text-primary-500">
					Nova Transação
				</h1>

				<Card glowEffect>
					{error && (
						<div className="flex items-center p-4 mb-6 bg-red-300 rounded-xl border border-red-700 gap-2">
							<AlertCircle className="w-4 h-4 text-red-700" />
							<p className="text-red-700">{error}</p>
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-4 flex gap-2 flex-col">
							<label htmlFor={formId} className="mb-4">
								Tipo de transação
							</label>
							<TransactionTypeSelector
								id={formId}
								value={formData.type}
								onChange={handleTransactionType}
							/>
						</div>

						<Input
							label="Descrição"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Ex: Almoço, Salário, etc..."
						/>

						<Input
							label="Valor"
							name="amount"
							type="number"
							step={0.01}
							value={formData.amount}
							onChange={handleChange}
							placeholder="R$ 0,00"
							icon={<DollarSign className="w-4 h-4" />}
						/>

						<Input
							label="Data"
							name="date"
							type="date"
							value={formData.date}
							onChange={handleChange}
							icon={<Calendar className="w-4 h-4" />}
						/>

						<Select
							label="Categoria"
							name="categoryId"
							value={formData.categoryId}
							onChange={handleChange}
							icon={<Tag className="w-4 h-4" />}
							options={[
								{ value: "", label: "Selecionar categoria" },
								...filteredCategories.map((category) => ({
									value: category.id,
									label: category.name,
								})),
							]}
						/>

						<div className="flex justify-end space-x-3 mt-2">
							<Button
								variant="outline"
								onClick={handleCancel}
								type="button"
								disabled={loading}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								variant={
									formData.type === TransactionType.EXPENSE
										? "danger"
										: "success"
								}
								disabled={loading}
							>
								{loading ? (
									<div className="flex justify-center items-center">
										<div className="animate-spin rounded-full border-t-2 border-b-2 border-gray-700 w-4 h-4"></div>
									</div>
								) : (
									<Save className="h-4 w-4" />
								)}
								Salvar
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default TransactiosForm;
