import {getAllAttendanceList } from "../services/allServices/attandanceService";
 
 
export const useAttendance = () => {
 
 
    const fetchAllAttendance = async (operatorId) => {
        try {
          const response = await getAllAttendanceList(operatorId);
          if (response.status) {
            return response.data; // Return the list of yards
          } else {
            console.error("Failed to fetch attendance:", response.message);
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      };
 
    return {fetchAllAttendance};
};
 