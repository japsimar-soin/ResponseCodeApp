// app/auth/signup/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../../firebase";
import { useRouter } from "next/navigation";

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			router.push("/search");
		} catch (error) {
			console.error(error);
		}
	};

	const handleGoogleSignup = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log("Google User:", user);
			router.push("/search");
		} catch (error) {
			console.error("Google signup error:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-2xl font-bold mb-4">Signup</h1>
			<form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="mb-4 p-2 border rounded w-full"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mb-4 p-2 border rounded w-full"
				/>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
				>
					Signup
				</button>
			</form>

			<button
				type="button"
				onClick={handleGoogleSignup}
				className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
			>
				Signup with Google
			</button>
		</div>
	);
}
