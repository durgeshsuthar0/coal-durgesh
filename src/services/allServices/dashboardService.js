import { primaryApi } from '../api'; // Adjust the import path according to your file structure

export const fetchAreaData = async (yardId) => {
  try {
    const response = await primaryApi.get(`/yard-areas/yards/${yardId}/occupancy`);
    if (response.status === 200) {
      return response.data.data; // Access the 'data' field directly
    }
    console.error("Failed to fetch occupancy data:", response.message || "Unexpected response");
    return []; // Return an empty array in case of failure
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    return []; // Return an empty array in case of error
  }
};

// Fetch area space data for a specific yard
export const fetchAreaSpaceData = async (yardId) => {
  try {
    const response = await primaryApi.get(`/yard-areas/yards/${yardId}/space`);
    if (response.status === 200) {
      return response.data.data; // Access the 'data' field directly
    }
    console.error("Failed to fetch space data:", response.message || "Unexpected response");
    return []; // Return an empty array in case of failure
  } catch (error) {
    console.error("Error fetching space data:", error);
    return []; // Return an empty array in case of error
  }
};

export const fetchContainerData = async (yardId) => {
  try {
    const response = await primaryApi.get(`/containers/entryCount?id=${yardId}`);
    if (response.data.status) {
      return response.data.data; // Return container data
    } else {
      console.error("Failed to fetch container data");
      return null; // Return null in case of failure
    }
  } catch (error) {
    console.error("Error fetching container data:", error);
    return null; // Return null in case of error
  }
};

export const fetchCountData = async (personInfoId) => {
  try {
    const response = await primaryApi.get(`/job-cards/details/${personInfoId}`);
    if (response.status === 200) {
      return response.data;
    }
    console.error("Failed to fetch job count data:", response.message || "Unexpected response");
    return null;
  } catch (error) {
    console.error("Error fetching job count data:", error);
    throw new Error("Failed to fetch job count data");
  }
};

export const fetchActiveMachineData = async (personInfoId) => {
  try {
    // Make the GET request to the API with the personInfoId
    const response = await primaryApi.get(`/machine-assignments/active/${personInfoId}`);
    
    // Check if the response is successful
    if (response.status === 200) {
      return response.data; // Return the data from the response
    }
    
    // Log an error message if the response is not successful
    console.error("Failed to fetch active machine data:", response.data.message || "Unexpected response");
    return null;
  } catch (error) {
    // Catch any errors and log them
    console.error("Error fetching active machine data:", error);
    throw new Error("Failed to fetch active machine data");
  }
};