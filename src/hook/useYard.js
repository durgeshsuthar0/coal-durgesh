import { useSelector } from "react-redux";
import {
  addYard,
  UpdateYard,
  getAssignedYards,
  deleteYardById,
  assignYard, getYardById,
  getAvailablePersons, getLocation, getYardAreaByYardId,

} from "../services/allServices/yardService";

export const useYard = () => {
  const personUUID = useSelector((state) => state.auth.personUUID);
  const role = useSelector((state) => state.auth.roleName);
  const personInfoId = useSelector((state) => state.auth.id);

  const saveYard = async (yardData) => {
    try {
      const response = await addYard(personUUID, yardData);
      if (response.status) {
        return response;
      } else {
        console.error("Failed to save yard:", response.message);
        return null;
      }
    } catch (error) {
      console.error("Full error object:", error);
      return null;
    }
  };


  const updateYard = async (yardData) => {
    try {
      const response = await UpdateYard(personUUID, yardData);
      if (response.status) {
        return response;
      } else {
        console.error("Failed to save yard:", response.message);
        return null;
      }
    } catch (error) {
      console.error("Full error object:", error);
      return null;
    }
  };


  // Function to get assigned yards
  const fetchYard = async () => {
    try {
      const response = await getAssignedYards(personUUID, role);
      if (response.status) {
        return response.data; // Return the list of yards
      } else {
        console.error("Failed to fetch yards:", response.message);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
    }
  };

  const fetchYardById = async (id) => {
    try {
      const response = await getYardById(id);
      if (response.status) {
        return response.data; // Return the list of yards
      } else {
        console.error("Failed to fetch yards:", response.message);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
    }
  };


  const fetchLocation = async () => {
    try {
      const response = await getLocation(); // This should return the location data

      if (response && response.status === true && response.data && response.data.MST_LOCATION) {
        return response.data.MST_LOCATION; // Make sure this path is correct
      } else {
        throw new Error('Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error; // Rethrow to handle it further up
    }
  };


  const removeYard = async (yardId) => {
    try {
      const response = await deleteYardById(yardId);
      if (response.status) {
        return response.data;
      } else {
        console.error("Failed to delete yard:", response.message);
      }
    } catch (error) {
      console.error("Error deleting yard:", error);
    }
  };

  // Function to assign a yard
  const assignYardToPerson = async (personInfoId, yardId, role) => {
    try {
      const response = await assignYard(personInfoId, yardId, role);
      if (response.status) {
        return response.data; // Return the assigned yard data
      } else {
        console.error("Failed to assign yard:", response.message);
      }
    } catch (error) {
      console.error("Error assigning yard:", error);
    }
  };

  const fetchAvailablePersons = async (currentUserRole, yardId, personUUID) => {
    try {
      const response = await getAvailablePersons(currentUserRole, yardId, personUUID);
      if (response.status) {
        return response.data;
      } else {
        console.error("Failed to fetch available persons:", response.message);
      }
    } catch (error) {
      console.error("Error fetching available persons:", error);
    }
  };


  return {
    saveYard,
    updateYard,
    fetchYard,
    removeYard,
    assignYard: assignYardToPerson,
    fetchAvailablePersons, fetchLocation, fetchYardById
  };
};
