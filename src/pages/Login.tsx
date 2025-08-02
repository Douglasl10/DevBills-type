import { useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
const Login = () => {
	const navigate = useNavigate();
	const { signWithGoogle, authState } = useAuth();
	const handleLoogin = async () => {
		try {
			await signWithGoogle();
		} catch (err) {
			console.log(err);
			console.error("erro ao fazer login com o google", err);
		}
	};

	useEffect(() => {
		if (authState.user && !authState.isLoading) {
			navigate("/dashboard");
		}
	}, [authState.user, authState.isLoading, navigate]);

	return (
		<div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<header>
					<h1 className="text-4xl font-bold text-center text-gray-900">
						<span className="text-primary-500">DevBills</span>
					</h1>
					<p className="mt-2 text-center text-sm text-gray-600">
						Gerencie suas finanças de forma simples e eficiente.
					</p>
				</header>

				<main className="mt-8 space-y-6 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
					<section className="mb-6">
						<h2 className="text-lg font-medium text-gray-900">
							Faça Login para continuar
						</h2>
						<p className="mt-1 text-sm text-gray-600">
							Acesse sua conta e comece a gerenciar suas finanças.
						</p>
					</section>

					<GoogleLoginButton onClick={handleLoogin} isLoading={false} />
					{authState.or && (
						<div className="bg-red-50 text-center text-red-700 mt-4">
							<p>{authState.or} Erro no Sistema</p>
						</div>
					)}

					<footer className="mt-6 text-center text-sm text-gray-500">
						Ao fazer login, você concorda com nossos Termos de Serviço e
						Política de Privacidade.
					</footer>
				</main>
			</div>
		</div>
	);
};

export default Login;
