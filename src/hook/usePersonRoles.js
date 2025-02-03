import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRoles } from "../services/allServices/fetchRoles";
import { useSelector } from "react-redux";
import { setRoleName } from "../redux/action";

export const usePersonRoles = () => {
    const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const personUuid = useSelector((state) => state.auth.personUUID);

    useEffect(() => {
        const fetchRolesData = async () => {
            try {
                const data = await fetchRoles(personUuid);
                setRoles(data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRolesData();
    }, [personUuid]);

    const handleRoleChange = (e) => {
        setSelectedRole(e.value);
        dispatch(setRoleName(e.value));
    };

    return { roles, selectedRole, handleRoleChange };
};
