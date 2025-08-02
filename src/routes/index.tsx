import Home from "../pages/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import PrivateRoutes from "./PrivateRotes";
import AppLayout from "../layout/AppLayout";
import Transactios from "../pages/Transactions";
import TransactiosForm from "../pages/TransactionsForm";
import { ToastContainer, type ToastContainerProps } from "react-toastify";

const AppRoutes = () => {
	const toastConfig: ToastContainerProps = {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		newestOnTop: true,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		theme: "colored",
	};

	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

					<Route element={<PrivateRoutes />}>
						<Route element={<AppLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/transacoes" element={<Transactios />} />
							<Route path="/transacoes/nova" element={<TransactiosForm />} />
						</Route>
					</Route>

					<Route path="*" element={<h1>Page not found</h1>} />
				</Routes>
			</AuthProvider>
			<ToastContainer {...toastConfig} />
		</BrowserRouter>
	);
};

export default AppRoutes;
