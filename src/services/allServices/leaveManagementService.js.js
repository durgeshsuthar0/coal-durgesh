import { primaryApi } from "../api";
 
export const getLeaveBalance = async (personInfoId) => {
  try {
    const response = await primaryApi.get(`/leaves/balance/person/${personInfoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    throw error;
  }
};
 
export const applyLeave = async (leaveData) => {
    try {
      const response = await primaryApi.post(`/leaves/apply`, leaveData);
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error applying leave:", error);
      throw error; // Re-throw the error for further handling
    }
  };
 
 
  export const getLeaveInfo = async (personInfoId) => {
    try {
        const response = await primaryApi.get(`/leaves/person/${personInfoId}`);
        return response.data; // Return the response data from API
    } catch (error) {
        console.error('Error fetching leave info:', error);
        throw error; // Throw error to be handled by caller
    }
};
 
 
 