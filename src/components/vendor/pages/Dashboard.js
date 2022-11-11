import React, { useContext, useState, useEffect } from "react";
import { VendorContext } from "../../vendor/Vendor";
import M from "materialize-css";
import { Link } from "react-router-dom";
import Config from "../../config/Config";
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

function Dashboard() {
  const { state, dispatch } = useContext(VendorContext);

  // Products
  const [totalProduct, setTotalProduct] = useState(0);
  const [isTotalProductLoaded, setIsTotalProductLoaded] = useState(false);

  // Top 10 Selling Products
  const [topSellingProducts, setTopSellingProducs] = useState([]);
  const [topSellingProductsLoaded, setTopSellingProductsLoaded] =
    useState(false);

  // Top 10 Cusomers
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCustomersLoaded, setTopCustomersLoaded] = useState(false);

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

  // Returned Orders
  const [totalReturnedOrderLoaded, setTotalReturnedOrderLoaded] =
    useState(false);
  const [totalReturnedOrder, setTotalReturnedOrder] = useState(0);

  // Total Return Orders
  const [totalDeliveredOrderLoaded, setTotalDeliveredOrderLoaded] =
    useState(false);
  const [totalDeliveredOrder, setTotalDeliveredOrder] = useState(0);

  // All Users
  const [totalUsersLoaded, setTotalUsersLoaded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  // All Customers
  const [totalCustomersLoaded, setTotalCustomersLoaded] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [orderReportsLoaded, setOrderReportsLoaded] = useState(false);

  const [allBatches, setTotalCategory] = useState([]);
  const [isAllBatchLoaded, setIsTotalCategoryLoaded] = useState(false);

  const [recComment, setRecCommment] = useState([]);

  // State for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return previous;
  }

  // Fetching the data
  useEffect(() => {
    // Get All Products
    fetch(Config.SERVER_URL + "/product?limit=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsTotalProductLoaded(true);
          if (result.status == 200) {
            console.log(result.body);
            setTotalProduct(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsTotalProductLoaded(true);
        }
      );

    // Get All Category
    fetch(Config.SERVER_URL + "/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsTotalCategoryLoaded(true);
          if (result.status === 200) {
            setTotalCategory(result.body.length || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsTotalCategoryLoaded(true);
        }
      );
  }, []);

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

  // Generate Report For Top 10 Customers
  useEffect(() => {
    setTopCustomersLoaded(false);
    fetch(
      `${Config.SERVER_URL}/order/report?topCustomers=true&startDate=${startDate}&endDate=${endDate}`,
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
          setTopCustomersLoaded(true);
          if (result.status == 200) {
            setTopCustomers(result.body);
            // topSellingProducts = [...result.body];
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTopCustomersLoaded(true);
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
                    <Link to={"/vendor/orders"}>
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
                    <Link to={"/vendor/newOrders"}>
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

                {/* Total Cancelled Ordera */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/vendor/orders?status=CANCELLED"}>
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
                            Cancelled Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Delivered Order */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/vendor/orders?status=DELIVERED"}>
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
                            Delivered Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={"col-md-12"}>
              <div className={"row"}>
                <div className="col-md-12">
                  <div className="d-flex justify-content-between">
                    <h3 className="card-title mb-4">Graph Overview</h3>
                    <div className="d-flex">
                      <div className="">
                        <input
                          type="date"
                          onChange={(evt) => {
                            setStartDate(evt.target.value);
                          }}
                          className="form-control px-2"
                        />
                      </div>
                      <div className="pl-2">
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

                {/* Top 10 Selling Products */}
                <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Selling Products</h4>
                        <Link
                          to={"/vendor/report/products"}
                          className={"text-info"}
                        >
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topSellingProductsLoaded ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart width={400} height={400}>
                          <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={topSellingProducts}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#C70039"
                            label
                          />

                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div
                        className={"text-center"}
                        style={{ height: "300px", paddingTop: "150px" }}
                      >
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top 10 Customers */}
                {/* <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Customers</h4>
                        <Link
                          to={"/vendor/report/customers"}
                          className={"text-info"}
                        >
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoaded ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          width={500}
                          height={300}
                          data={topCustomers}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div
                        className={"text-center"}
                        style={{ height: "300px", paddingTop: "150px" }}
                      >
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Top 10 Parent Category */}
                {/* <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Category</h4>
                        <Link to={""} className={"text-info"}>
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoaded ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          width={500}
                          height={300}
                          data={topCustomers}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={"text-center"}>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Top 10 Child Category */}
                {/* <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Child Category</h4>
                        <Link to={""} className={"text-info"}>
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoaded ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          width={500}
                          height={400}
                          data={topCustomers}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={"text-center"}>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div> */}
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
        <footer className="footer">© 2021 Esta Global</footer>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End footer --> */}
        {/* <!-- ============================================================== --> */}
      </div>
    </div>
  );
}

export default Dashboard;
