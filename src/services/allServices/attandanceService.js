import { primaryApi } from "../api";
 
export const getAllAttendanceList = async (operatorId) => {
    try {
        const response = await primaryApi.get(`/worklogs/operator/${operatorId}`);
        return { status: true, data: response.data };  // Assuming response data contains the list of yards
    } catch (error) {
        if (error.response) {
            console.error("Error fetching attendance:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to fetch attendance" };
        }
        console.error("Error fetching attendance:", error);
        return { status: false, message: "Failed to fetch attendance" };
    }
};