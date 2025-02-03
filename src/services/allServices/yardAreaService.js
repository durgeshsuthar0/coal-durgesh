import { primaryApi } from '../api';

export const getAreaTypeList = async () => {
    try {
        const response = await primaryApi.get('/area-types');
        return { status: true, data: response.data.data }; // Assuming data is wrapped inside 'data'
    } catch (error) {
        console.error("Error in fetching area types:", error);
        return { status: false, message: "Failed to fetch area types" };
    }
};

export const getYardList = async () => {
    try {
        const response = await primaryApi.get('/yards');
        return { status: true, data: response.data.data }; // Assuming data is wrapped inside 'data'
    } catch (error) {
        console.error("Error in fetching Yard:", error);
        return { status: false, message: "Failed to fetch yard" };
    }
};

export const addOrUpdateYardArea = async (personInfoId,data) => {
    try {
        const response = await primaryApi.post(`yard-areas/persons/${personInfoId}`, data);
        return { status: true, data: response.data }; // Adjust based on your API response structure
    } catch (error) {
        // Log the error response if available
        if (error.response) {
            console.error("Error in adding/updating yard area:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to add/update yard area" };
        }
        console.error("Error in adding/updating yard area:", error);
        return { status: false, message: "Failed to add/update yard area" };
    }
};

// Add this function to your api.js
export const getYardAreasListByYardId = async (yardId,role,personInfoId) => {
    try {
        const response = await primaryApi.get(`/yard-areas/all/yards/${yardId}?role=${role}&personInfoId=${personInfoId}`);
        return { status: true, data: response.data.data }; // Adjust according to your API response
    } catch (error) {
        console.error("Error in fetching yard areas:", error);
        return { status: false, message: "Failed to fetch yard areas" };
    }
};

export const getYardAreaById = async (Id) => {
    try {
        const response = await primaryApi.get(`yard-areas/${Id}`);
        return { status: true, data: response.data.data }; // Adjust according to your API response
    } catch (error) {
        console.error("Error in fetching yard areas:", error);
        return { status: false, message: "Failed to fetch yard areas" };
    }
};

// export const deleteYardAreaById = async (yardAreaId) => {
//     try {
//         const response = await primaryApi.delete(`/yard-areas/${yardAreaId}`);
//         return { status: true, message: "Deleted successfully" };
//     } catch (error) {
//         console.error("Error in deleting yard area:", error);
//         return { status: false, message: "Failed to delete yard area" };
//     }
// };

export const deleteYardAreaById = async (yardAreaId) => {
    try {
        const response = await primaryApi.delete(`/yard-areas/${yardAreaId}`);
        return { status: true, data: response.data }; // Adjust based on your API response structure
    } catch (error) {
        console.error("Error in deleting yard area:", error);
        return { status: false, message: "Failed to delete yard area" };
    }
};

// Fetch yard area data by yard ID
export const getYardAreaDataByYardId = async (yardId) => {
    try {
      const response = await primaryApi.get(`/yard-areas/yards/${yardId}`);
      if (response.status === 200) {
        return response.data; // Return the entire response data
      }
      console.error("Failed to fetch yard area data:", response.message || "Unexpected response");
      return { data: [] }; // Return an empty array in case of failure
    } catch (error) {
      console.error("Error fetching yard area data:", error);
      throw error; // Rethrow the error to handle it in the calling component
    }
  };

  
  export const assignYardArea = async (personInfoId, yardAreaId,yardId) => {
    try {
        const response = await primaryApi.post(`/yard-areas/assigns?personInfoId=${personInfoId}&yardAreaId=${yardAreaId}&yardId=${yardId}`);
        return { status: true, data: response.data };  // Assuming response data contains the assigned yard information
    } catch (error) {
        if (error.response) {
            console.error("Error assigning yard area:", error.response.data);
            return { status: false, message: error.response.data.message || "Failed to assign yard area" };
        }
        console.error("Error assigning yard area:", error);
        return { status: false, message: "Failed to assign yard area" };
    }
};

export const getAvailablePersons = async (currentUserRole, yardAreaId,personInfoId) => {
    try {
      const response = await primaryApi.get(`/yard-areas/available-persons`, {
        params: {
          currentUserRole,
          yardAreaId,
          personInfoId
        }
      });
      return { status: true, data: response.data }; // Assuming the response has a 'data' field containing available persons
    } catch (error) {
      if (error.response) {
        console.error("Error fetching available persons:", error.response.data);
        return { status: false, message: error.response.data.message || "Failed to fetch available persons" };
      }
      console.error("Error fetching available persons:", error);
      return { status: false, message: "Failed to fetch available persons" };
    }
  };

  export const getYardAreaByYardId = async (yardId) => {
    try {
        const response = await primaryApi.get(`yard-areas/assignment/yards/${yardId}`);
        return { status: true, data: response.data.data }; // Adjust according to your API response
    } catch (error) {
        console.error("Error in fetching yard areas:", error);
        return { status: false, message: "Failed to fetch yard areas" };
    }
};
 
export const fetchEligibleContainers = async (yardId,yardAreaId) => {
    try {
      const response = await primaryApi.get(`/containers/yard/${yardId}/yardarea/${yardAreaId}`);
      return { status: true, data: response.data };
    } catch (error) {
      console.error("Error fetching eligible containers:", error);
      return { status: false, message: "Failed to fetch eligible containers" };
    }
  };

  export const fetchMachinesByYardArea = async (yardAreaId) => {
    try {
      const response = await primaryApi.get(`/machine-assignments/yard-area/${yardAreaId}`);
      return { status: true, data: response.data };
    } catch (error) {
      console.error("Error fetching eligible containers:", error);
      return { status: false, message: "Failed to fetch eligible containers" };
    }
  };