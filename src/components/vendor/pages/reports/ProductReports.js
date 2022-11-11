import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Breadcrumb from "../../components/Breadcrumb";
// import { storage } from "../../../firebase/FirebaseConfig";

//  Component Function
const ProductReports = (props) => {
  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [isAllOrdersLoaded, setIsAllOrdersLoaded] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [orderStatus, setOrderStatus] = useState("ALL");

  // State for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Generate Report For Top 10 Selling Products
  useEffect(() => {
    setIsAllOrdersLoaded(false);
    fetch(
      `${Config.SERVER_URL}/order/report?topProducts=true&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllOrdersLoaded(true);
          if (result.status == 200) {
            setAllOrders(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllOrdersLoaded(true);
        }
      );
  }, [startDate, endDate]);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"PRODUCT REPORTS"} pageTitle={"Product Report"} />

        {/* End Bread crumb and right sidebar toggle */}
        <div
          className={"row page-titles px-1 my-0 shadow-none"}
          style={{ background: "none" }}
        >
          <div className={"col-md-12 px-0"}>
            {/* Heading */}
            <div className={"card mb-0 mt-2 border-0 rounded"}>
              <div className={"card-body pb-0 pt-2"}>
                <div className="d-flex justify-content-between">
                  <h4 className="float-left mt-2 mr-2">{/* Search: */}</h4>

                  <div className="form-inline">
                    <label htmlFor="" className="h6">
                      Filter :{" "}
                    </label>

                    <div className="d-flex">
                      <div className="border px-1 ml-2">
                        <input
                          type="date"
                          onChange={(evt) => {
                            setStartDate(evt.target.value);
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="border px-1 ml-2">
                        <input
                          type="date"
                          onChange={(evt) => {
                            setEndDate(evt.target.value);
                          }}
                          className="form-control px-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data */}
            {isAllOrdersLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allOrders.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      <table
                        id={"table-to-xls"}
                        className={"table table-bordered table-striped my-0"}
                      >
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>NAME</th>
                            <th>NO OF ORDERS</th>
                            <th>AMOUNT</th>

                            {/* <th className="text-center">ACTION</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.map((order, index) => {
                            return (
                              <tr key={index}>
                                <td>{++index}</td>
                                <td>{order.name}</td>

                                <td>{order.value}</td>
                                <td>
                                  <i className="fa fa-inr"></i>
                                  {order.amount}
                                </td>
                                {/* <td className="text-center">
                                  <Link
                                    className="ml-2 btn btn-info footable-edit rounded"
                                    to={{
                                      pathname: `/branch/product/show/${order._id}`,
                                    }}
                                  >
                                    <span
                                      className="fas fa-eye"
                                      aria-hidden="true"
                                    ></span>
                                  </Link>
                                </td> */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div
                    className={"alert alert-danger mx-3 rounded border-0 py-2"}
                  >
                    No Data Available
                  </div>
                )}
              </div>
            ) : (
              <div className={"bg-white p-3 text-center"}>
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading..
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReports;
