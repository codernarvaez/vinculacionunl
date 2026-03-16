import { methodPOST } from "../api/access";
import { useAuthStore } from "../store/authStore";

export function getUUIDCurrentUser(): string | null {
    return useAuthStore.getState().user?.uuid || null;
}

export function getRoleCurrentUser(): string | null {
    return useAuthStore.getState().user?.rol || null;
}

export async function logout() {
    try {
        await methodPOST('/cuentas/logout', {});
    } catch (error) {
        console.error("Error en el logout del servidor", error);
    } finally {
        useAuthStore.getState().logout();
    }
}

export function getNamesCurrentUser(): string | null {
    return useAuthStore.getState().user?.nombres || null;
}