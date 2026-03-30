import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { firebaseAuth } from "../config/firebase";

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 30000,
});
console.log(import.meta.env.VITE_API_URL);

api.interceptors.request.use(
	async (
		config: InternalAxiosRequestConfig,
	): Promise<InternalAxiosRequestConfig> => {
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
	(error) => {
		if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
			console.error("A requisição excedeu o tempo limite (timeout). Verifique sua conexão ou tente novamente mais tarde.");
		}
		return Promise.reject(error);
	},
);
