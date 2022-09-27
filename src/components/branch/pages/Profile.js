import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { BranchContext } from "../Branch";
import Config from "../../config/Config";
import M from "materialize-css";
import Breadcrumb from "../components/Breadcrumb";

function Profile() {
  const { state, dispatch } = useContext(BranchContext);
  // State Variable
  const [profile, setProfile] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [data, setData] = useState({});
  const [isUpdated, setisUpdated] = useState(true);

  // updateChangeHandler
  const updateChangeHandler = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setData({ ...data, [name]: value });
  };

  // updateChangeHandler
  const updateSubmitHandler = (evt) => {
    setisUpdated(false);
    evt.preventDefault();

    const updateData = {
      name: data.name || undefined,
      email: data.email || undefined,
      password: data.password || undefined,
      oldPassword: data.oldPassword || undefined,
    };

    fetch(Config.SERVER_URL + "/admin/updateProfile", {
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
          if (result.status == 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            dispatch({ type: "BRANCH", payload: result.body });
          } else {
            const keys = Object.keys(result.error);
            keys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });

            if (result.message)
              M.toast({ html: result.message, classes: "bg-danger" });
          }
          setisUpdated(true);
        },
        (error) => {
          console.log(error);
          setisUpdated(true);
        }
      );
  };

  // Fetching the data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/admin/getProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setIsLoaded(true);
            setProfile(result.body || {});
            setData(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-success" });
            setIsLoaded(true);
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsLoaded(true);
        }
      );
  }, [isUpdated]);

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className="container-fluid">
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"Profile"}
          pageTitle={"Show Profile"}
          pageLink={"/branch/profile"}
        />
        {/* End Bread crumb and right sidebar toggle */}

        {/* Start Page Content */}
        {/* Row */}
        <div className="row">
          {/* Profile */}
          <div className="col-lg-4 col-xlg-3 col-md-5">
            <div className="card">
              <div className="card-body">
                <center className="m-t-30">
                  <img
                    src={
                      "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png"
                    }
                    className="user-profile-img shadow-sm"
                    width="150"
                  />

                  <h4 className="card-title m-t-10">{profile.name}</h4>

                  <div className="row text-center justify-content-md-center"></div>
                </center>
              </div>
              <div>
                <hr />
              </div>
              <div className="card-body">
                <small className="text-muted">Name </small>
                <h6>{profile.name || "Not Available"}</h6>
                <small className="text-muted p-t-30 db">Email</small>
                <h6>{profile.email || "Not Available"}</h6>
              </div>
            </div>
          </div>
          {/* End Profile */}

          {/* Column */}
          <div className="col-lg-8 col-xlg-9 col-md-7">
            <div className="card">
              {/* Nav tabs */}
              <ul className="nav nav-tabs profile-tab" role="tablist">
                {/* <li className="nav-item">
                  <button
                    className="nav-link active outline-0 rounded-0"
                    data-toggle="tab"
                    href="#profile"
                    role="tab"
                  >
                    Profile
                  </button>
                </li> */}
                <li className="nav-item">
                  <button
                    className="nav-link active outline-0 rounded-0"
                    data-toggle="tab"
                    href="#settings"
                    role="tab"
                  >
                    Settings
                  </button>
                </li>
              </ul>
              {/* Tab panes */}
              <div className="tab-content">
                {/* First Tab */}

                {/* profile second tab */}
                {/* <div className="tab-pane active" id="profile" role="tabpanel">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 col-xs-6 b-r">
                        <strong>Name </strong>
                        <br />
                        <p className="text-muted"> {profile.name}</p>
                      </div>
                      <div className="col-md-3 col-xs-6 b-r">
                        <strong>Mobile</strong>
                        <br />
                        <p className="text-muted">
                          {profile.mobile || "Not Available"}
                        </p>
                      </div>
                      <div className="col-md-3 col-xs-6 b-r">
                        <strong>Email</strong>
                        <br />
                        <p className="text-muted">
                          <a
                            href={`mailto:${profile.email}`}
                            className="__cf_email__"
                            data-cfemail="355f5a5d5b54415d545b755451585c5b1b565a58"
                          >
                            {profile.email || "Not Available"}
                          </a>
                        </p>
                      </div>
                      <div className="col-md-3 col-xs-6">
                        <strong>Address</strong>
                        <br />
                        <p className="text-muted">
                          {profile.address || "Not Available"}
                        </p>
                      </div>
                      <div className="col-md-12 col-xs-6">
                        <hr />
                        <strong>Bio</strong>
                        <p className="text-muted">
                          {" "}
                          {profile.bio || "Not Available"}{" "}
                        </p>
                      </div>
                    </div>
                    <hr />

                    <h4 className="font-medium m-t-30">Social Profile</h4>
                    {profile.twitter && (
                      <a
                        target={"_blank"}
                        href={profile.twitter}
                        className="btn btn-circle btn-secondary"
                      >
                        <i className="mdi mdi-twitter"></i>
                      </a>
                    )}

                    {profile.facebook && (
                      <a
                        target={"_blank"}
                        href={profile.facebook}
                        className="btn btn-circle btn-secondary"
                      >
                        <i className="mdi mdi-facebook"></i>
                      </a>
                    )}
                    {profile.instagram && (
                      <a
                        target={"_blank"}
                        href={profile.instagram}
                        className="btn btn-circle btn-secondary"
                      >
                        <i className="mdi mdi-instagram"></i>
                      </a>
                    )}

                    {profile.youtube && (
                      <a
                        target={"_blank"}
                        href={profile.youtube}
                        className="btn btn-circle btn-secondary"
                      >
                        <i className="mdi mdi-youtube-play"></i>
                      </a>
                    )}
                    <hr />
                  </div>
                </div> */}

                {/* Setting (Third) Tab */}
                <div className="tab-pane active" id="settings" role="tabpanel">
                  <div className="card-body">
                    <form
                      className="form-horizontal form-material"
                      onSubmit={updateSubmitHandler}
                    >
                      <div className={"form-group px-3"}>
                        <label className="">Full Name</label>
                        <input
                          type="text"
                          name={"name"}
                          value={data.name || ""}
                          onChange={updateChangeHandler}
                          placeholder="Name Here!"
                          className="form-control form-control-line"
                        />
                      </div>
                      <div className={"form-group px-3"}>
                        <label className="">Email</label>
                        <input
                          type="email"
                          name={"email"}
                          value={data.email || ""}
                          onChange={updateChangeHandler}
                          placeholder="coderakash@coder.com"
                          className="form-control form-control-line"
                        />
                      </div>

                      <div className={"form-group px-3"}>
                        <label className="">Old Password</label>
                        <input
                          type="password"
                          name={"oldPassword"}
                          value={data.oldPassword || ""}
                          onChange={updateChangeHandler}
                          placeholder="Old Password"
                          className="form-control form-control-line"
                        />
                      </div>

                      <div className={"form-group px-3"}>
                        <label className="">New Password</label>
                        <input
                          type="password"
                          name={"password"}
                          value={data.password || ""}
                          onChange={updateChangeHandler}
                          placeholder="New Password"
                          className="form-control form-control-line"
                        />
                      </div>

                      <div className="form-group">
                        <div className="col-sm-12">
                          <button className="btn btn-success">
                            {isUpdated ? (
                              <div>
                                <i className="fas fa-sign-in"></i> Update
                                Profile
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
          </div>
          {/* Column */}
        </div>
        {/* Row */}
        {/* End PAge Content */}
      </div>
    </div>
  );
}

export default Profile;
