import { deleteData, getData, postData } from "./api";

export const createReservation = async (payload : {movieId : number, dateTime : string} , token : string) => {
    const response = await postData<any>(`reservations`, payload, token);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};



export const getAllReservations = async (token : string) => {
    const response = await getData<any>(`reservations`, token);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};




export const deleteReservation = async (id : string, token : string) => {
    const response = await deleteData<any>(`reservations/${id}`, token);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};