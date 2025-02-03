import { useEffect, useState } from "react";
import { fetchAreaSpaceData, fetchAreaData,fetchContainerData } from "../services/allServices/dashboardService";

export const useDashboardData = (yardId) => {
  const [areaData, setAreaData] = useState([]);
  const [spaceData, setSpaceData] = useState([]);
  const [containerData, setContainerData] = useState({
    totalEntryContainers: 0,
    entryByRail: 0,
    entryByRoad: 0,
    totalExitContainers: 0,
    exitByRail: 0,
    exitByRoad: 0,
  });

  const [options, setOptions] = useState({
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1",
    title: {},
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y}%",
        startAngle: -90,
        dataPoints: [],
      },
    ],
  });

  const [options1, setOptions1] = useState({
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1",
    title: {},
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y}%",
        startAngle: -90,
        dataPoints: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch area data
        const areaData = await fetchAreaData(yardId);
        setAreaData(areaData);

        // Fetch space data
        const areaSpaceData = await fetchAreaSpaceData(yardId);
        setSpaceData(areaSpaceData);

        // Fetch container data
        const containerData = await fetchContainerData(yardId);
        if (containerData) {
          setContainerData(containerData);
        }

        // Map area data to data points
        const areaDataPoints = areaData.map((area) => ({
          y: area.occupiedPercentage,
          label: area.areaName,
        }));

        // Map space data to data points
        const spaceDataPoints = areaSpaceData.map((space) => ({
          y: space.occupiedPercentage,
          label: space.areaName,
        }));

        // Update options with area data points
        setOptions((prevOptions) => ({
          ...prevOptions,
          data: [{ ...prevOptions.data[0], dataPoints: areaDataPoints }],
        }));

        // Update options1 with space data points
        setOptions1((prevOptions1) => ({
          ...prevOptions1,
          data: [{ ...prevOptions1.data[0], dataPoints: spaceDataPoints }],
        }));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [yardId]);

  return {
    areaData,
    spaceData,
    containerData,  // Return container data as well
    options,
    options1,
  };
};
