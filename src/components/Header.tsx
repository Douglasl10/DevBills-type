import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";

interface NavLink {
	path: string;
	name: string;
}

const Header = () => {
	const { authState, signOut } = useAuth();
	const { pathname } = useLocation();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const isAuthenticated: boolean = !!authState.user;

	const handleSignOut = (): void => {
		signOut();
		setIsOpen(false);
	};

	const navLink: NavLink[] = [
		{ path: "/dashboard", name: "Dashboard" },
		{ path: "/transacoes", name: "Transações" },
	];

	const changeMenu = (): void => {
		setIsOpen(!isOpen);
	};

	const renderAvatar = () => {
		if (!authState.user) return null;

		if (authState.user.photoURL) {
			return (
				<img
					src={authState.user.photoURL}
					alt={`foto de perfil do(a) ${authState.user.displayName}`}
					className="rounded-full w-8 h-8 border border-gray-700"
				/>
			);
		}
		return (
			<div className="rounded-full w-8 h-8 bg-primary-500 flex items-center justify-center text-white">
				{authState.user.displayName?.charAt(0)}
			</div>
		);
	};

	return (
		<header className="bg-gray-900 border-b border-gray-700">
			<div className="container-app">
				<div className="flex items-center justify-between py-4">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 text-xl text-primary-500 font-bold"
					>
						<Activity className="w-6 h-6" />
						DevBills
					</Link>

					{isAuthenticated && (
						<nav className="hidden md:flex space-x-3">
							{navLink.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={
										pathname == link.path
											? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2 border border-primary-700"
											: "text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-md h-10 px-3 py-2"
									}
								>
									{link.name}
								</Link>
							))}
						</nav>
					)}

					<div className="hidden md:flex items-center space-x-4">
						{isAuthenticated ? (
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									{renderAvatar()}
									<span className="text-sm font-medium text-primary-500">
										{authState.user?.displayName}
									</span>
								</div>

								<button
									onClick={handleSignOut}
									type="button"
									className=" hover:text-red-300 hover:bg-red-500 p-2 rounded-full transition-colors cursor-pointer"
								>
									<LogOut className="text-gray-400" />
								</button>
							</div>
						) : (
							<Link to="/login">
								<LogIn className="bg-primary-500 text-gray-900 font-semibold rounded-xl px-5 py-2.5 flex items-center justify-center hover:bg-primary-500/80 transition-all" />
							</Link>
						)}
					</div>

					<div className="md:hidden flex items-center">
						<button
							type="button"
							onClick={changeMenu}
							className="text-gray-400 hover:bg-gray-800 rounded-lg p-2 transition-colors cursor-pointer"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div>
					<div>
						{isAuthenticated ? (
							<>
								<nav className="space-y-1">
									{navLink.map((link) => (
										<Link
											key={link.path}
											to={link.path}
											className={`block p-5 rounded-lg ${
												pathname == link.path
													? "bg-gray-800 text-primary-500 font-medium"
													: "text-gray-400 hover:bg-gray-800 hover:text-primary-500"
											}`}
											onClick={() => setIsOpen(false)}
										>
											{link.name}
										</Link>
									))}
								</nav>

								<div className="flex item justify-between p-4 border-t border-gray-700">
									<div className="flex items-center space-x-2">
										{renderAvatar()}
										<span className="text-sm font-medium text-primary-500">
											{authState.user?.displayName}
										</span>
									</div>
									<button
										type="button"
										onClick={handleSignOut}
										className="hover:text-red-300 hover:bg-red-500 p-2 rounded-full transition-colors cursor-pointer"
									>
										<LogOut size={20} className="text-gray-400" />
									</button>
								</div>
							</>
						) : (
							<Link
								to="/login"
								className="bg-primary-500 text-gray-800 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600"
								onClick={() => setIsOpen(false)}
							>
								Entrar
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
