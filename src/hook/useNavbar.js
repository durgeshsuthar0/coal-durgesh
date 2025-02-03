import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie"; // Import js-cookie
import { setYardId } from "../redux/action"; // Adjust the path as necessary
import { fetchAssignedYards } from "../services/allServices/navbarService";
import { useSelector } from "react-redux";

export const useNavbar = (personInfoId) => {
  const dispatch = useDispatch();
  const [yards, setYards] = useState([]);
  const [selectedYardId, setSelectedYardId] = useState(null);
  const role = useSelector((state) => state.auth.roleName); 

  useEffect(() => {
    const fetchYards = async () => {
      try {
        const data = await fetchAssignedYards(personInfoId);
        setYards(data.data);

        // Check cookies for previously selected yard ID
        const storedYardId = Cookies.get("yard");

        if (storedYardId) {
          setSelectedYardId(parseInt(storedYardId)); // Restore selected yard from cookies
          dispatch(setYardId(parseInt(storedYardId)));
        } else if (data.data.length > 0) {
          // No stored yard, select the latest created yard as default
          const latestYard = data.data.reduce((prev, current) => (prev.id > current.id ? prev : current));
          setSelectedYardId(latestYard.id);
          dispatch(setYardId(latestYard.id));
          // Cookies.set("yard", latestYard.id); // Save the selected yard to cookies
        }
      } catch (error) {
        console.error("Error fetching yard data:", error);
      }
    };

    fetchYards();
  }, [personInfoId, dispatch]);

  const handleYardChange = (yardId) => {
    setSelectedYardId(yardId);
    dispatch(setYardId(yardId));
    // Cookies.set("yard", yardId); // Save selected yard ID to cookies
    window.location.reload();
  };

  return { yards, selectedYardId, handleYardChange };
};
