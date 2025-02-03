import { primaryApi } from '../api';

//Add New Yard Api
export const addYard = async (personUUID, yardData) => {
    try {
        const response = await primaryApi.post(`/coal-yard/${personUUID}`, yardData);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error in adding/updating yard area:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to add/update yard area" };
        }
        console.error("Error in adding/updating yard area:", error);
        return { status: false, message: "Failed to add/update yard area" };
    }
};

//Update Yard Api
export const UpdateYard = async (personUUID, yardData) => {
    try {
        const response = await primaryApi.put(`/coal-yard/${personUUID}`, yardData);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error in adding/updating yard area:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to add/update yard area" };
        }
        console.error("Error in adding/updating yard area:", error);
        return { status: false, message: "Failed to add/update yard area" };
    }
};


//Get All Yard 
export const getAssignedYards = async (personUUID, role) => {
    try {
        const response = await primaryApi.get(`coal-yard/person/${personUUID}`);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error fetching yards:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to fetch yards" };
        }
        console.error("Error fetching yards:", error);
        return { status: false, message: "Failed to fetch yards" };
    }
};


//Get By YardId Api
export const getYardById = async (id) => {
    try {
        const response = await primaryApi.get(`/coal-yard/${id}`);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error fetching yards:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to fetch yards" };
        }
        console.error("Error fetching yards:", error);
        return { status: false, message: "Failed to fetch yards" };
    }
};

//Delete By YardId
export const deleteYardById = async (yardId) => {
    try {
        const response = await primaryApi.delete(`/coal-yard/${yardId}`);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error deleting yard:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to delete yard" };
        }
        console.error("Error deleting yard:", error);
        return { status: false, message: "Failed to delete yard" };
    }
};

//Get Location State/Taluka/District
export const getLocation = async () => {
    try {
        const response = await primaryApi.get("/locations");
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
    }
};















//Use this Api Later

export const assignYard = async (personInfoId, yardId, role) => {
    try {
        const response = await primaryApi.post(`/yards/assign?personInfoId=${personInfoId}&yardId=${yardId}&role=${role}`);
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error assigning yard:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to assign yard" };
        }
        console.error("Error assigning yard:", error);
        return { status: false, message: "Failed to assign yard" };
    }
};



export const getAvailablePersons = async (currentUserRole, yardId, personUUID) => {
    try {
        const response = await primaryApi.get(`/coal-yard/available-persons`, {
            params: {
                currentUserRole,
                yardId,
                personUUID
            }
        });
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Error fetching available persons:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to fetch available persons" };
        }
        console.error("Error fetching available persons:", error);
        return { status: false, message: "Failed to fetch available persons" };
    }
};
