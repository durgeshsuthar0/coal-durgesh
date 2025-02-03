import { addOrUpdatePerson, UpdatePerson, getPersonsExceptSuperAdmin, getPersonById, deletePersonById, getUnassignedRoles, refreshToken, fetchPersonRoles, getRolesByYard, getDesignationTypes } from "../services/allServices/addPersonService";

export const usePerson = () => {

    const handleAddPerson = async (personUuid, data) => {
        try {
            const response = await addOrUpdatePerson(personUuid, data);
            return response;
        } catch (err) {
        }
    };

    const handleUpdatePerson = async (personUuid, data) => {
        try {
            const response = await UpdatePerson(personUuid, data);
            return response;
        } catch (err) {
        }
    };


    const fetchPersons = async (personUUID) => {
        try {
            const response = await getPersonsExceptSuperAdmin(personUUID);
            if (response.status) {
                return response.data;

            }
            return [];
        } catch (err) {
            return [];
        }
    };

    const fetchDesignationType = async () => {
        try {
            const response = await getDesignationTypes();
            if (response.status) {
                return response.data;

            }
            return [];
        } catch (err) {
            return [];
        }
    };

    const fetchPersonById = async (personUUID) => {
        try {
            const response = await getPersonById(personUUID);
            if (response.status) {
                return response.data;
            } else {
            }
        } catch (error) {
        }
    };


    const removePerson = async (personUUID) => {
        try {
            const response = await deletePersonById(personUUID);
            if (response.status) {
                return response.data;
            } else {
                console.error("Failed to delete person:", response.message);
            }
        } catch (error) {
            console.error("Error deleting person:", error);
        }
    };


    const fetchRoleByYard = async (personInfoId, yardId) => {
        try {
            const response = await getRolesByYard(personInfoId, yardId);
            if (response.status) {
                return response;
            }
            return [];
        } catch (err) {
            return [];
        }
    };

    const fetchUnassignedRoles = async (personId, roleName) => {
        try {
            const response = await getUnassignedRoles(personId, roleName);
            if (response.status) {
                return response.data;
            }
            return [];
        } catch (err) {
            return [];
        }
    };


    // const handleAssignRole = async (selectedRoleId, personInfoId, yardId) => {
    //     try {
    //         const response = await assignRoleToPerson(selectedRoleId, personInfoId, yardId);
    //         return response;
    //     } catch (err) {
    //     }
    // };

    const handleRefreshToken = async (email) => {
        try {
            const response = await refreshToken(email);
            if (response.status) {
                return { success: true, message: "Activation link has been refreshed and sent to the email." };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: "An error occurred while refreshing the token." };
        }
    };

    const PersonChange = async (personId, role) => {
        if (!personId) return { data: [] };

        try {
            const response = await fetchPersonRoles(personId, role);
            if (response.status) {
                return response.data;
            }
            return [];
        } catch (error) {
            return [];
        }
    };

    return { handleAddPerson, handleUpdatePerson, fetchPersonById, fetchPersons, removePerson, fetchUnassignedRoles, handleRefreshToken, PersonChange, fetchRoleByYard, fetchDesignationType };
};
