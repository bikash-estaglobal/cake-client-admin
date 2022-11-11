import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import ComponentToPrint from "../../components/ComponentToPrint";
import ReactToPrint from "react-to-print";
import { convertDeliveryDay } from "../../helpers";
import Spinner from "../../components/Spinner";

const ViewOrder = () => {
  const history = useHistory();
  const { id } = useParams();
  const printComponentRef = useRef(null);
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [statusUpdated, setStatusUpdated] = useState(true);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("Today");
  const [orderStatusOptions, setOrderStatusOptions] = useState([]);

  const [order, setOrder] = useState({
    products: [],
    billingAddress: {},
    shippingAddress: {},
    adonProducts: [],
    shippingMethod: {
      startTime: "16:00",
      endTime: "16:00",
    },
    orderStatus: "PENDING",
    coupon: {},
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();

    const updateData = {
      orderStatus: selectedOrderStatus,
    };

    if (selectedOrderStatus == "CANCELLED") {
      updateData.cancelledBy = "VENDOR";
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
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            // history.goBack();
            setStatusUpdated(!statusUpdated);
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

  // get Records
  useEffect(() => {
    setDataLoading(false);
    fetch(`${Config.SERVER_URL}/order/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_vendor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setOrder({ ...result.body, coupon: result.body.coupon || {} });
            setSelectedOrderStatus(result.body.orderStatus);
            const dlvryDate = convertDeliveryDay(result.body.shippingMethod);
            setDeliveryDate(dlvryDate);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setDataLoading(true);
        },
        (error) => {
          setDataLoading(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, [statusUpdated]);

  useEffect(() => {
    const orderStatusValue = order.orderStatus;
    if (orderStatusValue == "PENDING") {
      setOrderStatusOptions([
        <option value="CONFIRMED">CONFIRMED</option>,
        <option value="CANCELLED">CANCELLED</option>,
      ]);
    } else if (orderStatusValue == "CONFIRMED") {
      setOrderStatusOptions([
        <option value="READYTOSHIP">READY TO SHIP</option>,
      ]);
    } else if (orderStatusValue == "READYTOSHIP") {
      setOrderStatusOptions([<option value="DISPATCHED">DISPATCHED</option>]);
    } else if (orderStatusValue == "DISPATCHED") {
      setOrderStatusOptions([<option value="DELIVERED">DELIVERED</option>]);
    } else if (orderStatusValue == "DELIVERED") {
      setOrderStatusOptions([]);
    }
  }, [order.orderStatus]);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"ORDERS"} pageTitle={"View Odrer"} />

        {/* Add order Form */}
        <div className="row">
          {dataLoading ? (
            <div className={"col-md-11 mx-auto"}>
              {/* order Details */}
              <div className={"row"}>
                <div className="col-md-12 d-flex justify-content-between my-3">
                  <div className=""></div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 m-auto">
                  <div className="row">
                    <div className="col-md-9">
                      {/* Product Details */}

                      <div className="card bg-white">
                        <div className="card-header d-flex justify-content-between bg-white">
                          <h5>
                            Order Details (Status :{" "}
                            <span className="badge bg-success text-light">
                              {order.orderStatus}
                            </span>{" "}
                            ){" "}
                          </h5>
                        </div>
                        <div className="card-body">
                          <div class="container">
                            <div className="row">
                              {/* Product Details */}
                              <div className="col-md-12">
                                <div className="pb-4">
                                  <h5>Product Details</h5>
                                </div>
                                {order.products.map((item, index) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between"
                                      key={`p-${index}`}
                                    >
                                      <div className="d-flex justify-content-between">
                                        <div className="">
                                          <img
                                            style={{
                                              height: "150px",
                                              width: "150px",
                                              borderRadius: "20px",
                                            }}
                                            src={item.image}
                                            alt="Product Image"
                                          />
                                        </div>
                                        <div className="px-2 py-3">
                                          <h5 className="">{item.name}</h5>
                                          <p className="text-small">
                                            <span className="text-dark font-weight-bold">
                                              Shape:{" "}
                                            </span>{" "}
                                            {item.shape} |{" "}
                                            <span className="text-dark font-weight-bold">
                                              Flavour:{" "}
                                            </span>{" "}
                                            {item.flavour} |{" "}
                                            <span className="text-dark font-weight-bold">
                                              Type:{" "}
                                            </span>
                                            {item.cakeType}
                                          </p>
                                          <h6 className="">
                                            <span className="text-dark font-weight-bold">
                                              Message On Cake:
                                            </span>{" "}
                                            <span className="badge bg-success text-light">
                                              {item.messageOnCake || "N/A"}
                                            </span>
                                            {item.imageOnCake ? (
                                              <h6 className="">
                                                <span className="text-dark font-weight-bold">
                                                  Photo:
                                                </span>{" "}
                                                <a
                                                  className=""
                                                  target="_blank"
                                                  href={item.imageOnCake}
                                                >
                                                  <img
                                                    src={item.imageOnCake}
                                                    alt=""
                                                    style={{
                                                      height: "80px",
                                                      width: "80px",
                                                      borderRadius: "10px",
                                                    }}
                                                  />
                                                </a>
                                              </h6>
                                            ) : (
                                              ""
                                            )}
                                          </h6>
                                        </div>
                                      </div>

                                      <div className="">
                                        <div className="">
                                          <p className="text-small">
                                            {item.weight} X {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Adon Product Details */}
                              {order.adonProducts.length ? (
                                <div className="col-md-12 py-3">
                                  <div className="pb-4">
                                    <h5>Adon Product Details</h5>
                                  </div>
                                  {order.adonProducts.map((item, index) => {
                                    return (
                                      <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex justify-content-between">
                                          <div className="">
                                            <img
                                              style={{
                                                height: "80px",
                                                width: "80px",
                                                borderRadius: "20px",
                                              }}
                                              src={item.image}
                                              alt="Product Image"
                                            />
                                          </div>
                                          <div className="px-2 py-3">
                                            <h6>{item.name}</h6>
                                          </div>
                                        </div>
                                        <div className="">
                                          <div className="">
                                            <p className="text-small">
                                              Qty : {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Printing Area */}
                      <div className="card bg-white">
                        <div className="card-header d-flex justify-content-between bg-white align-items-center">
                          <h5>{/* Shipping Details */}</h5>
                          <h5>
                            <ReactToPrint
                              trigger={() => (
                                <button className="btn btn-outline-success shadow-none">
                                  Print Address
                                </button>
                              )}
                              content={() => printComponentRef.current}
                            />
                          </h5>
                        </div>
                        <ComponentToPrint
                          order={order}
                          ref={printComponentRef}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 ">
                      <div className="card bg-white mb-3">
                        <div className="card-body">
                          {order.orderStatus != "CANCELLED" &&
                          order.orderStatus != "DELIVERED" ? (
                            <div className="form-inline ">
                              <select
                                style={{ border: "2px solid #5a5a5a" }}
                                className="rounded py-2"
                                onChange={(evt) => {
                                  setSelectedOrderStatus(evt.target.value);
                                }}
                                onClick={(evt) => {
                                  evt.preventDefault();
                                  if (selectedOrderStatus == "CANCELLED") {
                                    setShowCancelInput(true);
                                  } else {
                                    setShowCancelInput(false);
                                  }
                                }}
                                value={selectedOrderStatus}
                              >
                                <option value={""}>SELECT STATUS</option>

                                {orderStatusOptions.map((option) => {
                                  return option;
                                })}
                              </select>
                              {showCancelInput ? (
                                <div className="ml-2">
                                  <input
                                    type="text"
                                    value={order.cancelMessage}
                                    onChange={(evt) =>
                                      setOrder({
                                        ...order,
                                        cancelMessage: evt.target.value,
                                      })
                                    }
                                    className="form-control shadow-sm ml-4"
                                    placeholder="Reason For Cancel"
                                  />
                                </div>
                              ) : (
                                ""
                              )}

                              <button
                                className="btn btn-info ml-2"
                                onClick={submitHandler}
                                disabled={isUpdateLoaded ? false : true}
                              >
                                {isUpdateLoaded ? "Update" : <Spinner />}
                              </button>
                            </div>
                          ) : order.orderStatus == "CANCELLED" ? (
                            <div className="badge bg-danger text-light m-auto">
                              {order.orderStatus}
                            </div>
                          ) : (
                            <div className="badge bg-info text-light m-auto">
                              {order.orderStatus}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card bg-white mb-3">
                        <div className="card-body">
                          <h5 className="pb-3">Delivery Details</h5>
                          {order.shippingMethod ? (
                            <div className="">
                              <h6 className="pb-0">
                                Delivery:{" "}
                                <span className="badge bg-success text-light">
                                  {" "}
                                  {order.shippingMethod.method}
                                </span>
                              </h6>
                              {order.orderStatus !== "DELIVERED" ? (
                                <div className="">
                                  <h6 className="pb-0">
                                    Delivery Date:{" "}
                                    <span className="badge bg-success text-light">
                                      {deliveryDate}
                                    </span>
                                  </h6>
                                  <h6 className="pb-0">
                                    Delivery Time:{" "}
                                    <span className="badge bg-success text-light">
                                      {date.transform(
                                        order.shippingMethod.startTime,
                                        "HH:mm",
                                        "hh"
                                      )}
                                      -
                                      {date.transform(
                                        order.shippingMethod.endTime,
                                        "HH:mm",
                                        "hh:mm A"
                                      )}
                                    </span>
                                  </h6>
                                </div>
                              ) : (
                                <div className="">
                                  <h6 className="pb-2">
                                    Delivered Date:{" "}
                                    <span className="badge bg-info text-light">
                                      {date.format(
                                        new Date(order.updatedAt),
                                        "DD-MM-YYYY"
                                      )}
                                    </span>
                                  </h6>
                                  <h6 className="pb-2">
                                    Delivery Time:{" "}
                                    <span className="badge bg-info text-light">
                                      {date.format(
                                        new Date(order.updatedAt),
                                        "hh:mm A"
                                      )}
                                    </span>
                                  </h6>
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="card bg-white mb-3">
                        <div className="card-body">
                          <div className="pb-3">
                            <h5 className="">Shipping Address</h5>
                          </div>
                          {order.shippingAddress ? (
                            <div className="">
                              <h6 className="pb-0">
                                Name: {order.shippingAddress?.name}{" "}
                              </h6>

                              <h6 className="pb-0">
                                Mobile: {order.shippingAddress?.mobile}{" "}
                              </h6>
                              <h6 className="pb-0">
                                Address: {order.shippingAddress?.address}{" "}
                              </h6>
                              <h6 className="pb-0">
                                Landmark: {order.shippingAddress?.landmark}{" "}
                              </h6>
                              <h6 className="pb-0">
                                City: {order.shippingAddress?.city}{" "}
                              </h6>
                              <h6 className="pb-0">
                                Pincode: {order.shippingAddress?.pincode}{" "}
                              </h6>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-11 m-auto">
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
    </div>
  );
};

export default ViewOrder;
