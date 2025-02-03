import { primaryApi } from "../api";

export const getShiftsForEmployee = async (personInfoUuid) => {
    try {
        const response = await primaryApi.get(`shifts/${personInfoUuid}`);
        console.log("Shifts API Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        throw error;
    }
};

export const getShiftTypesByYardId = async (yardId) => {
    try {
        const response = await primaryApi.get(`shifts/coal/${yardId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shift types:', error);
        throw error;
    }
};
export const updateShift = (shiftDetails) => {
    return primaryApi
        .post(`shifts/update`, shiftDetails)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};



export const saveShifts = (shiftsToSave) => {
    return primaryApi.post(`shifts`, shiftsToSave)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {

            throw error;
        });
};
