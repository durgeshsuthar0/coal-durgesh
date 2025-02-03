// src/services/allServices/tagInventoryService.js
import { primaryApi } from '../api';

// Create or update tag
export const addOrUpdateTag = async (tagData) => {
  try {
    const response = await primaryApi.post('/tag-inventory', tagData);  // POST request
    return { status: true, data: response.data }; // Return data if the request was successful
  } catch (error) {
    if (error.response) {
      console.error("Error in adding/updating tag:", error.response.data);
      return { status: false, message: error.response.data.message || "Failed to add/update tag" };
    }
    console.error("Error in adding/updating tag:", error);
    return { status: false, message: "Failed to add/update tag" };
  }
};



// Fetch all tags
export const getTagList = async (yardId) => {
  try {
    const response = await primaryApi.get(`/tag-inventory/yards/${yardId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { status: false, message: "Failed to fetch tags" };
  }
};

// // Fetch tag by ID
// export const getTagById = async (id) => {
//   try {
//     const response = await primaryApi.get(`/tag-inventory/${id}`);
//     return { status: true, data: response.data };
//   } catch (error) {
//     console.error("Error fetching tag by ID:", error);
//     return { status: false, message: "Failed to fetch tag" };
//   }
// };

// // Delete tag by ID
// export const deleteTagById = async (id) => {
//   try {
//     const response = await primaryApi.delete(`/tag-inventory/${id}`);
//     return { status: true, message: "Tag deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting tag:", error);
//     return { status: false, message: "Failed to delete tag" };
//   }
// };
