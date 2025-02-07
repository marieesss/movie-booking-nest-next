"use client";

import React, { useEffect, useState } from "react";
import { deleteReservation, getAllReservations } from "@/api/reservations";
import { fetchMovieById } from "@/api/movies";
import { getAuthToken } from "@/utils/cookies";

const ReservationsTable = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getAuthToken();
  if (!token) {
    setError("Utilisateur non authentifié.");
    setLoading(false);
    return;
  }

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);



    try {
      const result = await getAllReservations(token);
      if (!result.success) {

          const errorMessage =
          typeof result.error === "object" && "error" in result.error
            ? result.error.error
            : result.error;
        setError(errorMessage || "Erreur lors de la récupération des réservations.");
      } else {
        // Récupérer les détails des films pour chaque réservation
        const reservationsWithMovies = await Promise.all(
          result.data.map(async (reservation: any) => {
            const movieDetails = await fetchMovieById(token, reservation.movieid);
            return {
              ...reservation,
              movieTitle: movieDetails.success ? movieDetails.data.title : "Film inconnu",
            };
          })
        );

        setReservations(reservationsWithMovies);
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      console.error("Erreur API:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
 
    fetchReservations();
  }, []);

  
  const CancelBooking = async (id : string) =>{
    const result = await deleteReservation(id, token)

    if (!result.success) {
        const errorMessage =
          typeof result.error === "object" && "error" in result.error
            ? result.error.error
            : result.error;
        console.error(errorMessage)
        return;
      }
      
      if (result.data) {

        console.log(result.data)
        fetchReservations()
    
      }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Liste des Réservations</h2>

      {loading && <p className="text-center text-gray-600">Chargement...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Nom du Film</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Heure</th>
                <th className="px-4 py-2">Annuler</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{reservation.movieTitle || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(reservation.bookingSlot).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(reservation.bookingSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="px-4 py-2">
                    <button onClick={()=>CancelBooking(reservation.id)}> X </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">Aucune réservation trouvée.</p>
      )}
    </div>
  );
};

export default ReservationsTable;
