// hooks/useShifts.js
import { useState, useEffect } from "react";
import { getShiftTypesByYardId, getShiftsForEmployee } from "../services/allServices/shiftRoster";

export const useShifts = (yardId, personInfoUuid) => {
    const [shiftTypes, setShiftTypes] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShiftsData = async () => {
            setLoading(true);
            console.log("Fetching shift data...");

            try {
                const shiftTypesData = await getShiftTypesByYardId(yardId);
                console.log("Shift Types Data:", shiftTypesData);
                setShiftTypes(shiftTypesData.data);

                const shiftsData = await getShiftsForEmployee(personInfoUuid);
                console.log("Shifts Data:", shiftsData);
                setShifts(shiftsData.data);
            } catch (err) {
                setError("Error fetching shifts or shift types");
                console.error("Error fetching shift data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (yardId && personInfoUuid) {
            fetchShiftsData();
        }
    }, [yardId, personInfoUuid]);

    return { shiftTypes, shifts, loading, error };
};
