import { primaryApi } from "../api";


//Get All Machine-Type Api
export const getMachineTypeList = async () => {
  try {
    const response = await primaryApi.get("/all-masters/machine-type");
    if (response.status === 200) {
      return response;
    }
    console.error("Failed to fetch machine type list:", response.message);
    return [];
  } catch (error) {
    console.error("Error fetching machine type list:", error);
    return [];
  }
};

//Get All Fuel-Type Api
export const getFuelTypeList = async () => {
  try {
    const response = await primaryApi.get("/all-masters/fuel-type");
    if (response.status === 200) {
      return response;
    }
    console.error("Failed to fetch Fuel type list:", response.message);
    return [];
  } catch (error) {
    console.error("Error fetching Fuel type list:", error);
    return [];
  }
};

export const getVehicleCategory = async () => {
  try {
    const response = await primaryApi.get("/all-masters/vehicle-type");
    if (response.status === 200) {
      return response;
    }
    console.error("Failed to fetch Fuel type list:", response.message);
    return [];
  } catch (error) {
    console.error("Error fetching Fuel type list:", error);
    return [];
  }
};
//Add New Machine Device
export const saveMachine = async (machineData, personUUID) => {
  try {
    const formData = new FormData();
    formData.append("personUUID", personUUID);
    Object.keys(machineData).forEach(key => {
      if (key !== "rcBookFile" && key !== "rcBookFilePath") {
        formData.append(key, machineData[key]);
      }
    });
    if (machineData.rcBookFile) {
      formData.append("rcBookFile", machineData.rcBookFile);
    }
    const response = await primaryApi.post(`/machine-management/${personUUID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { status: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.error("Error in adding/updating machine:", error.response.data);
      return { status: false, message: error.response.data.message || "Failed to add/update machine" };
    }
    console.error("Error in adding/updating machine:", error);
    return { status: false, message: "Failed to add/update machine" };
  }
};


export const deleteMachineById = async (machineUUID) => {
  try {
      const response = await primaryApi.delete(`/machine-management/${machineUUID}`);
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


//Get By Machine ID Api
export const getMachineByYard = async (yardId) => {
  try {
    const response = await primaryApi.get(`/machine-management/person/${yardId}`);

    if (response.status === 200) {
      return response.data;
    }

    console.error(
      "Failed to fetch machine list:",
      response.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching machine list:", error);
    return [];
  }
};













// From this Need to use Later

export const checkIn = async (operatorId) => {
  try {
    const response = await primaryApi.post("/worklogs/check-in", null, {
      params: { operatorId },
    });
    return response.data;
  } catch (error) {
    console.error("Error during check-in:", error);
    throw error;
  }
};

export const checkOutOperator = async (operatorId) => {
  try {
    const response = await primaryApi.post('/worklogs/check-out', null, {
      params: { operatorId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchCheckInStatus = async (operatorId) => {
  try {
    const response = await primaryApi.get(`/worklogs/check-in-status/${operatorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchGetOperatorJobTotalTime = async (operatorId) => {
  try {
    const response = await primaryApi.get(`/operator-jobs/total-time/${operatorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching operator job total time", error);
    throw error;
  }
};

export const getMachineWorkLog = async (operatorId) => {
  try {
    const response = await primaryApi.get(`/worklogs/hours/${operatorId}`);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error("Error fetching machine type list:", error);
  }
};

export const getMachineList = async () => {
  try {
    const response = await primaryApi.get("/machines");
    if (response.status === 200) {
      return response.data;
    }

    console.error(
      "Failed to fetch machine list:",
      response.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching machine list:", error);
    return [];
  }
};


export const getOperators = async (yardId) => {
  try {
    const response = await primaryApi.get(`/auth/available-operators?yardId=${yardId}`);
    if (response.status === 200) {
      return response.data;
    }

    console.error(
      "Failed to fetch machine list:",
      response.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching machine list:", error);
    return [];
  }
};

export const saveOrUpdateMachineAssignments = async (machineAssignmentsData) => {
  try {
    const response = await primaryApi.post("/machine-assignments", machineAssignmentsData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    console.error("Failed to save/update machine:", response.statusText);
    throw new Error(response.statusText || "Unknown error occurred");
  } catch (error) {
    console.error("Error saving/updating machine:", error);
    throw error;
  }
};

export const getMachineAssignmentStatus = async (eventTypeId) => {
  try {
    const response = await primaryApi.get(`/iot-device/machine-assign-list/${eventTypeId}`);
    if (response.status === 200) {
      return response.data;
    }
    console.error("Failed to fetch machine assignment status:", response.message || "Unexpected response");
    return null;
  } catch (error) {
    console.error("Error fetching machine assignment status:", error);
    return null;
  }
};

export const getMachineListById = async (id) => {
  try {
    const response = await primaryApi.get(`/machine-management/${id}`);

    if (response.status === 200) {
      return response.data;
    }

    console.error(
      "Failed to fetch machine list:",
      response.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching machine list:", error);
    return [];
  }
};
export const fetchMachineByYardAndPerson = async (yardId, personInfoId) => {
  try {
    const response = await primaryApi.get(`/machines/yards/${yardId}/persons/${personInfoId}`);
    return response;
  } catch (error) {
    console.error("Error fetching machines:", error);
    if (error.response) {
      throw new Error(
        `Error: ${error.response.data.message || "Failed to fetch machines"}`
      );
    }
    throw new Error("An unexpected error occurred while fetching machines");
  }
};

