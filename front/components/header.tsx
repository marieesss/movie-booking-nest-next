"use client";

import React, { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si un token est présent
    const token = getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    removeAuthToken(); // Supprimer le token
    setIsAuthenticated(false);
    router.push("/"); // Redirection vers l'accueil
  };

  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🎬 Mon Cinéma</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">Accueil </Link>
          </li>
          <li>
            <Link href="/movies" className="hover:underline">Films</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/reservations" className="hover:underline">Réservations</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                Se connecter
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
