import { primaryApi } from "../api";

export const fetchRoles = async (personUuid) => {
    try {
        const response = await primaryApi.get(
            `/auth/persons/${personUuid}/roles`
        );

        if (response.status === 200) {
            return response.data;
        }
        console.error(
            "Failed to fetch roles data:",
            response.message || "Unexpected response"
        );
        return [];
    } catch (error) {
        console.error("Error fetching roles data:", error);
        throw error;
    }
};
