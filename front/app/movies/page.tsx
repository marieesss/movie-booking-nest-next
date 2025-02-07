"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchMovies } from "@/api/movies";
import { getAuthToken } from "@/utils/cookies";
import Link from "next/link";

const Movies = () => {
  const [movies, setMovies] = useState<any[]>([]);

  const isMounted = useRef(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if(!isMounted.current){

      const loadMovies = async () => {
        setError(null);
  
        const token = getAuthToken(); // Récupère le token
        if (!token) {
          setError("Utilisateur non authentifié.");
          return;
        }
  
        try {
          const result = await fetchMovies(token);
  
  
           if (!result.success) {
                  const errorMessage =
                    typeof result.error === "object" && "error" in result.error
                      ? result.error.error
                      : result.error;
                  console.error(result)
                  return;
                }
                
                if (result.data) {
  
                  setMovies(result.data.results)
              
                }
            

        } catch (err) {
          setError("Une erreur est survenue.");
          console.error("Erreur de chargement des films:", err);
        }
  
        setLoading(false);
      };
  
      loadMovies();

      isMounted.current = true

    }

  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Films</h1>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {movies?.map((movie, index) => (
          <Link href={`/movies/${movie.id}`}>
          <li key={index} className="p-2 border rounded-md bg-gray-100">
            <h2 className="font-semibold">{movie.title}</h2>
            <p>{movie.original_title}</p>
            <img src={'https://image.tmdb.org/t/p/original/'+ movie.backdrop_path}/>
          </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
