import React, { useContext, useState, useEffect } from "react";
import { BranchContext } from "../../Branch";
import Config from "../../../config/Config";
import M from "materialize-css";
import { Link } from "react-router-dom";
import date from "date-and-time";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function VendorDashboard() {
  const { state, dispatch } = useContext(BranchContext);

  // Top 10 Selling Products
  const [topSellingProducts, setTopSellingProducs] = useState([]);
  const [topSellingProductsLoaded, setTopSellingProductsLoaded] =
    useState(false);

  // Total Orders
  const [totalOrdersLoaded, setTotalOrdersLoaded] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

  // Today Orders
  const [todayOrdersLoaded, setTodayOrdersLoaded] = useState(false);
  const [todayOrders, setTodayOrders] = useState(0);

  // Cancelled Orders
  const [totalCancelledOrderLoaded, setTotalCancelledOrderLoaded] =
    useState(false);
  const [totalCancelledOrder, setTotalCancelledOrder] = useState(0);

  // Pending Orders
  const [totalPendingOrderLoaded, setTotalPendingOrderLoaded] = useState(false);
  const [totalPengingOrder, setTotalPengingOrder] = useState(0);

  // Confirmed Orders
  const [totalConfirmedOrderLoaded, setTotalConfirmedOrderLoaded] =
    useState(false);
  const [totalConfirmedOrder, setTotalConfirmedOrder] = useState(0);

  // Returned Orders
  const [totalReturnedOrderLoaded, setTotalReturnedOrderLoaded] =
    useState(false);
  const [totalReturnedOrder, setTotalReturnedOrder] = useState(0);

  // Ready to Ship Orders
  const [totalReadyToShipOrderLoaded, setTotalReadyToShipOrderLoaded] =
    useState(false);
  const [totalReadyToShipOrder, setTotalReadyToShipOrder] = useState(0);

  // Total Return Orders
  const [totalDeliveredOrderLoaded, setTotalDeliveredOrderLoaded] =
    useState(false);
  const [totalDeliveredOrder, setTotalDeliveredOrder] = useState(0);

  // State for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return previous;
  }

  // Getting Today Order data
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/order/report?startDate=${date.format(
        new Date(getPreviousDay()),
        "YYYY-MM-DD"
      )}`,
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
          setTodayOrdersLoaded(true);
          if (result.status == 200) {
            console.log("Today order", result.body);
            setTodayOrders(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTodayOrdersLoaded(true);
        }
      );
  }, []);

  // Getting Total Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalOrdersLoaded(true);
          if (result.status == 200) {
            setTotalOrders(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalOrdersLoaded(true);
        }
      );
  }, []);

  // Getting Total Delivered Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=DELIVERED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalDeliveredOrderLoaded(true);
          if (result.status == 200) {
            setTotalDeliveredOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalDeliveredOrderLoaded(true);
        }
      );
  }, []);

  // Getting Total Cancelled Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=CANCELLED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalCancelledOrderLoaded(true);
          if (result.status == 200) {
            setTotalCancelledOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalCancelledOrderLoaded(true);
        }
      );
  }, []);

  // Getting Total Pending Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=PENDING", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalPendingOrderLoaded(true);
          if (result.status == 200) {
            setTotalPengingOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalPendingOrderLoaded(true);
        }
      );
  }, []);

  // Getting Total Confirmed Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=CONFIRMED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalConfirmedOrderLoaded(true);
          if (result.status == 200) {
            setTotalConfirmedOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalConfirmedOrderLoaded(true);
        }
      );
  }, []);

  // Getting Ready To Ship Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=READYTOSHIP", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalReadyToShipOrderLoaded(true);
          if (result.status == 200) {
            setTotalReadyToShipOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalReadyToShipOrderLoaded(true);
        }
      );
  }, []);

  // Getting Total Returned Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=RETURNED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTotalReturnedOrderLoaded(true);
          if (result.status == 200) {
            console.log("Returned Order", result.body);
            setTotalReturnedOrder(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalReturnedOrderLoaded(true);
        }
      );
  }, []);

  // Generate Report For Top 10 Selling Products
  useEffect(() => {
    setTopSellingProductsLoaded(false);
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
          setTopSellingProductsLoaded(true);
          if (result.status == 200) {
            setTopSellingProducs(result.body);
            // topSellingProducts = [...result.body];
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTopSellingProductsLoaded(true);
        }
      );
  }, [startDate, endDate]);

  return (
    <div>
      <div className="page-wrapper px-0 pt-0">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Container fluid  --> */}
        {/* <!-- ============================================================== --> */}
        <div className="container-fluid">
          {/* <!-- ============================================================== --> */}
          {/* <!-- Bread crumb and right siLine toggle --> */}
          {/* <!-- ============================================================== --> */}
          <div className="row page-titles mb-0">
            <div className="col-md-5 col-8 align-self-center">
              <h3 className="text-themecolor">Dashboard</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
          {/* <!-- End Bread crumb and right sidebar toggle --> */}

          {/* <!-- Card Section --> */}
          <div
            className={"row page-titles px-1 my-0 shadow-none"}
            style={{ background: "none" }}
          >
            <div className="col-md-12">
              <div className="d-flex justify-content-between">
                <h3 className="card-title mb-4">Stats Overview</h3>
              </div>
            </div>

            {/* Card Design */}
            <div className={"col-md-12"}>
              <div className={"row"}>
                {/* Total Orders */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-truck v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalOrdersLoaded ? (
                              totalOrders || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>Total Orders</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Today Orders */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/newOrders"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-truck-delivery v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {todayOrdersLoaded ? (
                              todayOrders || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>Today Orders</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Pending Order */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders?status=PENDING"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-car-connected v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalPendingOrderLoaded ? (
                              totalPengingOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Pending Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Confirmed Order */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders?status=CONFIRMED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-car-connected v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalConfirmedOrderLoaded ? (
                              totalConfirmedOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Confirmed Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Card Design */}
            <div className={"col-md-12"}>
              <div className={"row"}>
                {/* Total Ready To Ship Orders */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders?status=READYTOSHIP"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-bus v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {setTotalReadyToShipOrderLoaded ? (
                              totalReadyToShipOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Ready To Ship Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Cancelled Order */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders?status=CANCELLED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-car-connected v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalCancelledOrderLoaded ? (
                              totalCancelledOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Cancelled Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Delivered Order */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/branch/orders?status=DELIVERED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-car v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalDeliveredOrderLoaded ? (
                              totalDeliveredOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Delivered Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Row --> */}
          {/* .............. */}
          {/* <!-- ============================================================== --> */}
        </div>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End Container fluid  --> */}
        {/* <!-- footer --> */}
        {/* <!-- ============================================================== --> */}
        {/* <!-- ============================================================== --> */}
        {/* <!-- End footer --> */}
        {/* <!-- ============================================================== --> */}
      </div>
    </div>
  );
}

export default VendorDashboard;
