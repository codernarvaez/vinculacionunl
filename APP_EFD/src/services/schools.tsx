import { methodGET, methodPOST, methodPUT } from '../api/access';
import type { ApiResponse } from '../api/access';

export interface IEscuela {
    id: number;
    administrador_id: number;
    descripcion: string;
    nombre: string;
    ranInferior: number;
    ranSuperior: number;
    estado: boolean;
    uuid: string;
    created_at: string;
    updated_at: string;
}




class SchoolsService {
    static async getSchools(): Promise<IEscuela[]> {
        try {
            const response = await methodGET<ApiResponse<IEscuela[]>>('/escuelas/disponibles');
            return response.data || [];
        } catch (error) {
            console.error("Error fetching schools:", error);
            throw error;
        }
    }

    static async getAllSchools(): Promise<IEscuela[]> {
        try {
            const response = await methodGET<ApiResponse<IEscuela[]>>('/escuelas');
            return response.data || [];
        } catch (error) {
            console.error("Error fetching schools:", error);
            throw error;
        }
    }

    static async updateSchool(uuid: string, data: Partial<IEscuela>): Promise<boolean> {
        try {
            await methodPUT(`/escuelas/${uuid}`, data);
            return true;
        } catch (error) {
            console.error(`Error updating school ${uuid}:`, error);
            return false;
        }
    }

    static async toggleSchoolStatus(schoolUuid: string, isActive: boolean): Promise<boolean> {
        try {
            await methodPUT(`/escuelas/${schoolUuid}/estado`, { estado: isActive });
            return true;
        } catch (error) {
            console.error(`Error toggling status for school ${schoolUuid}:`, error);
            return false;
        }
    }

    static async getSchoolsByDate(date: string): Promise<IEscuela[]> {
        try {
            const response = await methodGET<ApiResponse<IEscuela[]>>(`/escuelas/disponibles/${date}`);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching schools by date:", error);
            throw error;
        }
    }

    static async createSchool(schoolData: any): Promise<any> {
        try {
            const response = await methodPOST<ApiResponse<IEscuela>>('/escuelas', schoolData);
            console.log(response)
            return response.data || [];
        } catch (error) {
            console.error("Error creating school:", error);
            throw error;
        }
    }

    static async updateSchoolbyUUID(uuid: string, schoolData: any): Promise<any> {
        try {
            const response = await methodPUT<ApiResponse<IEscuela>>(`/escuelas/${uuid}`, schoolData);
            return response.data || [];
        } catch (error) {
            console.error("Error updating school:", error);
            throw error;
        }
    }

    static async changeStateSchoolbyUUID(uuid: string, data: { estado: boolean }): Promise<any> {
        try {
            const response = await methodPUT<ApiResponse<IEscuela>>(`/escuelas/${uuid}/estado`, data);
            return response.data || [];
        } catch (error) {
            console.error("Error changing school state:", error);
            throw error;
        }
    }
}

export default SchoolsService;

