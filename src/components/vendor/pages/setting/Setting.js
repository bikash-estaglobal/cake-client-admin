import React, { useState, useEffect } from "react";
import M from "materialize-css";
import Config from "../../../config/Config";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const Setting = () => {
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);

  const [setting, setSetting] = useState({});
  const [contactUs, setContactUs] = useState({});

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();

    delete setting.contactUs;

    const updateData = {
      cashback: setting.cashback || undefined,
      maximumCashbackAmount: setting.maximumCashbackAmount || undefined,
      minimumOrderAmount: setting.minimumOrderAmount || undefined,
      cashbackStatus: setting.cashbackStatus || false,
      contactUs: { ...contactUs },
    };

    console.log(updateData);

    fetch(`${Config.SERVER_URL}/setting`, {
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
    fetch(`${Config.SERVER_URL}/setting/`, {
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
            setSetting(result.body);
            setContactUs(result.body.contactUs || {});
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"Setting"}
          pageTitle={"Update Setting"}
          pageLink={"/branch/setting"}
        />

        {/* End Bread crumb and right sidebar toggle */}

        {/* Add Setting Form */}
        <div className="row mt-2">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Order Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Order Details</h3>
                </div>

                {/*  Minimum Order Amount */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Minimum Order Amount
                  </label>
                  <input
                    type="text"
                    value={setting.minimumOrderAmount}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        minimumOrderAmount: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Standard Delivery"}
                  />
                </div>
              </div>

              {/* Cashback Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Cashback Details</h3>
                </div>

                <div className="form-group col-md-12">
                  <div className="form-check m-0 p-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={setting.cashbackStatus}
                      onChange={(evt) => {
                        setSetting({
                          ...setting,
                          cashbackStatus: evt.target.checked,
                        });
                      }}
                      id="useWallet"
                    />
                    <label className="form-check-label" for="useWallet">
                      Cashback Status
                    </label>
                  </div>
                </div>

                {/* Maximum Cashback Amount */}
                {setting.cashbackStatus && (
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      Maximum Cashback Amount
                    </label>
                    <input
                      type="text"
                      value={setting.maximumCashbackAmount}
                      onChange={(evt) =>
                        setSetting({
                          ...setting,
                          maximumCashbackAmount: evt.target.value,
                        })
                      }
                      className="form-control"
                      placeholder={"Ex: 100"}
                    />
                  </div>
                )}

                {/* Amount */}
                {setting.cashbackStatus && (
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      Cashback Percentage
                    </label>
                    <input
                      type="number"
                      value={setting.cashback}
                      onChange={(evt) =>
                        setSetting({
                          ...setting,
                          cashback: evt.target.value,
                        })
                      }
                      className="form-control"
                      placeholder={2}
                    />
                  </div>
                )}
              </div>

              {/* Contact Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Contact Details</h3>
                </div>

                {/* Mobile Number */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={contactUs.mobile}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        mobile: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"9117162463"}
                  />
                </div>

                {/* Whatsapp Number */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Whatsapp Number
                  </label>
                  <input
                    type="tel"
                    value={contactUs.whatsappNumber}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        whatsappNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"9117162463"}
                  />
                </div>

                {/* Customer Support Number */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Customer Support Number
                  </label>
                  <input
                    type="text"
                    value={contactUs.customerSupportNumber}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        customerSupportNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"1800123123"}
                  />
                </div>

                {/* Email Address */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactUs.email}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        email: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"info@cake.com"}
                  />
                </div>

                {/* Customer Support Email */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={contactUs.customerSupportEmail}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        customerSupportEmail: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"info@cake.com"}
                  />
                </div>

                {/* Address */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Address
                  </label>
                  <input
                    type="text"
                    value={contactUs.address}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        address: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Write Address"}
                  />
                </div>

                {/* Google Map Url */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Google Map Url
                  </label>
                  <input
                    type="url"
                    value={contactUs.googleMapUrl}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        googleMapUrl: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={
                      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3683.480299686449!2d88.4079383!3d22.598532799999997!3m2!1i1024!2i768!4f13.1!4m3!3e6!4m0!4m0!5e0!3m2!1sen!2sin!4v1663319853505!5m2!1sen!2sin"
                    }
                  />
                </div>

                <div className={"form-group col-md-12 mt-2"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isUpdateLoaded ? (
                      <div>
                        <i className="fas fa-refresh"></i> Update Setting
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
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
