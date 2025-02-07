"use client";

import React, { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";

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
            <a href="/" className="hover:underline">Accueil</a>
          </li>
          <li>
            <a href="/movies" className="hover:underline">Films</a>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <a href="/reservations" className="hover:underline">Réservations</a>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <a href="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                Se connecter
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
