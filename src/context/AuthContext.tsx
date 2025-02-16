// src/context/AuthContext.ts
"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Define the type for the context value
interface AuthContextType {
	user: User | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
	user: null,
});

// Define the type for the AuthProvider props
interface AuthProviderProps {
	children: ReactNode;
}

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	// Provide the context value to children
	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
