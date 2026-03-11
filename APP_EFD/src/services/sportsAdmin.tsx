import { methodGET, methodPUT } from '../api/access';
import type { IAthletes } from './athletes';
import type { IEscuela } from './schools';
import type { ApiResponse } from '../api/access';

export interface PaginatedResponse<T> {
    total: number;
    items: T[];
}

const SportsAdminService = {
    // --- Athletes Management ---
    getAllAthletes: async (skip: number = 0, limit: number = 100, q: string = ''): Promise<PaginatedResponse<IAthletes>> => {
        try {
            const query = q ? `&q=${q}` : '';
            const response = await methodGET<ApiResponse<PaginatedResponse<IAthletes>>>(`/participantes/?skip=${skip}&limit=${limit}${query}`);
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


    // --- Schools Management ---
    getAllSchools: async (skip: number = 0, limit: number = 100): Promise<PaginatedResponse<IEscuela>> => {
        try {
            const response = await methodGET<ApiResponse<PaginatedResponse<IEscuela>>>(`/escuelas/?skip=${skip}&limit=${limit}`);
            return response.data || { total: 0, items: [] };
        } catch (error) {
            console.error("Error fetching all schools:", error);
            throw error;
        }
    },

    updateSchool: async (uuid: string, data: Partial<IEscuela>): Promise<boolean> => {
        try {
            await methodPUT(`/escuelas/${uuid}`, data);
            return true;
        } catch (error) {
            console.error(`Error updating school ${uuid}:`, error);
            return false;
        }
    },

    toggleSchoolStatus: async (schoolUuid: string, isActive: boolean): Promise<boolean> => {
        try {
            await methodPUT(`/escuelas/${schoolUuid}/estado`, { estado: isActive });
            return true;
        } catch (error) {
            console.error(`Error toggling status for school ${schoolUuid}:`, error);
            return false;
        }
    }
};

export default SportsAdminService;
