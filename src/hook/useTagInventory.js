import { addOrUpdateTag, getTagList, getTagById, deleteTagById } from "../services/allServices/tagInventoryService";

export const useTagInventory = () => {
 
  const saveTag = async (tagData) => {
    try {
      const response = await addOrUpdateTag(tagData);
      if (response.status) {
        return response; 
      } else {
        console.error("Failed to save tag:", response.message);
        return response; 
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      console.error("Full error object:", error);
      return error; 
    }
  };

  const fetchTags = async (yardId) => {
    try {
      const response = await getTagList(yardId);
      return response;
    } catch (error) {
      console.error("Error fetching tags:", error);
      return { status: false, message: "Error fetching tags" };
    }
  };

  return {
    saveTag,
    fetchTags
  };
};
