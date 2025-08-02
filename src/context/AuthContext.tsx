import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { AuthState } from "../types/auth";
import {
	signInWithPopup,
	onAuthStateChanged,
	signOut as firebaseSignout,
} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";

interface AuthContextProps {
	authState: AuthState;
	signWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthSate] = useState<AuthState>({
		user: null,
		isLoading: true,
		or: null,
	});

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			firebaseAuth,
			(user) => {
				console.log(user);
				if (user) {
					setAuthSate({
						user: {
							uid: user.uid,
							displayName: user.displayName,
							email: user.email,
							photoURL: user.photoURL,
						},
						isLoading: false,
						or: null,
					});
				} else {
					setAuthSate({
						user: null,
						isLoading: false,
						or: null,
					});
				}
			},
			(error) => {
				console.log("error in onAuthStateChanged");
				setAuthSate({ user: null, or: error.message, isLoading: false });
			},
		);

		return () => unsubscribe();
	}, []);

	const signWithGoogle = async (): Promise<void> => {
		setAuthSate((prev) => ({
			...prev,
			Loading: true,
		}));
		try {
			await signInWithPopup(firebaseAuth, googleAuthProvider);
		} catch (err) {
			console.log(err);
			const message =
				err instanceof Error ? err.message : "Erro ao tentar logar";
			setAuthSate((prev) => ({
				...prev,
				Loading: false,
				error: message,
			}));
		}
	};

	const signOut = async (): Promise<void> => {
		setAuthSate((prev) => ({
			...prev,
			Loading: true,
		}));

		try {
			await firebaseSignout(firebaseAuth);
		} catch (err) {
			console.log(err);
			const message =
				err instanceof Error ? err.message : "Erro ao tentar logar";
			setAuthSate((prev) => ({
				...prev,
				Loading: false,
				error: message,
			}));
		}
	};

	return (
		<AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
