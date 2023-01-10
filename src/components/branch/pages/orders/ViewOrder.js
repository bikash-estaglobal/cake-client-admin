import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import { storage } from "../../../../firebase/FirebaseConfig";
// import { getDownloadURL } from "firebase/storage";

const ViewOrder = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [order, setOrder] = useState({
    products: [],
    billingAddress: {},
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

  // get Records
  useEffect(() => {
    setDataLoading(false);
    fetch(`${Config.SERVER_URL}/order/${id}`, {
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
            setOrder({ ...result.body, coupon: result.body.coupon || {} });
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
  }, []);

  // Download Image
  // const download = async () => {
  //   const originalImage =
  //     "https://firebasestorage.googleapis.com/v0/b/perfect-app-5eef5.appspot.com/o/cakes%2Fbikash-kumar-singh.png?alt=media&token=625b3b11-3104-4cc7-8726-c684f55bb5cf";
  //   const image = await fetch(originalImage);

  //   //Split image name
  //   const nameSplit = originalImage.split("/");
  //   const duplicateName = nameSplit.pop();

  //   const imageBlog = await image.blob();
  //   const imageURL = URL.createObjectURL(imageBlog);
  //   const link = document.createElement("a");
  //   link.href = imageURL;
  //   link.download = "" + duplicateName + "";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const download = (evt) => {
    evt.preventDefault();
    var element = document.createElement("a");
    var file = new Blob(
      [
        "https://firebasestorage.googleapis.com/v0/b/perfect-app-5eef5.appspot.com/o/cakes%2Fbikash-kumar-singh.png?alt=media&token=625b3b11-3104-4cc7-8726-c684f55bb5cf",
      ],
      { type: "image/*" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "bikash-kumar-singh.png";
    element.click();
  };

  const downloadImageHandler = async (evt, url) => {
    evt.preventDefault();

    // download();

    // var a = document.createElement("a");
    // a.href = url;
    // a.download = "output.png";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

    // const httpsReference = storage.refFromURL(url);
    // // console.log(httpsReference);

    const { getStorage, ref } = storage;
    console.log(getStorage);

    // httpsReference
    //   .getDownloadURL()
    //   .then((url) => {
    //     // `url` is the download URL for 'images/stars.jpg'
    //     console.log("1", url);
    //     // This can be downloaded directly:
    //     // const xhr = new XMLHttpRequest();
    //     // xhr.responseType = "blob";
    //     // xhr.onload = (event) => {
    //     //   const blob = xhr.response;
    //     // };
    //     // xhr.open("GET", url);
    //     // xhr.send();

    //     // Or inserted into an <img> element
    //     const img = document.getElementById("myimg");
    //     img.setAttribute("src", url);

    //     console.log("URL", url);
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //   });

    // console.log(ref);
  };

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
              <div className={"row shadow-sm bg-white py-3 px-3"}>
                <div className="col-md-12 d-flex justify-content-between">
                  <h3 className={"text-info"}>Products Details</h3>
                </div>
                <div className="col-md-12 d-flex justify-content-between my-3">
                  <div className="">
                    {/* <button
                      className="btn btn-info rounded py-2"
                      onClick={(evt) => history.goBack()}
                    >
                      <span className={"fas fa-arrow-left"}></span> Go Back
                    </button> */}
                  </div>
                  {/* <!-- Button trigger modal --> */}

                  {/* <div className="form-inline">
                    <select
                      className="form-control shadow-sm rounded"
                      onChange={(evt) => {
                        setOrder({ ...order, orderStatus: evt.target.value });
                      }}
                      onClick={(evt) => {
                        evt.preventDefault();
                        if (order.orderStatus == "CANCELLED") {
                          setShowCancelInput(true);
                        } else {
                          setShowCancelInput(false);
                        }
                      }}
                      value={order.orderStatus}
                    >
                      <option value="ORDERPLACED">ORDER PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DISPATCHED">DISPATCHED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
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
                    >
                      Update
                    </button>
                  </div> */}
                </div>

                {/* order Code */}
                <div className={"col-md-12"}>
                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>PRODUCT</th>
                        <th>Flv & Shape</th>
                        <th>Message</th>
                        <th>Photo</th>
                        <th>Weight</th>
                        <th>QTY</th>
                        <th>PRICE</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product, index) => {
                        return (
                          <tr>
                            <td> {++index} </td>
                            <td>
                              <h6> {product.name} </h6>
                              <img
                                className="m-auto"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  borderRadius: "50px",
                                }}
                                src={`${product.image}`}
                                alt=""
                              />
                            </td>

                            <td>
                              <p>
                                <span className="text-dark font-weight-bold">
                                  Flv:
                                </span>{" "}
                                {product.flavour}
                              </p>
                              <p>
                                <span className="text-dark font-weight-bold">
                                  Shape:
                                </span>{" "}
                                {product.shape}
                              </p>
                              <p>
                                <span className="text-dark font-weight-bold">
                                  Type:
                                </span>{" "}
                                {product.cakeType}
                              </p>
                            </td>
                            <td>{product.messageOnCake || "N/A"}</td>
                            <td>
                              {product.imageOnCake ? (
                                <a
                                  // onClick={(evt) => {
                                  //   downloadImageHandler(
                                  //     evt,
                                  //     product.imageOnCake
                                  //   );
                                  // }}

                                  download
                                  onClick={(evt) => download(evt)}
                                  href={product.imageOnCake}
                                >
                                  <img
                                    style={{
                                      height: "100px",
                                      width: "100px",
                                      borderRadius: "50px",
                                    }}
                                    src={product.imageOnCake}
                                  />
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>{product.weight}</td>
                            <td> {product.quantity} </td>
                            <td>
                              <span className="fa fa-inr"></span>
                              {product.price}
                            </td>
                            <td>
                              <span className="fa fa-inr"></span>
                              {product.quantity * product.price}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adon Details */}
              <div className={"row shadow-sm bg-white py-3 px-3 mt-3"}>
                {order.adonProducts.length ? (
                  <div className="col-md-12 d-flex justify-content-between">
                    <h3 className={"text-info"}>Adon Products Details</h3>
                  </div>
                ) : (
                  ""
                )}

                {/* order Code */}
                <div className={"col-md-12 table-responsive"}>
                  <table className="table" style={{ width: "100%" }}>
                    {order.adonProducts.length ? (
                      <>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th style={{ width: "80%" }}>PRODUCT</th>
                            <th>QTY</th>
                            <th>PRICE</th>
                            <th>TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.adonProducts.map((product, index) => {
                            return (
                              <tr>
                                <td> {++index} </td>
                                <td>
                                  <h6> {product.name} </h6>
                                  <img
                                    className="m-auto"
                                    style={{
                                      height: "100px",
                                      width: "100px",
                                      borderRadius: "50px",
                                    }}
                                    src={`${product.image}`}
                                    alt=""
                                  />
                                </td>

                                <td> {product.quantity} </td>
                                <td>
                                  <span className="fa fa-inr"></span>
                                  {product.price}
                                </td>
                                <td>
                                  <span className="fa fa-inr"></span>
                                  {product.quantity * product.price}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </>
                    ) : (
                      ""
                    )}
                    <tfoot>
                      {/* <tr>
                        <td colSpan={4}>Sub Total</td>
                        <td>
                          <span className="fa fa-inr"></span>
                          {order.subtotal}
                        </td>
                      </tr> */}
                      <tr>
                        <td colSpan={4}>
                          Discount With Coupon
                          {
                            <span className="badge badge-success">
                              {order.coupon.code || ""}
                            </span>
                          }
                        </td>
                        <td>
                          <span className="fa fa-inr"></span>
                          {order.discountWithCoupon || "0.00"}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={4}>Used Wallet Amount</td>
                        <td>
                          <span className="fa fa-inr"></span>
                          {order.usedWalletAmount || "0.00"}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4}>Delivery Charge</td>
                        <td>
                          <span className="fa fa-inr"></span>
                          {order.shippingMethod.amount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4}>Total Amount</td>
                        <td>
                          <span className="fa fa-inr"></span>
                          {order.totalAmount || "FREE"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* order Description */}
              <div className={"row mt-3 py-3"}>
                <div className="col-md-3 px-1">
                  <div className="card">
                    <div className="card-body">
                      <h3 className={"my-3 text-info"}> Order Status </h3>
                      <div className="">
                        <h5>
                          {order.orderStatus === "PENDING" ? (
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
                          ) : (
                            ""
                          )}
                        </h5>
                        {order.cancelMessage ? (
                          <h5> Msg: {order.cancelMessage} </h5>
                        ) : (
                          ""
                        )}
                        {order.orderStatus == "CANCELLED" ? (
                          <h5> Cancelled By: {order.cancelledBy} </h5>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 px-1">
                  <div className="card">
                    <div className="card-body">
                      <h3 className={"my-3 text-info"}> Shipping Details </h3>
                      <div className="">
                        <h5> {order.shippingAddress.name} </h5>
                        <h6> {order.shippingAddress.email} </h6>
                        <h6> {order.shippingAddress.mobile} </h6>
                        <h6>
                          {order.shippingAddress.address},
                          {order.shippingAddress.city},
                          {order.shippingAddress.landmark}
                        </h6>
                        <h6> {order.companyName} </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 px-1">
                  <div className="card">
                    <div className="card-body">
                      <h3 className={"my-3 text-info"}> Shipping Methods </h3>
                      <div className="">
                        <h5> {order.shippingMethod.method} </h5>
                        <h6>
                          {date.format(
                            new Date(order.shippingMethod.date),
                            "DD-MM-YYYY"
                          )}
                        </h6>
                        <h6>
                          {date.transform(
                            order.shippingMethod.startTime,
                            "HH:mm",
                            "hh:mm A"
                          )}{" "}
                          -
                          {date.transform(
                            order.shippingMethod.endTime,
                            "HH:mm",
                            "hh:mm A"
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 px-1">
                  <div className="card">
                    <div className="card-body">
                      <h3 className={"my-3 text-info"}> Payment Method </h3>
                      <div className="">
                        <h5>
                          <span className="badge badge-info">
                            {order.paymentMethod}
                          </span>
                        </h5>
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
