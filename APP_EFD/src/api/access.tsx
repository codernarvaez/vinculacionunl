export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper para peticiones HTTP con tipado genérico
 * @template T El tipo de dato que esperamos recibir (Response)
 * @template D El tipo de dato que enviamos (Payload)
 */

export async function methodGET<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error(`Error GET: ${response.statusText}`);
    return response.json();
}

export async function methodPOST<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error POST: ${response.statusText}`);
    return response.json();
}

export async function methodPUT<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error PUT: ${response.statusText}`);
    return response.json();
}

export async function methodDELETE<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error(`Error DELETE: ${response.statusText}`);
    return response.json();
}