import React, { useState, useEffect, useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Actions from "../../components/table/action";
import noData from "../../assets/images/noData.png";
import { fetchCompletedJobs } from "../../services/allServices/addContainerService";

export const JobHistorySec = ({ isToggled }) => {
  const [tags, setTags] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [error, setError] = useState(null);

  const role = useSelector((state) => state.auth.roleName);
  const personInfoId = useSelector((state) => state.auth.id);
  const yardId = useSelector((state) => state.auth.selectedYardId);

  useEffect(() => {
    const getCompletedJobs = async () => {
      try {
        const jobs = await fetchCompletedJobs(yardId,personInfoId,role);
        setCompletedJobs(jobs);
        setTags(jobs); // Set API response to tags for table data
      } catch (err) {
        console.error("Error fetching completed jobs:", err);
        setError(err);
      }
    };

    if (personInfoId && yardId) {
      getCompletedJobs();
    }
  }, [personInfoId, yardId]);

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: "sr",
        Cell: ({ row }) => row.index + 1, // Add 1 to row index for "Sr. No"
      },
      {
        Header: "Job ID",
        accessor: "id", // Assuming "id" is the job ID
      },
      {
        Header: "Container ID",
        accessor: "containerId",
      },
      {
        Header: "Pickup Location",
        accessor: "pickupLocation",
      },
      {
        Header: "Drop Location",
        accessor: "dropLocation",
      },
      {
        Header: "Pickup Time",
        accessor: "timestamp",
        Cell: ({ value }) => new Date(value).toLocaleString(), // Format timestamp
      },
      {
        Header: "Duration",
        accessor: "duration", // You'll need to calculate this from pickupTime and dropTime
        // If you want to calculate the duration, add logic here
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Notes",
        accessor: "notes", // If notes are provided in your data
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => {
          return <Actions isAdmin={role === "Operator"} />;
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div
        className={
          isToggled
            ? "inner-content p-3 expand-inner-content"
            : "inner-content p-3"
        }
      >
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/pages/dashboard">
              <FontAwesomeIcon icon={faHouseChimney} />
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Job History</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex justify-content-between align-items-center text-start">
              <h2 className="mb-0">Job History</h2>
            </div>
          </div>
          {tags.length > 0 ? (
            <TableSec columns={columns} data={tags} />
          ) : (
            <div className="form-wrap d-flex justify-content-center">
              <img className="noData-Img" src={noData} alt="No Data Available" />
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};


// import React, { useState, useEffect, useMemo } from "react";
// import { Container } from "react-bootstrap";
// import TableSec from "../../components/table/table";
// import Breadcrumb from "react-bootstrap/Breadcrumb";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
// import Actions from "../../components/table/action";
// import noData from "../../assets/images/noData.png";
// import { fetchCompletedJobs } from "../../services/allServices/addContainerService";
// import { Calendar } from "primereact/calendar"; // Import Calendar from PrimeReact

// export const JobHistorySec = ({ isToggled }) => {
//   const [tags, setTags] = useState([]);
//   const [completedJobs, setCompletedJobs] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null); // Store selected date

//   const role = useSelector((state) => state.auth.roleName);
//   const personInfoId = useSelector((state) => state.auth.id);
//   const yardId = useSelector((state) => state.auth.selectedYardId);

//   useEffect(() => {
//     const getCompletedJobs = async () => {
//       try {
//         const jobs = await fetchCompletedJobs(yardId, personInfoId, role);
//         setCompletedJobs(jobs);
//         setTags(jobs); // Set initial jobs
//       } catch (err) {
//         console.error("Error fetching completed jobs:", err);
//         setError(err);
//       }
//     };

//     if (personInfoId && yardId) {
//       getCompletedJobs();
//     }
//   }, [personInfoId, yardId]);

//   // Filter jobs by selected date
//   const filteredJobs = useMemo(() => {
//     if (!selectedDate) return completedJobs; // Return all jobs if no date selected

//     // Format selected date to match with the pickup timestamp (only the date part)
//     const formattedSelectedDate = selectedDate.toLocaleDateString();

//     return completedJobs.filter((job) => {
//       const jobDate = new Date(job.timestamp).toLocaleDateString();
//       return jobDate === formattedSelectedDate; // Filter based on date
//     });
//   }, [completedJobs, selectedDate]);

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Sr. No",
//         accessor: "sr",
//         Cell: ({ row }) => row.index + 1, // Add 1 to row index for "Sr. No"
//       },
//       {
//         Header: "Job ID",
//         accessor: "id", // Assuming "id" is the job ID
//       },
//       {
//         Header: "Container ID",
//         accessor: "containerId",
//       },
//       {
//         Header: "Pickup Location",
//         accessor: "pickupLocation",
//       },
//       {
//         Header: "Drop Location",
//         accessor: "dropLocation",
//       },
//       {
//         Header: "Pickup Time",
//         accessor: "timestamp",
//         Cell: ({ value }) => new Date(value).toLocaleString(), // Format timestamp
//       },
//       {
//         Header: "Duration",
//         accessor: "duration", // You'll need to calculate this from pickupTime and dropTime
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//       },
//       {
//         Header: "Notes",
//         accessor: "notes", // If notes are provided in your data
//       },
//       {
//         Header: "Actions",
//         accessor: "action",
//         Cell: ({ row }) => {
//           return <Actions isAdmin={role === "Operator"} />;
//         },
//       },
//     ],
//     []
//   );

//   return (
//     <React.Fragment>
//       <div
//         className={
//           isToggled
//             ? "inner-content p-3 expand-inner-content"
//             : "inner-content p-3"
//         }
//       >
//         <Container>
//           <Breadcrumb>
//             <Breadcrumb.Item href="/pages/dashboard">
//               <FontAwesomeIcon icon={faHouseChimney} />
//             </Breadcrumb.Item>
//             <Breadcrumb.Item active>Job History</Breadcrumb.Item>
//           </Breadcrumb>
//           <div className="title">
//             <div className="d-flex justify-content-between align-items-center text-start">
//               <h2 className="mb-0">Job History</h2>
//               {/* PrimeReact Calendar Component */}
//               <Calendar
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.value)} // Update the selected date
//                 dateFormat="yy-mm-dd" // Use your desired date format
//                 placeholder="Select a date"
//                 className="form-control"
//               />
//             </div>
//           </div>
//           {filteredJobs.length > 0 ? (
//             <TableSec columns={columns} data={filteredJobs} />
//           ) : (
//             <div className="form-wrap d-flex justify-content-center">
//               <img className="noData-Img" src={noData} alt="No Data Available" />
//             </div>
//           )}
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };
