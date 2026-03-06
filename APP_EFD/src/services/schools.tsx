import { methodGET } from '../api/access';
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

    static async getSchoolsByDate(date: string): Promise<IEscuela[]> {
        try {
            const response = await methodGET<ApiResponse<IEscuela[]>>(`/escuelas/disponibles/${date}`);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching schools by date:", error);
            throw error;
        }
    }
}

export default SchoolsService;

