import { methodGET } from '../api/access';
import type { ApiResponse } from '../api/access';

export interface IAthletes{
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
}

class AthletesService{
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
        try{
                const response = await methodGET<ApiResponse<IAthletes>>(`/participantes/${uuid_participante}`);
                return response.data || null;

        } catch (error) {
                console.error("Error fetching schools:", error);
                throw error;
            }
    }
    
}

export default AthletesService;