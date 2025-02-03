import { primaryApi } from "../api";
import { initialIOTDeviceData } from "../../state/iotDeviceComponentState";


export const saveOrUpdateIotDevice = async (personUUID, iotDeviceData) => {
  try {
    const response = await primaryApi.post(`/iot-device/${personUUID}`, iotDeviceData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    console.error("Failed to save/update IoT device:", response.statusText);
    throw new Error(response.statusText || "Unknown error occurred");
  } catch (error) {
    console.error("Error saving/updating IoT device:", error);
    throw error;
  }
};

export const UpdateIotDevice = async (personUUID, iotDeviceData) => {
  try {
    const response = await primaryApi.put(`/iot-device/${personUUID}`, iotDeviceData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    console.error("Failed to save/update IoT device:", response.statusText);
    throw new Error(response.statusText || "Unknown error occurred");
  } catch (error) {
    console.error("Error saving/updating IoT device:", error);
    throw error;
  }
};


export const getIOTDevicesByYardAndStatus = async (personUUID) => {
  try {
    const response = await primaryApi.get(`/iot-device/person/${personUUID}`);

    if (response.status === 200 && response.data?.status) {
      return response.data.data;
    }

    console.error(
      "Failed to fetch IoT device list:",
      response.data?.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching IoT device list:", error);
    return [];
  }
};

export const getIOTDevicesByYard = async (yardId) => {
  try {
    const response = await primaryApi.get(`iotdevices/yards/${yardId}`);

    if (response.status === 200 && response.data?.status) {
      return response.data.data;
    }

    console.error(
      "Failed to fetch IoT device list:",
      response.message || "Unexpected response"
    );
    return [];
  } catch (error) {
    console.error("Error fetching IoT device list:", error);
    return [];
  }
};

export const getIotDevicesById = async (iotDeviceUuid) => {
  try {
    const response = await primaryApi.get(`/iot-device/${iotDeviceUuid}`);

    if (response.status === 200) {
      return response.data.data;
    }
    console.error("Failed to fetch IoT device:", response.message || "Unexpected response");
    return null;
  } catch (error) {
    console.error("Error fetching IoT device:", error);
    return null;
  }
};


export const deleteIotDevice = async (iotDeviceUuid) => {
  try {
    const response = await primaryApi.delete(`/iot-device/${iotDeviceUuid}`);

    if (response.status === 200) {
      return response.data;
    }

    console.error("Failed to delete IoT device:", response.message || "Unexpected response");
    return null;
  } catch (error) {
    console.error("Error deleting IoT device:", error);
    return null;
  }
};


export const getIotDevicesTypes = async () => {
  try {
    const response = await primaryApi.get(`/iot-device`);

    if (response.status === 200) {
      return response.data.data;
    }
    console.error("Failed to fetch IoT device:", response.message || "Unexpected response");
    return null;
  } catch (error) {
    console.error("Error fetching IoT device:", error);
    return null;
  }
};



// Fetch IoT devices by yard ID
export const getIotDevicesByYardId = async (yardId) => {
  try {
    const response = await primaryApi.get(`/iotdevices/yards/${yardId}`);
    if (response.status === 200) {
      return response.data;
    }
    console.error("Failed to fetch IoT devices:", response.message || "Unexpected response");
    return [];
  } catch (error) {
    console.error("Error fetching IoT devices:", error);
    return [];
  }
};


export const checkMachineAssignment = async (machineUuid) => {
  try {
    const response = await primaryApi.get(`/iot-device/assignment-status/${machineUuid}`);
    if (response.status === 200) {
      return response.data;
    }
    console.error("Failed to fetch IoT devices:", response.message || "Unexpected response");
    return [];
  } catch (error) {
    console.error("Error fetching IoT devices:", error);
    return [];
  }
};


export const createInitialIOTDeviceData = () => {
  return { ...initialIOTDeviceData };
};
