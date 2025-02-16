"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          HTTP Dog
        </Link>
        <nav>
          {user ? (
            <Link href="/lists" className="hover:underline">
              My Lists
            </Link>
          ) : (
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}