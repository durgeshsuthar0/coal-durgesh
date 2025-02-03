import {
  getAreaTypeList,
  getYardList,
  addOrUpdateYardArea,
  getYardAreasListByYardId,
  fetchEligibleContainers,
  deleteYardAreaById,
  getYardAreaById,
  getYardAreaDataByYardId,
  assignYardArea,
  getAvailablePersons,
  getYardAreaByYardId,fetchMachinesByYardArea
} from "../services/allServices/yardAreaService";

const getMachinesByYardArea = async (yardAreaId) => {
  try {
    const response = await fetchMachinesByYardArea(yardAreaId);
    if (response.status) {
      return response.data;
    }
    console.error("Failed to fetch Yard:", response.message);
    return [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

const getEligibleContainers = async (yardId,yardAreaId) => {
  try {
    const response = await fetchEligibleContainers(yardId,yardAreaId);
    if (response.status) {
      return response.data;
    }
    console.error("Failed to fetch Yard:", response.message);
    return [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

const fetchAreaTypes = async () => {
  try {
    const response = await getAreaTypeList();
    if (response.status) {
      return response.data;
    }
    console.error("Failed to fetch area types:", response.message);
    return [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

const fetchYard = async () => {
  try {
    const response = await getYardList();
    if (response.status) {
      return response.data;
    }
    console.error("Failed to fetch Yard:", response.message);
    return [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

export const useYardArea = () => {
  const submitYardArea = async (personInfoId, data) => {
    try {
      const response = await addOrUpdateYardArea(personInfoId, data);
      if (response.status) {
        return response;
      }
      console.error("Failed to add/update yard area:", response.message);
      return null;
    } catch (err) {
      console.error("Error in submitYardArea:", err);
      return null;
    }
  };

  const deleteYardArea = async (yardAreaId) => {
    try {
      const response = await deleteYardAreaById(yardAreaId);
      return response;
    } catch (err) {
      console.error("Error in deleteYardArea:", err);
      return { status: false, message: "Failed to delete yard area" };
    }
  };

  const fetchYardAreas = async (yardId, role, personInfoId) => {
    try {
      const response = await getYardAreasListByYardId(
        yardId,
        role,
        personInfoId
      );
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

  const fetchYardAreaById = async (Id) => {
    try {
      const response = await getYardAreaById(Id);
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

  const fetchYardAreaData = async (yardId) => {
    try {
      const response = await getYardAreaDataByYardId(yardId);
      return response.data; // Return the data directly for further processing
    } catch (error) {
      console.error("Error in fetching yard area data:", error);
      throw new Error("Failed to fetch yard area data");
    }
  };

  const assignYardTAreaoPerson = async (personInfoId, yardAreaId, yardId) => {
    try {
      const response = await assignYardArea(personInfoId, yardAreaId, yardId);
      if (response.status) {
        return response.data; // Return the assigned yard area data
      } else {
        console.error("Failed to assign yard area:", response.message);
      }
    } catch (error) {
      console.error("Error assigning yard area:", error);
    }
  };

  const fetchAvailablePersons = async (currentUserRole, yardAreaId,personInfoId) => {
    try {
      const response = await getAvailablePersons(currentUserRole, yardAreaId,personInfoId);
      if (response.status) {
        return response.data; // Return available persons list
      }
      console.error("Failed to fetch available persons:", response.message);
      return [];
    } catch (error) {
      console.error("Error fetching available persons:", error);
      return [];
    }
  };

  const fetchYardAreasByYardId = async (yardId) => {
    try {
      const response = await getYardAreaByYardId(yardId);
      if (response.status) {
        return response.data;
      }
      console.error("Failed to fetch Yard:", response.message);
      return [];
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  return {
    fetchAreaTypes,
    fetchYard,
    submitYardArea,
    fetchYardAreas,
    deleteYardArea,
    getEligibleContainers,
    fetchYardAreaById,
    fetchYardAreaData,
    assignYardTAreaoPerson,
    fetchAvailablePersons,
    fetchYardAreasByYardId,getMachinesByYardArea
  }; // Add fetchYardAreas to the return
};
