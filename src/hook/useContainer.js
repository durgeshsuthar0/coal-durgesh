import { useState, useEffect } from "react";
import {
  getContainerById,
  getContainerTypeList,
  addContainer,
  getContainers,
  fetchContainerEntryStatus,
  addJobCard,
  getContainerByContainerUniqueNo,
  checkJobStatus,
} from "../services/allServices/addContainerService";

export const useContainer = () => {
 
  const fetchContainerType = async () => {
    try {
      const response = await getContainerTypeList();
      if (response.status) {
        return response.data;
      } else {
        console.error("Failed to fetch container type:", response.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching container type:", error);
      return [];
    }
  };

  // Service file - sendJobCard function
  const sendJobCard = async (formData) => {
    try {
  
      // Call the API to add the job card
      const response = await addJobCard(formData);  // Send the params directly to the API
  
      if (response && response.status) {
        return response; // Return the response only if status is true
      }
  
      // Log and return null if the operation failed
      console.error(
        "Failed to add job card:",
        response.message || "Unknown error"
      );
      return null;
    } catch (err) {
      // Log any error
      console.error("Error in sendJobCard:", err);
      return null;
    }
  };
  
  const sendContainer = async (formData) => {
    try {
      const response = await addContainer(formData);
      if (response.status) {
        return response;
      }
      console.error("Failed to add/update containerType:", response.message);
      return null;
    } catch (err) {
      console.error("Error in submitContainer Type:", err);
      return null;
    }
  };

  const fetchContainerById = async (id) => {
    try {
      const response = await getContainerById(id);
      if (response.status) {
        return response.data;
      }
      console.error("Failed to fetch yard areas:", response.message);
      return [];
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const fetchContainers = async (yardId) => {
    try {
      const response = await getContainers(yardId);
      if (response.status) {
        return response.data;
      } else {
        console.error("Failed to fetch container type:", response.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching container type:", error);
      return [];
    }
  };

  const fetchContainerByContainerUniqueNo = async (containerUniqueNo) => {
    try {
      const response = await getContainerByContainerUniqueNo(containerUniqueNo);
      if (response.status) {
        return response.data;
      }
      console.error("Failed to fetch yard areas:", response.message);
      return [];
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const fetchContainerStatus = async (containerId) => {
    try {
      const response = await checkJobStatus(containerId);
      return response;
    } catch (err) {
      console.error("Error in fetching machine assignment status:", err);
      throw new Error("Failed to fetch machine assignment status");
    }
  };
  
  return {
    fetchContainerType,
    fetchContainerById,
    sendContainer,
    fetchContainers,
    sendJobCard,
    fetchContainerByContainerUniqueNo,
    fetchContainerStatus
  };
};
