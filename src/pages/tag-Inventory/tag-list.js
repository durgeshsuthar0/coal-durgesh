import React, { useState, useEffect, useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import TableSec from "../../components/table/table";
import Status from "../../components/table/status";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import noData from "../../assets/images/noData.png";
import { useTagInventory } from "../../hook/useTagInventory"; 

export const TagInventoryListSec = ({ isToggled }) => {

  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  const role = useSelector((state) => state.auth.roleName);
  const yardId = useSelector((state) => state.auth.selectedYardId);

  const { fetchTags } = useTagInventory();

  const handleAdd = () => {
    navigate("/pages/add-tag");
  };

  useEffect(() => {
    fetchTag();
  }, []);

  const fetchTag = async () => {
    try {
      const response = await fetchTags(yardId);
      if (response && response.data && Array.isArray(response.data)) {
        setTags(response.data);
      } else {
        console.error("Fetched data is not an array:", response);
        setTags([]);
      }
    } catch (error) {
      console.error("Error fetching yards:", error);
      setTags([]);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: "sr",
        Cell: ({ row }) => row.index + 1,
      },

      {
        Header: "Tag Name",
        accessor: "tagName",
      },

      {
        Header: "Tag Status",
        accessor: "assign",
        Cell: ({ value }) => (
          <Status status={value} trueMessage="Assigned" falseMessage="Not-Assigned" />
        ),
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
            <Breadcrumb.Item active>Tag History</Breadcrumb.Item>
          </Breadcrumb>
          <div className="title">
            <div className="d-flex justify-content-between align-items-center text-start">
              <h2 className="mb-0">Tag History</h2>
              <div>
                {role !== "SUPERADMIN" && (
                  <Button
                    onClick={handleAdd}
                    variant="light"
                    className="btn-style"
                  >
                    <div className="btn-icon-style">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span className="d-none d-lg-block d-md-block">
                      Add Tag
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          {tags.length > 0 ? (
           <TableSec columns={columns} data={tags} />
      ) : (
        <div className="form-wrap d-flex justify-content-center">
          <img
            className="noData-Img"
            src={noData}
            alt="No Data Available"
          />
        </div> 
      )}
        </Container>
      </div>
    </React.Fragment>
  );
};
