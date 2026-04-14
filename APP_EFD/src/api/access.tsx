export const API_URL = 'https://activate.unl.edu.ec/api';
import { useAuthStore } from '../store/authStore';
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
    detail: string | any[];
}

export class ApiRequestError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiRequestError';
    }
}

export async function methodGET<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        if (response.status === 401) {
            useAuthStore.getState().logout();
        }
        const errorData: ApiError = await response.json();
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : `Error GET: ${response.statusText}`;
        throw new ApiRequestError(errorMessage, response.status);
    }
    return response.json();
}

export async function methodPOST<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: isFormData ? (data as unknown as BodyInit) : JSON.stringify(data),
    });

    const result = await response.json();

    console.log("Response from POST:", result);

    if (!response.ok) {
        if (response.status === 401) {
            useAuthStore.getState().logout();
        }
        const errorData: ApiError = result;
        if (Array.isArray(errorData.detail)) {
            const messages = errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
            throw new ApiRequestError(messages, response.status);
        }
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : `Error POST: ${response.statusText}`;
        throw new ApiRequestError(errorMessage, response.status);
    }
    return result as ApiResponse<T>;
}
export async function methodPUT<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: isFormData ? (data as unknown as BodyInit) : JSON.stringify(data),
    });
    if (!response.ok) {
        if (response.status === 401) {
            useAuthStore.getState().logout();
        }
        const errorData: ApiError = await response.json();
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : `Error PUT: ${response.statusText}`;
        throw new ApiRequestError(errorMessage, response.status);
    }
    return response.json();
}

export async function methodDELETE<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        if (response.status === 401) {
            useAuthStore.getState().logout();
        }
        const errorData: ApiError = await response.json();
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : `Error DELETE: ${response.statusText}`;
        throw new ApiRequestError(errorMessage, response.status);
    }
    return response.json();
}