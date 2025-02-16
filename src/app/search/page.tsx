"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Filter from "@/components/Filter";
import ImageGrid from "@/components/ImageGrid";

export default function Search() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/proxy?filter=${filter}`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const saveList = async () => {
    if (user) {
      await addDoc(collection(db, "lists"), {
        userId: user.uid,
        name: `List ${new Date().toLocaleString()}`,
        responseCodes: [filter],
        imageLinks: images,
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <Filter filter={filter} setFilter={setFilter} onSearch={fetchImages} />
      <button
        onClick={saveList}
        className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Save List
      </button>
      <ImageGrid images={images} />
    </div>
  );
}