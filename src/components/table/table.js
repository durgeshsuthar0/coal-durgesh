import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faAngleRight,
  faAnglesRight,
  faAngleLeft,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavbar } from "../../hook/useNavbar";
import { useSelector } from "react-redux";

// Global Filter Component
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;

  return (
    <span className="search-bar">
      <FontAwesomeIcon className="search-icon me-1" icon={faMagnifyingGlass} />
      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder={`${count} records...`}
        className="global-filter rounded-2"
      />
    </span>
  );
};

// Default Column Filter Component
const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search ${count} records...`}
      className="column-filter"
    />
  );
};

// Pagination Component
const Pagination = ({
  pageIndex,
  pageOptions,
  gotoPage,
  pageSize,
  setPageSize,
}) => (
  <div className="pagination">
    {pageIndex > 0 && (
      <>
        <button onClick={() => gotoPage(0)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button onClick={() => gotoPage(pageIndex - 1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      </>
    )}

    {pageOptions.map((option, i) => {
      if (
        i < 5 ||
        i === pageOptions.length - 1 ||
        (pageIndex > 2 && i > pageIndex - 2 && i < pageIndex + 3)
      ) {
        return (
          <button
            key={i}
            onClick={() => gotoPage(option)}
            className={pageIndex === option ? "active" : ""}
          >
            {option + 1}
          </button>
        );
      } else if (i === 5 && pageIndex > 4) {
        return <span key={i}>...</span>;
      }
      return null;
    })}

    {pageIndex < pageOptions.length - 1 && (
      <>
        <button onClick={() => gotoPage(pageIndex + 1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={() => gotoPage(pageOptions.length - 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </>
    )}
  </div>
);

const TableSec = ({ columns, data, isNotVisible }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter, pageIndex, pageSize },
    pageOptions,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="table-container">
      {/* Table Filter and Sorting UI */}
      <div className="static-table-sortig d-block d-md-flex justify-content-between align-items-center">
        <select
          className="mb-2 mb-md-0 rounded-2"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        {isNotVisible && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
      </div>

      {/* Table UI */}
      <div className="table-main">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, colIndex) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={colIndex}
                    className={column.isSorted ? (column.isSortedDesc ? "sorted-desc" : "sorted-asc") : ""}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} key={cellIndex}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        gotoPage={gotoPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default TableSec;
