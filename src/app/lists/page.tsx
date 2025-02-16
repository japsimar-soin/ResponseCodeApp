"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../../firebase";
import {
	collection,
	query,
	where,
	onSnapshot,
	deleteDoc,
	doc,
} from "firebase/firestore";
import ListCard from "../../components/ListCard";

interface List {
	id: string;
	name: string;
	imageLinks: string[];
	responseCodes: number[];
}

export default function Lists() {
	const { user } = useAuth();
	const [lists, setLists] = useState<List[]>([]);

	useEffect(() => {
		if (user) {
			const q = query(collection(db, "lists"), where("userId", "==", user.uid));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				setLists(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as List))
				);
			});
			return () => unsubscribe();
		}
	}, [user]);

	const handleDelete = async (id: string) => {
		await deleteDoc(doc(db, "lists", id));
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Lists</h1>
			{lists.map((list) => (
				<ListCard key={list.id} list={list} onDelete={handleDelete} />
			))}
		</div>
	);
}
