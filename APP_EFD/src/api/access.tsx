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
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        const errorData: ApiError = result;
        throw new Error(errorData.detail || `Error POST: ${response.statusText}`);
    }
    return result as ApiResponse<T>;
}

export async function methodPUT<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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