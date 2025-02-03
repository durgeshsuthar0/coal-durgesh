import { primaryApi } from "../api";


//Add New Person Api
export const addOrUpdatePerson = async (personUuid, data) => {
  try {
    const response = await primaryApi.post(`/user-management/${personUuid}`, data);
    return {
      status: true,
      message: response.data?.message || "Person added successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error in add person service:", error);
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      return {
        status: false,
        errCode: code || 500,
        message: message || "An unexpected error occurred",
      };
    }
    return {
      status: false,
      message: "An unexpected error occurred",
    };
  }
};

//Update Person Api
export const UpdatePerson = async (personUuid, data) => {
  try {
    const response = await primaryApi.put(`/user-management/${personUuid}`, data);
    return {
      status: true,
      message: response.data?.message || "Person added successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error in add person service:", error);
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      return {
        status: false,
        errCode: code || 500,
        message: message || "An unexpected error occurred",
      };
    }
    return {
      status: false,
      message: "An unexpected error occurred",
    };
  }
};


//GetAll Person API
export const getPersonsExceptSuperAdmin = async (personUUID) => {
  try {
    const response = await primaryApi.get(`/user-management/${personUUID}/roles`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in fetching persons:", error);
    return { status: false, message: "Failed to fetch persons" };
  }
};


export const getDesignationTypes = async () => {
  try {
    const response = await primaryApi.get(`/all-masters/designations-type`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in fetching Designation:", error);
    return { status: false, message: "Failed to fetch Designation" };
  }
};


//Get By Id Person Api
export const getPersonById = async (personUUID) => {
  try {
    const response = await primaryApi.get(`/user-management/${personUUID}/info`);
    return { status: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.error("Error fetching Person:", error.response.data);
      return {
        status: false,
        message: error.response.data.message || "Failed to fetch persons",
      };
    }
    console.error("Error fetching Person:", error);
    return { status: false, message: "Failed to fetch person" };
  }
};


//Delete By personId
export const deletePersonById = async (personUUID) => {
  try {
    const response = await primaryApi.delete(`/user-management/${personUUID}`);
    return { status: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.error("Error deleting person:", error.response.data);
      return { status: false, message: error.response.data.message || "Failed to delete person" };
    }
    console.error("Error deleting person:", error);
    return { status: false, message: "Failed to delete person" };
  }
};
























// This Will Use Later

export const getRolesByYard = async (personInfoId, yardId) => {
  try {
    const response = await primaryApi.get(
      `/yards/roles?personInfoId=${personInfoId}&yardId=${yardId}`
    ); // Call the API
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in fetching persons:", error);
    return { status: false, message: "Failed to fetch persons" };
  }
};

export const getUnassignedRoles = async (personId, roleName) => {
  try {
    const response = await primaryApi.get(`/auth/roles/unassigned`, {
      params: { personId, roleName },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in fetching unassigned roles:", error);
    return { status: false, message: "Failed to fetch unassigned roles" };
  }
};


// Assign a role to a person
// export const assignRoleToPerson = async (selectedRoleId, personInfoId, yardId) => {
//   try {
//     const response = await primaryApi.post(
//       `/auth/assign-roles`,
//       { id: selectedRoleId },
//       {
//         params: {
//           personInfoId,
//           yardId
//         }
//       }
//     );
//     return { status: true, data: response.data };
//   } catch (error) {
//     console.error("Error assigning role:", error);
//     return { status: false, message: "Failed to assign role" };
//   }
// };


export const refreshToken = async (email) => {
  try {
    const response = await primaryApi.post("/auth/refresh-token", null, {
      params: { email },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in refreshing token:", error);
    if (error.response && error.response.status === 400) {
      return {
        status: false,
        message: "Your activation token is still valid.",
      };
    }
    return {
      status: false,
      message: "An error occurred while refreshing the token.",
    };
  }
};

export const fetchPersonRoles = async (personId, role) => {
  try {
    const response = await primaryApi.get(
      `/auth/persons/${personId}/roles/${role}`
    );
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error in fetching roles:", error);
    return { status: false, message: "Failed to fetch roles", data: [] };
  }
};

