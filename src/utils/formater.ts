export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};

export const formatDate = (date: Date | string): string => {
	const dataObj = date instanceof Date ? date : new Date(date);
	return new Intl.DateTimeFormat("pt-BR").format(dataObj);
};
