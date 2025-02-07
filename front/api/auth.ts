import { postData } from "./api";

export const register = async (payload : {email : string, name : string, surname : string, password : string}) => {
    const response = await postData<{message: string; token: string}>(`auth/register`, payload);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};


export const login = async (payload : {email : string, password : string}) => {
    const response = await postData<{message: string; data: any}>(`auth/login`, payload);
    if (response.error) {
        console.error("Erreur POST:", response.error);
        return { success: false, error: response.error };
    } 

    return { success: true, data: response.data };
};