import { methodGET, methodPUT } from '../api/access';
import type { IAthletes } from './athletes';
import type { ApiResponse } from '../api/access';

export interface PaginatedResponse<T> {
    total: number;
    items: T[];
}

const SportsAdminService = {
    // --- Athletes Management ---
    getAllAthletes: async (skip: number = 0, limit: number = 100, q: string = '', escuela_uuid: string = ''): Promise<PaginatedResponse<IAthletes>> => {
        try {
            let queryUrl = `/participantes?skip=${skip}&limit=${limit}`;
            if (q) queryUrl += `&q=${encodeURIComponent(q)}`;
            if (escuela_uuid) queryUrl += `&escuela_uuid=${encodeURIComponent(escuela_uuid)}`;

            const response = await methodGET<ApiResponse<PaginatedResponse<IAthletes>>>(queryUrl);
            return response.data || { total: 0, items: [] };
        } catch (error) {
            console.error("Error fetching all athletes:", error);
            throw error;
        }
    },

    updateAthleteSchool: async (athleteUuid: string, schoolUuid: string): Promise<boolean> => {
        try {
            await methodPUT(`/participantes/${athleteUuid}/escuela`, { escuela_uuid: schoolUuid });
            return true;
        } catch (error) {
            console.error(`Error updating school for athlete ${athleteUuid}:`, error);
            return false;
        }
    },

};

export default SportsAdminService;
