import { methodGET, methodPUT } from '../api/access';
import type { ApiResponse } from '../api/access';

export interface IAthletes {
    id: number,
    nombres: string,
    apellidos: string,
    genero: string,
    foto: string,
    representante_id: number,
    uuid: string,
    updated_at: string,
    created_at: string,
    cedula: string,
    fechaNac: string,
    condicionMedica: string,
    acepto_terminos: boolean
    escuelas: [
        {
            uuid: string,
            nombre: string,
            descripcion: string,
            ranInferior: number,
            ranSuperior: number,
            estado: boolean
        }
    ]
}

class AthletesService {
    static async getAthletesByRepresentativeUUID(uuid_representante: string): Promise<IAthletes[]> {
        try {
            const response = await methodGET<ApiResponse<IAthletes[]>>(`/participantes/representante/${uuid_representante}`);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching schools:", error);
            throw error;
        }
    }

    static async getAthleteByUUID(uuid_participante: string): Promise<IAthletes | null> {
        try {
            const response = await methodGET<ApiResponse<IAthletes>>(`/participantes/${uuid_participante}`);
            return response.data || null;

        } catch (error) {
            console.error("Error fetching schools:", error);
            throw error;
        }
    }

    static async putAthleteByUUID(uuid_participante: string, data: FormData | IAthletes): Promise<IAthletes | null> {
        try {
            const response = await methodPUT<ApiResponse<IAthletes>>(`/participantes/${uuid_participante}`, data);
            console.log(response)
            return response.data || null;
        } catch (error) {
            console.error("Error fetching schools:", error);
            throw error;
        }
    }

    static async downAtheleteOfSchool(uuid_participante: string): Promise<any> {
        try {
            const response = await methodPUT<ApiResponse<IAthletes>>(`/participantes/${uuid_participante}/dar_baja_escuela`, {});
            return response.data || null;
        } catch (error) {
            console.error("Error removing athlete from school:", error);
            throw error;
        }
    }

    static async getAllAthletes(skip: number = 0, limit: number = 1000): Promise<IAthletes[]> {
        try {
            const response = await methodGET<ApiResponse<any>>(`/participantes/?skip=${skip}&limit=${limit}`);
            return response.data?.items || [];
        } catch (error) {
            console.error("Error fetching all athletes:", error);
            throw error;
        }
    }

    static async getInscriptionsTotal(): Promise<number> {
        try {
            const response = await methodGET<ApiResponse<any>>(`/participantes/inscripciones/total`);
            return response.data || 0;
        } catch (error) {
            console.error("Error fetching inscriptions total:", error);
            throw error;
        }
    }
}

export default AthletesService