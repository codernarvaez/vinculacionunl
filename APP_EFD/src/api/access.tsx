export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
/**
 * Helper para peticiones HTTP con tipado genérico
 * @template T El tipo de dato que esperamos recibir (Response)
 * @template D El tipo de dato que enviamos (Payload)
 */

export interface ApiResponse<T = unknown> {
    code: number;
    msg: string;    
    data: T | null; 
}

export interface ApiError {
    detail: string;
}

export async function methodGET<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `Error GET: ${response.statusText}`);
    }
    return response.json();
}

export async function methodPOST<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: isFormData ? (data as unknown as BodyInit) : JSON.stringify(data),
    });

    const result = await response.json();

    console.log("Response from POST:", result);

    if (!response.ok) {
        const errorData: ApiError = result;
        if (Array.isArray(errorData.detail)) {
            const messages = errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
            throw new Error(messages);
        }
        throw new Error(errorData.detail || `Error POST: ${response.statusText}`);
    }
    return result as ApiResponse<T>;
}
export async function methodPUT<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: isFormData ? (data as unknown as BodyInit) : JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `Error PUT: ${response.statusText}`);
    }
    return response.json();
}

export async function methodDELETE<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `Error DELETE: ${response.statusText}`);
    }
    return response.json();
}