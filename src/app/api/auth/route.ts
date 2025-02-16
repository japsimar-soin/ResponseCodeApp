import { auth } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { email, password } = await req.json();
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return NextResponse.json({ user: userCredential.user }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 400 }
		);
	}
}
