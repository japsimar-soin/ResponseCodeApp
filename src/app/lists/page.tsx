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
  updateDoc,
} from "firebase/firestore";
import ListCard from "../../components/ListCard";
import Sortable from "sortablejs";

interface List {
  id: string;
  name: string;
  imageLinks: string[];
  responseCodes: number[];
  favoriteImages: string[]; 
  tags: string[]; 
  isFavorite: boolean; // Is list a favorite
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

  const handleReorder = (listId: string, newOrder: string[]) => {
    const listRef = doc(db, "lists", listId);
    updateDoc(listRef, { imageLinks: newOrder });
  };

  useEffect(() => {
    lists.forEach((list) => {
      const el = document.getElementById(`sortable-${list.id}`);
      if (el) {
        Sortable.create(el, {
          animation: 150,
          onEnd: () => {
            const newOrder = Array.from(el.children).map(
              (child) => (child as HTMLElement).dataset.src || ""
            );
            handleReorder(list.id, newOrder);
          },
        });
      }
    });
  }, [lists]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lists</h1>
      {lists.map((list) => (
        <div key={list.id}>
          <div id={`sortable-${list.id}`} className="sortable-list">
            {list.imageLinks.map((imgSrc, index) => (
              <div
                key={index}
                data-src={imgSrc}
                className="sortable-item bg-gray-200 p-2 mb-2 rounded"
              >
                <ListCard list={list} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
