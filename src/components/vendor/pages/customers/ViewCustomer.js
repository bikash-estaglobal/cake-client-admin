import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";

const ViewCustomer = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [user, setUser] = useState({
    shippingAddresses: [],
    wallet: {
      history: [],
      totalAmount: 0,
    },
  });

  const [order, setOrder] = useState({
    products: [],

    shippingAddress: {},
    adonProducts: [],
    shippingMethod: {
      startTime: "16:00",
      endTime: "16:00",
    },
    orderStatus: "ORDERPLACED",
    coupon: {},
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();

    const updateData = {
      orderStatus: order.orderStatus,
    };

    if (order.orderStatus == "CANCELLED") {
      updateData.cancelledBy = "ADMIN";
    }
    if (order.cancelMessage != "")
      updateData.cancelMessage = order.cancelMessage;

    fetch(`${Config.SERVER_URL}/order/${order.id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsUpdateLoaded(true);
        },
        (error) => {
          setIsUpdateLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get User Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/customer/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setUser(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setUserLoaded(true);
        },
        (error) => {
          setUserLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Order Details
  useEffect(() => {
    setUserLoaded(false);
    fetch(`${Config.SERVER_URL}/order?customerId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            console.log(result.body);
            setOrders(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setOrderLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setOrderLoaded(true);
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"USER LISTS"} pageTitle={"Update User"} />
        {/* Details */}

        {userLoaded ? (
          <div className={"row"}>
            {/* Left Section */}
            <div className="col-md-8">
              {/* Personal Details */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="py-3">
                      <img
                        style={{
                          height: "100px",
                          width: "100px",
                        }}
                        src="https://bnpull-1195f.kxcdn.com/pub/media/magefan_blog/default-user3.png"
                        alt=""
                      />
                    </div>

                    <div className="p-2 ml-3 ">
                      <h4>{user.name}</h4>
                      <h5>{user.email} </h5>
                      <h5>{user.mobile} </h5>
                      <h5>
                        Account Verified:
                        {user.isVerified ? (
                          <span className="text-info mdi mdi-checkbox-marked-circle"></span>
                        ) : (
                          <span className="badge badge-danger">
                            Not Verified
                          </span>
                        )}
                      </h5>
                      <h5>
                        Account Status:
                        {user.status ? (
                          <span className="badge badge-info">Active</span>
                        ) : (
                          <span className="badge badge-danger">Disabled</span>
                        )}
                      </h5>
                    </div>
                  </div>
                </div>
                {/* <button
                  className="btn btn-info rounded py-2"
                  onClick={(evt) => history.goBack()}
                >
                  <span className={"fas fa-arrow-left"}></span> Go Back
                </button> */}
              </div>

              {/* Order Details */}
              <div className="card shadow-sm border-0 mt-3">
                {orderLoaded ? (
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="">
                        <h4>Total Orders : {orders.length} Orders </h4>
                      </div>
                      <button
                        className="btn btn-info mdi mdi-arrow-down-bold"
                        type="button"
                        data-toggle="collapse"
                        data-target="#orderDetails"
                        aria-expanded="false"
                        aria-controls="orderDetails"
                      >
                        VIEW ORDERS
                      </button>
                    </div>
                    <div className="collapse" id="orderDetails">
                      <div class="card-body">
                        {orders.length ? (
                          <div class="table-responsive">
                            <table class="table bg-white">
                              <thead>
                                <tr>
                                  <th>Order</th>
                                  <th>Order Date</th>
                                  <th>Status</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.map((order, index) => {
                                  return (
                                    <tr key={index}>
                                      <td> # {++index} </td>
                                      <td>
                                        {date.format(
                                          new Date(order.createdAt),
                                          "DD-MM-YYYY"
                                        )}
                                      </td>
                                      <td>
                                        <span class="text-info">
                                          {order.orderStatus}
                                        </span>
                                      </td>
                                      <td>
                                        <i class="fa fa-inr"></i>
                                        {order.totalAmount} for{" "}
                                        {order.products.length} item
                                      </td>
                                      <td>
                                        <Link
                                          class="btn btn-info"
                                          to={`/branch/order/show/${order._id}`}
                                        >
                                          View
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="alert alert-danger h6">
                            Order not placed yet.
                          </div>
                        )}
                      </div>
                    </div>
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
              {/* <!-- Button trigger modal --> */}
            </div>

            <div className="col-md-4">
              {/* Wallet Section */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h4>
                      <span className="mdi mdi-wallet-giftcard"></span> Wallet
                      Amount :
                    </h4>
                    <h4>
                      {user.wallet.totalAmount ? (
                        <span className="badge badge-info">
                          <span className="mdi mdi-currency-inr"></span>
                          {user.wallet.totalAmount || 0}
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <span className="mdi mdi-currency-inr"></span>
                          {user.wallet.totalAmount || 0}
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card shadow-sm border-0 mt-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="">
                      <h4>Shipping Address</h4>
                    </div>
                    <button
                      className="btn btn-info mdi mdi-arrow-down-bold"
                      type="button"
                      data-toggle="collapse"
                      data-target="#shippingAddressDetails"
                      aria-expanded="false"
                      aria-controls="shippingAddressDetails"
                    >
                      VIEW
                    </button>
                  </div>
                  <div className="collapse" id="shippingAddressDetails">
                    {user.shippingAddresses.length ? (
                      user.shippingAddresses.map((address, index) => {
                        return (
                          <div
                            className="card card-body mt-2 rounded-0"
                            key={index}
                          >
                            <h4>Name: {address.name}</h4>
                            <h4>Email: {address.email}</h4>
                            <h4>Mobile: {address.mobile}</h4>
                            <h4>Address: {address.address}</h4>
                            <h4>City: {address.address}</h4>
                            <h4>Pincode: {address.address}</h4>
                          </div>
                        );
                      })
                    ) : (
                      <div className="alert alert-danger h6">
                        Address Not Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-12 m-auto">
            <div className={"bg-white p-3 text-center"}>
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              Loading..
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCustomer;
