import { primaryApi } from "../api";

export const addContainer = async (formData) => {
  try {
    const response = await primaryApi.post(`/containers/entry-exit`, formData);
    return { status: true, data: response.data }; // Return a successful status
  } catch (error) {
    // Log the error response if available
    if (error.response) {
      console.error("Error in adding/updating container:", error.response.data);
      return {
        status: false,
        message: error.response.data.message || "Failed to container",
      };
    }
    console.error("Error in container", error);
    return { status: false, message: "Failed to add/update container" };
  }
};

export const addJobCard = async (formData) => {
  try {
    // Send a POST request with the form data as JSON
    const response = await primaryApi.post(
      `/job-cards/create-job`, // API endpoint
      formData // The request body is now a JSON object
    );

    return { status: true, data: response.data }; // Return success status
  } catch (error) {
    if (error.response) {
      console.error("Error in adding job card:", error.response);
      return {
        status: false,
        message: error.response.data.message || "Failed to add job card",
      };
    }
    console.error("Error in job card request:", error);
    return { status: false, message: "Failed to add job card" };
  }
};


// Auth file - addJobCard function

export const getContainerById = async (id) => {
  try {
    const response = await primaryApi.get(`/containers/details/${id}`);
    return { status: true, data: response.data }; // Assuming response data contains the list of yards
  } catch (error) {
    if (error.response) {
      console.error("Error fetching yards:", error.response.data);
      return {
        status: false,
        message:
          error.response.data.message || "Failed to fetch container Type",
      };
    }
    console.error("Error fetching yards:", error);
    return { status: false, message: "Failed to fetch container Type" };
  }
};

export const getContainers = async (yardId) => {
  try {
    const response = await primaryApi.get(`/containers/yards/${yardId}`);
    return { status: true, data: response.data.data }; // Assuming response data contains the list of yards
  } catch (error) {
    if (error.response) {
      console.error("Error fetching yards:", error.response.data);
      return {
        status: false,
        message:
          error.response.data.message || "Failed to fetch container Type",
      };
    }
    console.error("Error fetching yards:", error);
    return { status: false, message: "Failed to fetch container Type" };
  }
};

export const getContainerTypeList = async () => {
  try {
    const response = await primaryApi.get(`/container-types`);
    return { status: true, data: response.data }; // Assuming response data contains the list of yards
  } catch (error) {
    if (error.response) {
      console.error("Error fetching yards:", error.response.data);
      return {
        status: false,
        message:
          error.response.data.message || "Failed to fetch container Type",
      };
    }
    console.error("Error fetching yards:", error);
    return { status: false, message: "Failed to fetch container Type" };
  }
};

export const addContainerEntry = async (formData) => {
  try {
    const response = await primaryApi.get("containers/entry-exit");
    if (response.status === 201) {
      return { success: true, message: "Container entry successfully added" };
    } else {
      return { success: false, message: "Failed to add container entry" };
    }
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Error during API call");
  }
};

export const fetchContainerEntryStatus = async (containerUniqueNumber) => {
  try {
    const response = await primaryApi.get(
      `/containers/check-entry/${containerUniqueNumber}`
    );
    return { status: true, data: response.data }; // Assuming response data contains the list of yards
  } catch (error) {
    if (error.response) {
      console.error("Error fetching yards:", error.response.data);
      return {
        status: false,
        message:
          error.response.data.message || "Failed to fetch container Type",
      };
    }
    console.error("Error fetching yards:", error);
    return { status: false, message: "Failed to fetch container Type" };
  }
};


export const getContainerByContainerUniqueNo = async (containerUniqueNo) => {
  try {
    const response = await primaryApi.get(`/containers/data/${containerUniqueNo}`);
    return { status: true, data: response.data }; // Assuming response data contains the list of yards
  } catch (error) {
    if (error.response) {
      console.error("Error fetching yards:", error.response.data);
      return {
        status: false,
        message:
          error.response.data.message || "Failed to fetch container Type",
      };
    }
    console.error("Error fetching yards:", error);
    return { status: false, message: "Failed to fetch container Type" };
  }
};

export const fetchJobAssignments = async (personInfoId) => {
  try {
    const response = await primaryApi.get(`/job-cards/person/${personInfoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job assignments:", error);
    throw error;
  }
};

export const saveOrUpdateJob = async (jobId, operatorId, action) => {
  try {
    const response = await primaryApi.post("/operator-jobs", null, {
      params: {
        jobId,
        operatorId,
        action,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving or updating job:", error.message); // Updated log
    console.error("Config:", error.config); // Debug the request config
    if (error.response) {
      console.error("Response data:", error.response.data); // Check server response
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};

export const fetchAssignedJobsByOperator = async (personInfoId) => {
  try {
    const response = await primaryApi.get(`/job-cards/operator/${personInfoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job assignments:", error);
    throw error;
  }
}

export const fetchJobsByAreaManager = async (personInfoId) => {
  try {
    const response = await primaryApi.get(`/job-cards/person/${personInfoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job assignments:", error);
    throw error;
  }
}

export const fetchCompletedJobs = async (yardId,personInfoId,role) => {
  try {
    const response = await primaryApi.get('/job-cards/completed-jobs', {
      params: { yardId,personInfoId,role },
    });
    return response.data; // This will return the array of job objects
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkJobStatus = async (containerId) => {
  try {
    const response = await primaryApi.get(`/job-cards/in-progress/${containerId}`);
    // The response now contains both the status and the job status message
    const jobStatus = response.data.statusMessage;
    const isAssignedAndInProgress = response.data.assignedAndInProgress;

    return { isAssignedAndInProgress, jobStatus };
  } catch (error) {
    console.error("Error fetching job status:", error);
    return { isAssignedAndInProgress: false, jobStatus: "Error fetching job status" };
  }
};

export const fetchContainerUniqueNumbersByYardId = async (yardId) => {
  try {
    const response = await primaryApi.get(`/containers/active-entry-container?yardId=${yardId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching container unique numbers:", error);
    return []; // Return an empty array in case of an error
  }
};