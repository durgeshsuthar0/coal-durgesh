import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import CanvasJSReact from "@canvasjs/react-charts";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useYardArea } from "../../hook/useYardArea";
import { useNavbar } from "../../hook/useNavbar";
import noData from "../../assets/images/noData.png";

export const YardAreaOverviewSec = ({ isToggled }) => {
  const personInfoId = useSelector((state) => state.auth.id);
  const itemsPerPage = 6;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [areasData, setAreasData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchYardAreaData } = useYardArea();
  const { yards, selectedYardId, handleYardChange } = useNavbar(personInfoId);

  const yardId = useSelector((state) => state.auth.selectedYardId);

  const totalPages = Math.ceil(areasData.length / itemsPerPage);

  const currentItems = areasData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchYardData = async () => {
      setLoading(true);
      try {
        const yardAreas = await fetchYardAreaData(yardId);

        if (yardAreas.length > 0) {
          const transformedData = yardAreas.map((area) => ({
            title: area.areaName,
            dataPoints: [
              { y: area.occupiedPercentage, label: "Occupied" },
              { y: area.emptyPercentage, label: "Empty" },
            ],
          }));
          setAreasData(transformedData);
          setError(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No data available for the selected yard.");
        } else {
          setError("Error fetching yard area data.");
        }
      } finally {
        setLoading(false); // Stop loading after data fetch or error
      }
    };

    if (yardId) {
      fetchYardData();
    }
  }, [yardId]); // Refetch data when yardId changes

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
            <Breadcrumb.Item active>Yard Area Overview</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Yard Area Overview</h2>
              <p className="mb-0">
                Yard Area Overview shows occupied and empty spaces across multiple
                areas.
              </p>
            </div>
          </div>
  
          <Row>
            {error ? (
              <p>{error}</p> // Display error message if there's an error
            ) : currentItems.length > 0 ? (
              currentItems.map((area, index) => (
                <Col xl={4} lg={6} md={12} key={index} className="mb-4">
                  <Card className="piechart-card shadow-sm">
                    <Card.Body>
                      <div className="chart-title">
                        <h5 className="card-title">{area.title}</h5>
                      </div>
                      <div className="chart-container">
                        <CanvasJSChart
                          options={{
                            animationEnabled: true,
                            data: [
                              {
                                type: "pie",
                                startAngle: 75,
                                toolTipContent: "<b>{label}</b>: {y}%",
                                showInLegend: true,
                                legendText: "{label}",
                                indexLabelFontSize: 16,
                                indexLabel: "{label} {y}%",
                                dataPoints: area.dataPoints,
                              },
                            ],
                            legend: {
                              horizontalAlign: "center",
                              verticalAlign: "bottom",
                              fontSize: 14,
                            },
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
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
  
          <div className="pagination d-flex justify-content-center align-items-center">
            {currentPage > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                <button onClick={() => handlePageChange(currentPage - 1)}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
              </>
            )}
  
            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, index) => {
              // Show first 5 pages, last page, and range around the current page
              if (
                index < 5 ||
                index === totalPages - 1 ||
                (currentPage > 3 &&
                  index > currentPage - 4 &&
                  index < currentPage + 2)
              ) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index === 5 && currentPage > 5) {
                return <span key={index}>...</span>;
              }
              return null;
            })}
  
            {currentPage < totalPages && (
              <>
                <button onClick={() => handlePageChange(currentPage + 1)}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <button onClick={() => handlePageChange(totalPages)}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </button>
              </>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
  
};
