import {
  getIOTDevicesByYard, UpdateIotDevice,
  saveOrUpdateIotDevice,
  getIotDevicesByYardId,
  getIotDevicesById, getIotDevicesTypes, deleteIotDevice,
  getIOTDevicesByYardAndStatus,checkMachineAssignment,
} from "../services/allServices/IOTdeviceService";

export const useIOTDevice = () => {

  const saveOrUpdateIotDeviceData = async (personUUID, iotDeviceData) => {
    try {
      const response = await saveOrUpdateIotDevice(personUUID, iotDeviceData);
      return response;
    } catch (err) {
      console.error("Error in saveOrUpdateIotDeviceData:", err);
      throw err;
    }
  };

  const UpdateIotDeviceData = async (personUUID, iotDeviceData) => {
    try {
      const response = await UpdateIotDevice(personUUID, iotDeviceData);
      return response;
    } catch (err) {
      console.error("Error in saveOrUpdateIotDeviceData:", err);
      throw err;
    }
  };


  const DeleteIotDeviceData = async (iotdeviceuuid) => {
    try {
      const response = await deleteIotDevice(iotdeviceuuid);
      return response;
    } catch (err) {
      console.error("Error in saveOrUpdateIotDeviceData:", err);
      throw err;
    }
  };


  const fetchIotDevices = async (yardId) => {
    try {
      const response = await getIotDevicesByYardId(yardId);
      if (Array.isArray(response) && response.length > 0) {
        return response;
      } else {
        return [];
      }
    } catch (err) {
      console.error("Error in fetching IoT devices:", err.message || err);
      throw new Error("Failed to fetch IoT devices");
    }
  };

  const fetchIotDevicesTypes = async () => {
    try {
      const response = await getIotDevicesTypes();
      if (Array.isArray(response) && response.length > 0) {
        return response;
      } else {
        return [];
      }
    } catch (err) {
      console.error("Error in fetching IoT devices:", err.message || err);
      throw new Error("Failed to fetch IoT devices");
    }
  };

  const fetchIOTDeviceByYard = async (yardId) => {
    try {
      const response = await getIOTDevicesByYard(yardId);

      if (response) {
        return response;
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


  const fetchIOTDeviceByYardAndStatus = async (personUUID) => {
    try {
      const response = await getIOTDevicesByYardAndStatus(personUUID);

      if (response) {
        return response;
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


  const fetchIotDevicebyId = async (iotDeviceUuid) => {
    try {
      const response = await getIotDevicesById(iotDeviceUuid);
      if (response) {
        return response;
      } else {
        console.error(
          "Failed to fetch IoT device:",
          "Unknown error or empty response"
        );
        return null;
      }
    } catch (err) {
      console.error("Error in fetching IoT device:", err);
      throw new Error("Failed to fetch IoT device");
    }
  };

  const checkMachineAssignment = async (machineUuid) => {
    try {
      const response = await checkMachineAssignment(machineUuid);
      if (response) {
        return response;
      } else {
        console.error(
          "Failed to fetch IoT device:",
          "Unknown error or empty response"
        );
        return null;
      }
    } catch (err) {
      console.error("Error in fetching IoT device:", err);
      throw new Error("Failed to fetch IoT device");
    }
  };

  return {
    saveOrUpdateIotDeviceData,
    UpdateIotDeviceData,
    fetchIOTDeviceByYard,
    fetchIotDevices, DeleteIotDeviceData,
    fetchIotDevicebyId, fetchIotDevicesTypes,
    fetchIOTDeviceByYardAndStatus,checkMachineAssignment
  };
};
