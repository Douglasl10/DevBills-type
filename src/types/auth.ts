export interface AuthState {
	user: {
		uid: string;
		displayName: string | null;
		email: string | null;
		photoURL: string | null;
	} | null;
	or: null | string;
	isLoading: boolean;
}
