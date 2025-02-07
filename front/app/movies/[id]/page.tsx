"use client";

import { fetchMovieById } from '@/api/movies';
import { createReservation } from '@/api/reservations';
import Alerts from '@/components/alerts';
import DateTimePicker from '@/components/datePicker';
import { getAuthToken } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MovieDetail = ({ params }: { params: Promise<{ id: string }> }) => {
      const router = useRouter()
    
    const [movie, setMovie] = useState<any>();
    const [errorMessage, setErrorMessage] = useState<any>();
    const resolvedParams = React.use(params); 
    const [selectedDate, setSelectedDate] = useState<string | null>(null);


    const token = getAuthToken();
    if (!token) {
        setErrorMessage("Utilisateur non authentifié.");
        return;
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(selectedDate){

            const payload = {movieId : parseInt(resolvedParams.id), dateTime : selectedDate }
            const result = await createReservation(payload, token)

            if (!result.success) {

                console.log(result)
            const errorMessage =
                typeof result.error === "object" && "error" in result.error
                ? result.error.error
                : result.error;
            setErrorMessage(errorMessage || "Une erreur est survenue");
            return;
            }else{
                router.push("/movies")
            }
                    
                  

        }


    };



    useEffect(() => {
        getMovieDetails()
    }, [resolvedParams.id, token]);

    const getMovieDetails = async () =>{
        const result = await fetchMovieById(token, parseInt(resolvedParams.id));
            
        if (!result.success) {
        const errorMessage =
            typeof result.error === "object" && "error" in result.error
            ? result.error.error
            : result.error;
        setErrorMessage(errorMessage || "Une erreur est survenue");
        return;
    } 
    if(result.data){
        setMovie(result.data)
    }
    }

    if (!movie) {
        return <p className="text-center mt-4 text-gray-600">Chargement du film...</p>;
      }
    
      return (
        <div className="flex flex-col items-center p-6">
          {/* Affiche du film */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-72 sm:w-96"
          />
    
          {/* Détails du film */}
          <div className="mt-6 max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
            <p className="text-gray-500 text-sm mt-2">{movie.tagline}</p>
            <p className="mt-4 text-gray-700">{movie.overview}</p>
    
            {/* Infos supplémentaires */}
            <div className="mt-6">
              <p className="text-gray-600"><strong>Sortie :</strong> {movie.release_date}</p>
              <p className="text-gray-600"><strong>Durée :</strong> {movie.runtime} min</p>
              <p className="text-gray-600"><strong>Note :</strong> ⭐ {movie.vote_average} / 10 ({movie.vote_count} votes)</p>
            </div>
    
            {/* Genres */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {movie.genres.map((genre: any) => (
                <span key={genre.id} className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {genre.name}
                </span>
              ))}
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
        <DateTimePicker onChange={(date) => setSelectedDate(date)} />

        {errorMessage && <Alerts text={errorMessage} />}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Réserver
        </button>
      </form>
            
          </div>
    
        </div>
      );

}

export default MovieDetail
