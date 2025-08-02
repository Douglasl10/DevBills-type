import { type ReactNode, type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: ReactNode;
	fullWidth?: boolean;
	label?: string;
	error?: string;
	id?: string;
}

const Input = ({
	icon,
	fullWidth,
	label,
	error,
	id,
	className,
	...rest
}: InputProps) => {
	const generateId = useId();
	const inputId = generateId || id;

	return (
		<div className={`mb-4 ${fullWidth ? "w-full" : ""}`}>
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-50 mb-2"
				>
					{label}
				</label>
			)}
			<div className="relative">
				{icon && (
					<div className="absolute bottom-0 top-5.5 left-0 pl-3 flex items-center cursor-pointer text--gray-400">
						<span>{icon}</span>
					</div>
				)}
			</div>
			<input
				className={`block w-full rounded-xl border ${error ? "border-red-700" : "border-gray-700"} bg-gray-800 px-4 py-3 
				text-sm text-gray-50 transition-all focus:outline-none focus:ring-2
				${error ? "focus:border-red-700 focus:ring-red-500/2" : "focus:border-primary-600 focus:ring-primary-500/2"}
				${icon ? "pl-10" : ""}
				${className}
				`}
				{...rest}
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
};

export default Input;
