import {
  getMachineTypeList,
  getVehicleCategory,
  getFuelTypeList,
  saveMachine,
  getMachineList,
  getMachineByYard, getOperators,
  saveOrUpdateMachineAssignments,
  getMachineAssignmentStatus,
  getMachineListById, deleteMachineById,
} from "../services/allServices/machineService";

export const useMachine = () => {

  const fetchMachineTypes = async () => {
    try {
      const response = await getMachineTypeList();
      if (response.data) {
        return response.data;
      }
      console.error("Failed to fetch machine types:", response.message);
      return [];
    } catch (err) {
      console.error("Error fetching machine types:", err);
      return [];
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const response = await getFuelTypeList();
      if (response.data) {
        return response.data;
      }
      console.error("Failed to fetch machine types:", response.message);
      return [];
    } catch (err) {
      console.error("Error fetching machine types:", err);
      return [];
    }
  };

  const fetchVehicleCategory = async () => {
    try {
      const response = await getVehicleCategory();
      if (response.data) {
        return response.data;
      }
      console.error("Failed to fetch machine types:", response.message);
      return [];
    } catch (err) {
      console.error("Error fetching machine types:", err);
      return [];
    }
  };


  const saveMachineData = async (machineData, personUUID) => {
    try {
      const response = await saveMachine(machineData, personUUID);
      if (response.status) {
        return response;
      } else {
        console.error("Failed to save machine:", response.message);
        return response;
      }
    } catch (error) {
      console.error("Error saving machine:", error);
      console.error("Full error object:", error);
      return error;
    }
  };

  const fetchMachineList = async () => {
    try {
      const response = await getMachineList();
      if (response && response.data) {
        return response.data;
      } else {
        console.error("Failed to fetch machine list:", response?.message || "Unknown error");
        return [];
      }
    } catch (err) {
      console.error("Error in fetching machine list:", err);
      throw new Error("Failed to fetch machine list");
    }
  };

  const fetchOperators = async (yardId) => {
    try {
      const response = await getOperators(yardId);
      if (response) {
        return response;
      } else {
        console.error("Failed to fetch machine list:", response?.message || "Unknown error");
        return [];
      }
    } catch (err) {
      console.error("Error in fetching machine list:", err);
      throw new Error("Failed to fetch machine list");
    }
  };

  const fetchMachineByYard = async (yardId) => {
    try {
      const response = await getMachineByYard(yardId);
      if (response && response.data) {
        return response.data;
      } else {
        console.error("Failed to fetch machine list:", response?.message || "Unknown error");
        return [];
      }
    } catch (err) {
      console.error("Error in fetching machine list:", err);
      throw new Error("Failed to fetch machine list");
    }
  };


  const removeMachine = async (machineUUID) => {
    try {
      const response = await deleteMachineById(machineUUID);
      if (response.status) {
        return response.data;
      } else {
        console.error("Failed to delete yard:", response.message);
      }
    } catch (error) {
      console.error("Error deleting yard:", error);
    }
  };

  const saveOrUpdateMachineAssignmentsData = async (machineAssignmentsData) => {
    try {
      const response = await saveOrUpdateMachineAssignments(machineAssignmentsData);


      return response;
    } catch (err) {
      console.error("Error in saveOrUpdateMachineData:", err);
      throw err;
    }
  };

  const fetchMachineByEventType = async (eventTypeId) => {
    try {
      const response = await getMachineAssignmentStatus(eventTypeId);
      if (response && response.data) {
        return response.data;
      } else {
        console.error(
          "Failed to fetch machine list:",
          response?.message || "Unknown error"
        );
        return [];
      }
    } catch (err) {
      console.error("Error in fetching machine list:", err);
      throw new Error("Failed to fetch machine list");
    }
  };

  const fetchMachineListById = async (id) => {
    try {
      const response = await getMachineListById(id);
      if (response && response.data) {
        return response.data;
      } else {
        console.error(
          "Failed to fetch machine list:",
          response?.message || "Unknown error"
        );
        return [];
      }
    } catch (err) {
      console.error("Error in fetching machine list:", err);
      throw new Error("Failed to fetch machine list");
    }
  };


  return {
    fetchMachineTypes,
    fetchVehicleCategory,
    fetchFuelTypes,
    saveMachineData,
    fetchMachineList,
    fetchMachineByYard,
    removeMachine,
    saveOrUpdateMachineAssignmentsData,
    fetchMachineByEventType,
    fetchMachineListById, fetchOperators
  };
};
