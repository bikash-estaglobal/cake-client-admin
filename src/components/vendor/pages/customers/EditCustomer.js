import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const EditCustomer = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    status: "",
    isVerified: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();
    const updateData = {
      isVerified: user.isVerified,
      status: user.status,
    };

    fetch(`${Config.SERVER_URL}/customer/${user._id}`, {
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
          M.toast({ html: error, classes: "bg-danger" });
          setUserLoaded(true);
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

        {/* Add Color Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            {userLoaded ? (
              <form
                onSubmit={submitHandler}
                className="form-horizontal form-material"
              >
                {/* User Details */}
                <div className={"row shadow-sm bg-white py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>User Details</h3>
                  </div>

                  {/* NAME */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      NAME !
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      onChange={(evt) =>
                        setUser({ ...user, name: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Sakshi"}
                    />
                  </div>

                  {/* MOBILE */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      MOBILE !
                    </label>
                    <input
                      readOnly
                      type="text"
                      value={user.mobile}
                      onChange={(evt) =>
                        setUser({ ...user, mobile: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"9117152323"}
                    />
                  </div>

                  {/* EMAIL */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      EMAIL !
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={user.email}
                      onChange={(evt) =>
                        setUser({ ...user, email: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"user@user.com"}
                    />
                  </div>

                  {/* IS VERIFIED */}
                  <div className={"col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ACCOUNT VERIFIED !
                    </label>
                    <div className="d-flex my-3">
                      <div className="custom-control custom-radio pl-0 ml-0">
                        <input
                          type="radio"
                          id="cakeType3"
                          name="account-verification"
                          value={true}
                          checked={user.isVerified == true ? true : false}
                          onChange={(evt) =>
                            setUser({
                              ...user,
                              isVerified:
                                evt.target.value == "true" ? true : "",
                            })
                          }
                          className="custom-control-input"
                        />
                        <label className="custom-control-label" for="cakeType3">
                          YES
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="cakeType4"
                          name="account-verification"
                          checked={user.isVerified == false ? true : false}
                          value={false}
                          onChange={(evt) => {
                            setUser({
                              ...user,
                              isVerified:
                                evt.target.value == "false" ? false : "",
                            });
                          }}
                          className="custom-control-input"
                        />
                        <label className="custom-control-label" for="cakeType4">
                          NO
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ACCOUNT STATUS */}
                  <div className={"col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ACCOUNT STATUS !
                    </label>
                    <div className="d-flex my-3">
                      <div className="custom-control custom-radio pl-0 ml-0">
                        <input
                          type="radio"
                          id="active-status"
                          name="account-status"
                          value={true}
                          checked={user.status == true ? true : false}
                          onChange={(evt) =>
                            setUser({
                              ...user,
                              status: evt.target.value == "true" ? true : "",
                            })
                          }
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          for="active-status"
                        >
                          ACTIVE
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="disabled-status"
                          name="account-status"
                          checked={user.status == false ? true : false}
                          value={false}
                          onChange={(evt) => {
                            setUser({
                              ...user,
                              status: evt.target.value == "false" ? false : "",
                            });
                          }}
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          for="disabled-status"
                        >
                          DISABLED
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={"form-group col-md-12 mt-3"}>
                    <button
                      className="btn btn-info rounded px-3 py-2"
                      type={"submit"}
                    >
                      {isUpdateLoaded ? (
                        <div>
                          <i className="fas fa-refresh"></i> Update User
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

export default EditCustomer;
