interface FetchResponse<T = any> {
  data?: T;
  error?: string | {error : string};
  status?: number;
}

const fetchData = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any,
  token?: string
): Promise<FetchResponse<T>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: data ? JSON.stringify(data) : undefined, 
    });

    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { error: await response.text() };

       return { error: errorData, status: response.status };
    }

    const responseData = contentType?.includes("application/json") ? await response.json() : null;
    return { data: responseData as T, status: response.status };
  } catch (error) {

    return { error: (error as Error).message };
  }
};

export const postData = <T>(url: string, data: any, token?: string) => fetchData<T>(url, "POST", data, token);
export const putData = <T>(url: string, data: any, token?: string) => fetchData<T>(url, "PUT", data, token);
export const getData = <T>(url: string, token?: string) => fetchData<T>(url, "GET", undefined, token);
export const deleteData = <T>(url: string, token?: string) => fetchData<T>(url, "DELETE", undefined, token);
