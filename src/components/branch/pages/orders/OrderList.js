import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import { storage } from "../../../firebase/FirebaseConfig";

// Component Function
const OrderList = (props) => {
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
  });

  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [isAllOrdersLoaded, setIsAllOrdersLoaded] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [orderStatus, setOrderStatus] = useState("ALL");

  // Delete Submit Handler
  const deleteSubmitHandler = () => {
    setIsDeleted(false);
    setIsDeleteLaoded(false);

    fetch(`${Config.SERVER_URL}/order/${deleteId}`, {
      method: "DELETE",
      // body: JSON.stringify({deleteId}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsDeleteLaoded(true);
          if (result.status == 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            setIsDeleted(true);
            setDeleteId("");
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          $("#closeDeleteModalButton").click();
        },
        (error) => {
          setIsDeleteLaoded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  const limitHandler = (e) => {
    const limit = e.target.value;
    const totalPage = Math.ceil(pagination.totalRecord / limit);
    setPagination({
      ...pagination,
      limit,
      totalPage,
    });
  };

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      skip: page == 1 ? 0 : (page - 1) * pagination.limit,
      currentPage: page,
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage: pagination.currentPage == 1 ? 1 : pagination.currentPage - 1,
      skip:
        pagination.currentPage == 1
          ? 0
          : (pagination.currentPage - 2) * pagination.limit,
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == 1
          ? pagination.limit
          : (pagination.currentPage + 1) * pagination.limit,
    });
  };

  // Get Data From Database
  useEffect(() => {
    setIsAllOrdersLoaded(false);
    let url = `${Config.SERVER_URL}/order?skip=${pagination.skip}&limit=${pagination.limit}`;
    if (orderStatus !== "ALL") {
      url = url + `&orderStatus=${orderStatus}`;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllOrdersLoaded(true);
          if (result.status === 200) {
            setAllOrders(result.body || []);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllOrdersLoaded(true);
        }
      );
  }, [pagination, isDeleted, orderStatus]);

  // Count Records
  useEffect(() => {
    let url = `${Config.SERVER_URL}/order?skip=0&limit=0`;
    if (orderStatus !== "ALL") {
      url = url + `&orderStatus=${orderStatus}`;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setPagination({
            ...pagination,
            totalRecord: result.body.length,
            totalPage: Math.ceil(result.body.length / pagination.limit),
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllOrdersLoaded(true);
        }
      );
  }, [isDeleted]);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <div className="row page-titles mb-0">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor m-b-0 m-t-0">Orders</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Admin</Link>
              </li>
              <li className="breadcrumb-item active">Orders List</li>
            </ol>
          </div>
        </div>
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
                  <h4 className="float-left mt-2 mr-2">Search: </h4>

                  <div className="form-inline">
                    <label htmlFor="" className="h6">
                      Filter :{" "}
                    </label>
                    <select
                      className="form-control shadow-sm rounded"
                      onChange={(evt) => {
                        setOrderStatus(evt.target.value);
                      }}
                      value={orderStatus}
                    >
                      <option value="ALL">ALL</option>
                      <option value="ORDERPLACED">ORDER PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DISPATCHED">DISPATCHED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="RETURNED">RETURNED</option>
                    </select>
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
                            <th>AMOUNT</th>
                            <th>ITEMS</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                            <th className="text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.map((order, index) => {
                            return (
                              <tr key={index}>
                                <td>{++index}</td>
                                <td>{order.customerId.name}</td>
                                <td>
                                  <i className="fa fa-inr"></i>
                                  {order.totalAmount}
                                </td>
                                <td>{order.products.length} Items</td>
                                <td>
                                  {date.format(
                                    new Date(order.createdAt),
                                    "DD-MM-YYYY"
                                  )}
                                </td>

                                <td>
                                  {order.orderStatus === "ORDERPLACED" ? (
                                    <span className="badge badge-info">
                                      {order.orderStatus}
                                    </span>
                                  ) : order.orderStatus === "CONFIRMED" ? (
                                    <span className="badge badge-warning">
                                      {order.orderStatus}
                                    </span>
                                  ) : order.orderStatus === "DISPATCHED" ? (
                                    <span className="badge badge-primary">
                                      {order.orderStatus}
                                    </span>
                                  ) : order.orderStatus === "DELIVERED" ? (
                                    <span className="badge badge-success">
                                      {order.orderStatus}
                                    </span>
                                  ) : order.orderStatus === "CANCELLED" ? (
                                    <span className="badge badge-danger">
                                      {order.orderStatus}
                                    </span>
                                  ) : order.orderStatus === "RETURNED" ? (
                                    <span className="badge badge-danger">
                                      {order.orderStatus}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>

                                <td className="text-center">
                                  {/* Update Button */}
                                  <Link
                                    className="ml-2 btn btn-info footable-edit rounded"
                                    to={{
                                      pathname: `/branch/order/show/${order.id}`,
                                    }}
                                  >
                                    <span
                                      className="fas fa-eye"
                                      aria-hidden="true"
                                    ></span>
                                  </Link>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    className="ml-2 btn btn-danger footable-delete rounded"
                                    data-toggle="modal"
                                    data-target="#deleteModal"
                                    onClick={(e) => {
                                      setDeleteId(order._id);
                                    }}
                                  >
                                    <span
                                      className="fas fa-trash-alt"
                                      aria-hidden="true"
                                    ></span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <div className="mt-2 d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="limit form-group shadow-sm px-3 border">
                            <select
                              name=""
                              id=""
                              className="form-control"
                              onChange={limitHandler}
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value={pagination.totalRecord}>
                                All
                              </option>
                            </select>
                          </div>
                          <div className="">
                            <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button shadow-sm px-3 border"
                              table="table-to-xls"
                              filename="orders"
                              sheet="data"
                              buttonText="Download as XLS"
                            />
                          </div>
                        </div>
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li
                              className={`page-item ${
                                pagination.currentPage == 1 ? "disabled" : ""
                              }`}
                            >
                              <a
                                className="page-link"
                                href="#"
                                tabindex="-1"
                                onClick={previousPageHandler}
                              >
                                Previous
                              </a>
                            </li>
                            {[...Array(pagination.totalPage)].map((_, i) => {
                              return (
                                <li className="page-item">
                                  <a
                                    className="page-link"
                                    href="#"
                                    onClick={(e) => pageHandler(e, i + 1)}
                                  >
                                    {i + 1}
                                  </a>
                                </li>
                              );
                            })}

                            <li
                              className={`page-item ${
                                pagination.currentPage == pagination.totalPage
                                  ? "disabled"
                                  : ""
                              }`}
                            >
                              <a
                                className="page-link"
                                href="#"
                                onClick={nextPageHandler}
                              >
                                Next
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
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

          {/* -- Delete Modal -- */}
          <div
            className="modal fade rounded"
            id="deleteModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content rounded">
                <div className="modal-body text-center">
                  <img
                    style={{ width: "150px" }}
                    className={"img img-fluid"}
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5R1g82DqzH4itsxpVCofNGWbAzKN_PJDBew&usqp=CAU"
                    }
                  />
                  <h4 className={"text-center mt-2"}>Do You Want to Delete?</h4>

                  <div className={"form-group"}>
                    <button
                      className="btn btn-danger rounded px-3"
                      type={"submit"}
                      onClick={deleteSubmitHandler}
                    >
                      {isDeleteLaoded ? (
                        <div>
                          <i className="fas fa-trash"></i> Yes
                        </div>
                      ) : (
                        <div>
                          <span
                            className="spinner-border spinner-border-sm mr-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading..
                        </div>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary rounded ml-2 px-3"
                      data-dismiss="modal"
                      id={"closeDeleteModalButton"}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
