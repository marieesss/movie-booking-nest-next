import { getData } from "./api";

export const fetchMovies = async (token : string) => {
    const response = await getData<any>('movies', token);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};


export const fetchMovieById = async (token : string, movieId : number) => {
    const response = await getData<any>(`movies/details?movieId=${movieId}`, token);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};