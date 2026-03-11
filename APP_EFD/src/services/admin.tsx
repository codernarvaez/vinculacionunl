import { methodGET, methodPUT, methodPOST } from '../api/access';
import type { ApiResponse } from '../api/access';

export interface AdminUser {
    uuid: string;
    nombres: string;
    apellidos: string;
    tipo: string;
    cuenta: {
        uuid: string;
        correo: string;
        estado: boolean;
        rol: {
            uuid: string;
            nombre: string
        }
    }
}

export interface PaginatedResponse<T> {
    total: number;
    items: T[];
}

export interface Role {
    uuid: string;
    nombre: string;
}

export interface CreateAdminData {
    nombres: string;
    apellidos: string;
    correo: string;
    clave: string;
}

const AdminService = {
    getUsers: async (skip: number = 0, limit: number = 100, search: string = ''): Promise<PaginatedResponse<AdminUser>> => {
        try {
            // Añadimos el query param de search
            const response = await methodGET<ApiResponse<PaginatedResponse<AdminUser>>>(
                `/personas/?skip=${skip}&limit=${limit}&search=${search}`
            );
            return response.data || { total: 0, items: [] };
        } catch (error) {
            console.error("Error fetching admin users:", error);
            throw error;
        }
    },

    changeUserRole: async (cuentaUuid: string, roleUuid: string): Promise<boolean> => {
        try {
            await methodPUT(`/cuentas/${cuentaUuid}/rol`, { rol_uuid: roleUuid });
            return true;
        } catch (error) {
            console.error(`Error changing role for user ${cuentaUuid}:`, error);
            return false;
        }
    },

    createAdministrator: async (data: CreateAdminData): Promise<boolean> => {
        try {
            await methodPOST('/administradores', data);
            return true;
        } catch (error) {
            console.error("Error creating administrator:", error);
            return false;
        }
    },

    getRoles: async (): Promise<Role[]> => {
        try {
            const response = await methodGET<ApiResponse<Role[]>>('/roles');
            return response.data || [];
        } catch (error) {
            console.error("Error fetching roles:", error);
            return [];
        }
    },

    toggleUserStatus: async (uuid: string, status: boolean): Promise<boolean> => {
        try {
            await methodPUT(`/cuentas/${uuid}/estado`, { estado: status });
            return true;
        } catch (error) {
            console.error(`Error changing status for user ${uuid}:`, error);
            return false;
        }
    }
};

export default AdminService;
