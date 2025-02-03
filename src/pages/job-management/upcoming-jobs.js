 
// import React, { useState, useEffect } from "react";
// import {
//   Col,
//   Container,
//   Row,
//   Breadcrumb,
//   Button,
//   Badge,
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHouseChimney,faPause } from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
// import {
//   fetchAssignedJobsByOperator,
//   fetchJobsByAreaManager,
//   saveOrUpdateJob,
// } from "../../services/allServices/addContainerService";
// import { toast } from "react-toastify";
// import noData from "../../assets/images/noData.png";
 
// export const UpcomingJobDetailsSec = ({ isToggled }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [jobAssignments, setJobAssignments] = useState([]);
//   const [timers, setTimers] = useState({});
//   const personInfoId = useSelector((state) => state.auth.id);
//   const role = useSelector((state) => state.auth.roleName);
//   const formatElapsedTime = (elapsedTime) => {
//     const seconds = Math.floor((elapsedTime / 1000) % 60);
//     const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
//     const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };
 
//   // useEffect(() => {
//   //   const initializeJobAssignments = async () => {
//   //     try {
//   //       setLoading(true);
//   //       let data = [];
//   //       if (role === "AREAMANAGER") {
//   //         data = await fetchJobsByAreaManager(personInfoId);
//   //       } else {
//   //         data = await fetchAssignedJobsByOperator(personInfoId);
//   //       }
//   //       setJobAssignments(
//   //         data.map((job) => ({
//   //           ...job,
//   //           buttons: {
//   //             startDisabled: false,
//   //             pauseDisabled: true,
//   //             completeDisabled: true,
//   //           },
//   //         }))
//   //       );
//   //     } catch (err) {
//   //       console.error(err);
//   //       setError(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
 
//   //   initializeJobAssignments();
//   // }, [personInfoId, role]);
 
//   useEffect(() => {
//     const initializeJobAssignments = async () => {
//       try {
//         setLoading(true);
//         let data = [];
//         if (role === "AREAMANAGER") {
//           data = await fetchJobsByAreaManager(personInfoId);
//         } else {
//           data = await fetchAssignedJobsByOperator(personInfoId);
//         }
  
//         // Filter out the first record and only keep the second list
//         const filteredData = data[1] ? data[1] : []; // Ensure data[1] exists before setting it
  
//         setJobAssignments(
//           filteredData.map((job) => ({
//             ...job,
//             buttons: {
//               startDisabled: false,
//               pauseDisabled: true,
//               completeDisabled: true,
//             },
//           }))
//         );
//       } catch (err) {
//         console.error(err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     initializeJobAssignments();
//   }, [personInfoId, role]);
  
//   useEffect(() => {
//     window.addEventListener("beforeunload", handleLogout);
 
//     return () => {
//       window.removeEventListener("beforeunload", handleLogout);
//     };
//   }, [jobAssignments]);
 
//   const handleLogout = async () => {
//     for (const job of jobAssignments) {
//       if (timers[job.id]?.isRunning) {
//         await saveOrUpdateJob(job.id, personInfoId, "Pause");
//       }
//     }
//   };
 
//   const handleAction = async (jobId, action) => {
//     try {
//       await saveOrUpdateJob(jobId, personInfoId, action);
 
//       setJobAssignments((prevJobs) =>
//         prevJobs.map((job) =>
//           job.id === jobId
//             ? {
//                 ...job,
//                 // buttons: {
//                 //   startDisabled: action === "Start" || action === "Complete",
//                 //   pauseDisabled: action === "Pause" || action === "Complete",
//                 //   completeDisabled: action !== "Complete",
//                 // },
//                 buttons: {
//                   startDisabled: action === "Start" || action === "Complete",
//                   pauseDisabled: action !== "Start" && action !== "Pause",
//                   completeDisabled: action !== "Start" && action !== "Complete",
//                 },
//               }
//             : job
//         )
//       );
 
//       if (action === "Start") {
//         const timerInterval = setInterval(() => {
//           setTimers((prev) => ({
//             ...prev,
//             [jobId]: {
//               ...prev[jobId],
//               elapsedTime: (prev[jobId]?.elapsedTime || 0) + 1000,
//               isRunning: true,
//             },
//           }));
//         }, 1000);
 
//         setTimers((prev) => ({
//           ...prev,
//           [jobId]: { startTime: Date.now(), elapsedTime: 0, timerInterval, isRunning: true },
//         }));
//       } else if (action === "Pause") {
//         clearInterval(timers[jobId]?.timerInterval);
//         setTimers((prev) => ({
//           ...prev,
//           [jobId]: { ...prev[jobId], isRunning: false },
//         }));
//       } else if (action === "Complete") {
//         clearInterval(timers[jobId]?.timerInterval);
//         setTimers((prev) => ({
//           ...prev,
//           [jobId]: { ...prev[jobId], isRunning: false },
//         }));
//         toast.success("Job completed successfully!");
//       }
//     } catch (error) {
//       console.error(`Failed to ${action} job:`, error);
//     }
//   };
 
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching containers: {error.message}</div>;
 
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
//             <Breadcrumb.Item active>Container Details</Breadcrumb.Item>
//           </Breadcrumb>
//           <div className="title">
//             <h2 className="text-start">Container Details</h2>
//           </div>
          
//           <Row>
//             {jobAssignments.map((job) => {
//               const timer = timers[job.id] || {};
//               const elapsedTime = timer.elapsedTime || 0;
 
//               return (
//                 <Col md="4" className="mb-3" key={job.id}>
//                   <div className="form-wrap">
//                   <h6>
//                       Operator :{" "}
//                       <span className="fw-bold">{job.firstName} {job.lastName}</span>
//                     </h6>
//                     <h6>
//                       Pickup Location :{" "}
//                       <span className="fw-bold">{job.pickupLocation}</span>
//                     </h6>
//                     <h6>
//                       Drop Location :{" "}
//                       <span className="fw-bold">{job.yardArea}</span>
//                     </h6>
//                     <h6>
//                       Assign Time :{" "}
//                       <span className="fw-bold">
//                         {job.timestamp}
//                       </span>
//                     </h6>
//                     <h6>
//                       Container Unique No :{" "}
//                       <span className="fw-bold">{job.containerUniqueNumber}</span>
//                     </h6>
//                     <h6>
//                       Status :{" "}
//                       <Badge
//                         bg={job.status === "Active" ? "success" : "danger"}
//                       >
//                         {job.status}
//                       </Badge>
//                     </h6>
//                     {role !== "AREAMANAGER" && (
//                       <div>
//                         <h6>
//                           Timer :{" "}
//                           <span className="fw-bold">
//                             {formatElapsedTime(elapsedTime)}
//                           </span>
//                         </h6>
//                         <div className="mt-3 d-flex justify-content-between">
//                         <Button
//                           size="sm"
//                           disabled={job.buttons.startDisabled}
//                           onClick={() => handleAction(job.id, "Start")}
//                         >
//                           Start
//                         </Button>{" "}
//                         <Button
//                           size="sm"
//                           variant="warning"
//                           disabled={job.buttons.pauseDisabled}
//                           onClick={() => handleAction(job.id, "Pause")}
//                         >
//                           Pause <FontAwesomeIcon icon={faPause} />
//                         </Button>{" "}
//                         <Button
//                           size="sm"
//                           variant="danger"
//                           disabled={job.buttons.completeDisabled}
//                           onClick={() => handleAction(job.id, "Complete")}
//                         >
//                           Complete
//                         </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </Col>
//               );
//             })}
//           </Row>
//           <div className="form-wrap d-flex justify-content-center">
//           <img
//             className="noData-Img"
//             src={noData}
//             alt="No Data Available"
//           />
//         </div>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };


// // import React, { useState, useEffect } from "react";
// // import {
// //   Col,
// //   Container,
// //   Row,
// //   Breadcrumb,
// //   Button,
// //   Badge,
// // } from "react-bootstrap";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faHouseChimney, faPause } from "@fortawesome/free-solid-svg-icons";
// // import { useSelector } from "react-redux";
// // import {
// //   fetchAssignedJobsByOperator,
// //   fetchJobsByAreaManager,
// //   saveOrUpdateJob,
// // } from "../../services/allServices/addContainerService";
// // import { format } from "date-fns";
// // import { toast } from "react-toastify";

// // export const ContainerDetailsSec = ({ isToggled }) => {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [jobAssignments, setJobAssignments] = useState([]);
// //   const [timers, setTimers] = useState({});
// //   const personInfoId = useSelector((state) => state.auth.id);
// //   const role = useSelector((state) => state.auth.roleName);

// //   const formatTimestamp = (timestampArray) => {
// //     const timestamp = new Date(
// //       timestampArray[0],
// //       timestampArray[1] - 1,
// //       timestampArray[2],
// //       timestampArray[3],
// //       timestampArray[4],
// //       timestampArray[5]
// //     );
// //     return format(timestamp, "dd/MM/yyyy hh:mm a");
// //   };

//   // const formatElapsedTime = (elapsedTime) => {
//   //   const seconds = Math.floor((elapsedTime / 1000) % 60);
//   //   const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
//   //   const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
//   //   return `${hours}h ${minutes}m ${seconds}s`;
//   // };

// //   useEffect(() => {
// //     const initializeJobAssignments = async () => {
// //       try {
// //         setLoading(true);
// //         let data = [];
// //         if (role === "AREAMANAGER") {
// //           data = await fetchJobsByAreaManager(personInfoId);
// //         } else {
// //           data = await fetchAssignedJobsByOperator(personInfoId);
// //         }
// //         setJobAssignments(
// //           data.map((job) => ({
// //             ...job,
// //             buttons: {
// //               startDisabled: false,
// //               pauseDisabled: true,
// //               completeDisabled: true,
// //             },
// //           }))
// //         );
// //       } catch (err) {
// //         console.error(err);
// //         setError(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     initializeJobAssignments();
// //   }, [personInfoId, role]);

// //   useEffect(() => {
// //     window.addEventListener("beforeunload", handleLogout);

// //     return () => {
// //       window.removeEventListener("beforeunload", handleLogout);
// //     };
// //   }, [jobAssignments]);

// //   const handleLogout = async () => {
// //     for (const job of jobAssignments) {
// //       if (timers[job.id]?.isRunning) {
// //         await saveOrUpdateJob(job.id, personInfoId, "Pause");
// //       }
// //     }
// //   };

// //   const handleAction = async (jobId, action) => {
// //     try {
// //       await saveOrUpdateJob(jobId, personInfoId, action);

// //       // Update job assignments with the action state and button states
// //       setJobAssignments((prevJobs) =>
// //         prevJobs.map((job, index) => {
// //           // Update the job status and button states based on the action
// //           const isJobUpdated = job.id === jobId;
// //           const isFirstIncompleteJob = prevJobs.findIndex(
// //             (j) => j.status !== "Completed"
// //           ) === index;

// //           return {
// //             ...job,
// //             buttons: {
// //               startDisabled: action === "Start" || action === "Complete",
// //               pauseDisabled: action !== "Start" && action !== "Pause",
// //               completeDisabled: action !== "Start" && action !== "Complete",
// //             },
// //             status: action === "Complete" ? "Completed" : job.status,
// //           };
// //         })
// //       );

// //       // Timer logic
// //       if (action === "Start") {
// //         const timerInterval = setInterval(() => {
// //           setTimers((prev) => ({
// //             ...prev,
// //             [jobId]: {
// //               ...prev[jobId],
// //               elapsedTime: (prev[jobId]?.elapsedTime || 0) + 1000,
// //               isRunning: true,
// //             },
// //           }));
// //         }, 1000);

// //         setTimers((prev) => ({
// //           ...prev,
// //           [jobId]: { startTime: Date.now(), elapsedTime: 0, timerInterval, isRunning: true },
// //         }));
// //       } else if (action === "Pause") {
// //         clearInterval(timers[jobId]?.timerInterval);
// //         setTimers((prev) => ({
// //           ...prev,
// //           [jobId]: { ...prev[jobId], isRunning: false },
// //         }));
// //       } else if (action === "Complete") {
// //         clearInterval(timers[jobId]?.timerInterval);
// //         setTimers((prev) => ({
// //           ...prev,
// //           [jobId]: { ...prev[jobId], isRunning: false },
// //         }));
// //         toast.success("Job completed successfully!");
// //       }
// //     } catch (error) {
// //       console.error(`Failed to ${action} job:`, error);
// //     }
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error fetching containers: {error.message}</div>;

// //   return (
// //     <React.Fragment>
// //       <div
// //         className={
// //           isToggled
// //             ? "inner-content p-3 expand-inner-content"
// //             : "inner-content p-3"
// //         }
// //       >
// //         <Container>
// //           <Breadcrumb>
// //             <Breadcrumb.Item href="/pages/dashboard">
// //               <FontAwesomeIcon icon={faHouseChimney} />
// //             </Breadcrumb.Item>
// //             <Breadcrumb.Item active>Container Details</Breadcrumb.Item>
// //           </Breadcrumb>
// //           <div className="title">
// //             <h2 className="text-start">Container Details</h2>
// //           </div>
// //           <Row>
// //             {jobAssignments.map((job, index) => {
// //               const timer = timers[job.id] || {};
// //               const elapsedTime = timer.elapsedTime || 0;

// //               // Find the first job that is not completed
// //               const firstIncompleteJob = jobAssignments.find(
// //                 (j) => j.status !== "Completed"
// //               );

// //               return (
// //                 <Col md="4" className="mb-3" key={job.id}>
// //                   <div className="form-wrap">
// //                     <h6>
// //                       Operator :{" "}
// //                       <span className="fw-bold">{job.firstName} {job.lastName}</span>
// //                     </h6>
// //                     <h6>
// //                       Pickup Location :{" "}
// //                       <span className="fw-bold">{job.pickupLocation}</span>
// //                     </h6>
// //                     <h6>
// //                       Drop Location :{" "}
// //                       <span className="fw-bold">{job.yardArea}</span>
// //                     </h6>
// //                     <h6>
// //                       Assign Time :{" "}
// //                       <span className="fw-bold">
// //                         {formatTimestamp(job.timestamp)}
// //                       </span>
// //                     </h6>
// //                     <h6>
// //                       Container Unique No :{" "}
// //                       <span className="fw-bold">{job.containerUniqueNumber}</span>
// //                     </h6>
// //                     <h6>
// //                       Status :{" "}
// //                       <Badge
// //                         bg={job.status === "Active" ? "success" : "danger"}
// //                       >
// //                         {job.status}
// //                       </Badge>
// //                     </h6>
// //                     {role !== "AREAMANAGER" && (
// //                       <div>
// //                         <h6>
// //                           Timer :{" "}
// //                           <span className="fw-bold">
// //                             {formatElapsedTime(elapsedTime)}
// //                           </span>
// //                         </h6>
// //                         <div className="mt-3 d-flex justify-content-between">
// //                           {/* Only show buttons for the first incomplete job */}
// //                           {job.id === firstIncompleteJob?.id && (
// //                             <>
// //                               <Button
// //                                 size="sm"
// //                                 onClick={() => handleAction(job.id, "Start")}
// //                               >
// //                                 Start
// //                               </Button>{" "}
// //                               <Button
// //                                 size="sm"
// //                                 variant="warning"
// //                                 onClick={() => handleAction(job.id, "Pause")}
// //                               >
// //                                 Pause <FontAwesomeIcon icon={faPause} />
// //                               </Button>{" "}
// //                               <Button
// //                                 size="sm"
// //                                 variant="danger"
// //                                 onClick={() => handleAction(job.id, "Complete")}
// //                               >
// //                                 Complete
// //                               </Button>
// //                             </>
// //                           )}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </Col>
// //               );
// //             })}
// //           </Row>
// //         </Container>
// //       </div>
// //     </React.Fragment>
// //   );
// // };




 
import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  Button,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney,faPause } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import {
  fetchAssignedJobsByOperator,
  fetchJobsByAreaManager,
} from "../../services/allServices/addContainerService";
import { toast } from "react-toastify";
import noData from "../../assets/images/noData.png";
 
export const UpcomingJobDetailsSec = ({ isToggled }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobAssignments, setJobAssignments] = useState([]);
  const [timers, setTimers] = useState({});
  const personInfoId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.roleName);

  const formatElapsedTime = (elapsedTime) => {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  //   const initializeJobAssignments = async () => {
  //     try {
  //       setLoading(true);
  //       let data = [];
  //       if (role === "AREAMANAGER") {
  //         data = await fetchJobsByAreaManager(personInfoId);
  //       } else {
  //         data = await fetchAssignedJobsByOperator(personInfoId);
  //       }
  
  //       // Filter out the first record and only keep the second list
  //       const filteredData = data[1] ? data[1] : []; // Ensure data[1] exists before setting it
  
  //       setJobAssignments(
  //         filteredData.map((job) => ({
  //           ...job,
  //           buttons: {
  //             startDisabled: false,
  //             pauseDisabled: true,
  //             completeDisabled: true,
  //           },
  //         }))
  //       );
  //     } catch (err) {
  //       console.error(err);
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   initializeJobAssignments();
  // }, [personInfoId, role]);
  
  useEffect(() => {
    const initializeJobAssignments = async () => {
      try {
        setLoading(true);
        let data = [];
        if (role === "AREAMANAGER") {
          data = await fetchJobsByAreaManager(personInfoId);
  
          setJobAssignments(
            data.map((job) => ({
              ...job,
            }))
          );
        } else {
          data = await fetchAssignedJobsByOperator(personInfoId);
          // Filter out the first record and only keep the second list
          const filteredData = data[1] ? data[1] : []; // Ensure data[1] exists
          setJobAssignments(filteredData);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    initializeJobAssignments();
  }, [personInfoId, role]);
  
 
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
            <Breadcrumb.Item active>Container Details</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <h2 className="text-start">Container Details</h2>
          </div>
          
           <Row>
            {jobAssignments.length > 0 ? (
              jobAssignments.map((job) => (
                <Col md="4" className="mb-3" key={job.id}>
                  <div className="form-wrap">
                    <h6>
                      Operator :{" "}
                      <span className="fw-bold">
                        {job.firstName} {job.lastName}
                      </span>
                    </h6>
                    <h6>
                      Pickup Location :{" "}
                      <span className="fw-bold">{job.pickupLocation}</span>
                    </h6>
                    <h6>
                      Drop Location :{" "}
                      <span className="fw-bold">{job.yardArea}</span>
                    </h6>
                    <h6>
                      Assign Time :{" "}
                      <span className="fw-bold">{job.timestamp}</span>
                    </h6>
                    <h6>
                      Container Unique No :{" "}
                      <span className="fw-bold">{job.containerUniqueNumber}</span>
                    </h6>
                    <h6>
                      Status :{" "}
                      <Badge bg={job.status === "Active" ? "success" : "danger"}>
                        {job.status}
                      </Badge>
                    </h6>
                  </div>
                </Col>
              ))
            ) : (
              <div className="form-wrap d-flex justify-content-center">
                <img
                  className="noData-Img"
                  src={noData}
                  alt="No Data Available"
                />
              </div>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
