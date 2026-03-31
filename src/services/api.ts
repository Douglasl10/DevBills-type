import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { firebaseAuth } from "../config/firebase";
import { toast } from "react-toastify";

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 30000,
});

// Adicionando uma configuração de retry personalizada
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

api.interceptors.request.use(
	async (
		config: InternalAxiosRequestConfig,
	): Promise<InternalAxiosRequestConfig> => {
		// Inicializa o contador de retries se não existir
		const extendedConfig = config as InternalAxiosRequestConfig & { _retryCount?: number };
		if (extendedConfig._retryCount === undefined) {
			extendedConfig._retryCount = 0;
		}

		const user = firebaseAuth.currentUser;
		if (user) {
			try {
				const token = await user.getIdToken();
				config.headers = config.headers || {};
				config.headers["Authorization"] = `Bearer ${token}`;
			} catch (error) {
				console.error("Erro ao obter o token de autenticação:", error);
			}
		}
		return config;
	},
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error.config;

		// Se não houver config ou se o erro não for de timeout, rejeita imediatamente
		if (!config || (error.code !== "ECONNABORTED" && !error.message.includes("timeout"))) {
			return Promise.reject(error);
		}

		// Lógica de retry para timeouts (comum em cold starts de backends gratuitos)
		if (config._retryCount < MAX_RETRIES) {
			config._retryCount += 1;
			console.warn(`Tentativa de reconexão ${config._retryCount}/${MAX_RETRIES} após timeout...`);

			// Espera um pouco antes de tentar novamente
			await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
			return api(config);
		}

		// Se todas as tentativas falharem, exibe o erro visual
		toast.error("O servidor está demorando muito para responder. Por favor, verifique sua conexão ou tente novamente mais tarde.");
		console.error("A requisição excedeu o tempo limite (timeout) após múltiplas tentativas.");

		return Promise.reject(error);
	},
);
