import { db } from "../../../../firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { userId, name, responseCodes, imageLinks } = await req.json();
	try {
		const docRef = await addDoc(collection(db, "lists"), {
			userId,
			name,
			responseCodes,
			imageLinks,
			createdAt: new Date(),
		});
		return NextResponse.json({ id: docRef.id }, { status: 200 });
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

export async function DELETE(req: Request) {
	const { id } = await req.json();
	try {
		await deleteDoc(doc(db, "lists", id));
		return NextResponse.json({ success: true }, { status: 200 });
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
