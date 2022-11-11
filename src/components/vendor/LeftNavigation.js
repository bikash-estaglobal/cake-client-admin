import React, { useContext, useState, useEffect } from "react";
import { Link, BrowserRouter, useHistory } from "react-router-dom";
import M from "materialize-css";
import { VendorContext } from "./Vendor";
import $ from "jquery";

function LeftNavigation() {
  const history = useHistory();
  const { state, dispatch } = useContext(VendorContext);

  // Fetching the data
  useEffect(() => {}, []);

  // Login Function
  const logout = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("vendor");
    localStorage.removeItem("jwt_vendor_token");
    dispatch({ type: "CLEAR" });
    history.push("/vendor/login");
  };

  // Remove Left Navigation When Click On The Link
  const removeLeftNavigation = (evt) => {
    $("body").removeClass("show-sidebar");
  };

  // Return Function
  return (
    <div>
      {state && (
        <aside className="left-sidebar">
          {/* <!-- Sidebar scroll--> */}
          <div className="scroll-sidebar">
            {/* <!-- User profile --> */}
            <div
              className="user-profile"
              style={{
                background:
                  "url(../assets/images/background/user-info.jpg) no-repeat",
              }}
            >
              {/* <!-- User profile image --> */}
              <div className="profile-img text-center">
                {state.profile_picture ? (
                  <img src={state.profile_picture} alt="user" />
                ) : (
                  <span
                    className={"fas fa-user-circle text-white"}
                    style={{ fontSize: "51px" }}
                  />
                )}
              </div>
              {/* <!-- User profile text--> */}
              <div className="profile-text">
                <Link
                  to="/"
                  className="dropdown-toggle u-dropdown"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {state.name}
                </Link>

                <div className="dropdown-menu animated flipInY">
                  <Link
                    to="/vendor/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-user"></i> My Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/vendor/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-settings"></i> Account Setting
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link className="dropdown-item" to={"#"} onClick={logout}>
                    <i className="fa fa-power-off"></i> Logout
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- End User profile text--> */}

            {/* <!-- Sidebar navigation--> */}
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="nav-small-cap">PERSONAL</li>
                {/* Dashboard */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/vendor"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-gauge"></i>
                    <span className="hide-menu">Dashboard </span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/vendor/newOrders"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-new-box"></i>
                    <span className="hide-menu">Today Orders </span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/vendor/orders"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-view-list"></i>
                    <span className="hide-menu">All Orders </span>
                  </Link>
                </li>

                {/* Order Section */}
                {/* <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-checkbox-multiple-marked-circle"></i>
                    <span className="hide-menu">ORDERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/vendor/newOrders"
                        onClick={removeLeftNavigation}
                      >
                        New Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/orders" onClick={removeLeftNavigation}>
                        Order List
                      </Link>
                    </li>
                  </ul>
                </li> */}

                {/* Report Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-chart-bar"></i>
                    <span className="hide-menu">REPORTS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    {/* <li>
                      <Link
                        to="/vendor/report/customers"
                        onClick={removeLeftNavigation}
                      >
                        Top 10 Customers
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/vendor/report/products"
                        onClick={removeLeftNavigation}
                      >
                        Top 10 Prodcucts
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            {/* <!-- End Sidebar navigation --> */}
          </div>
          {/* <!-- End Sidebar scroll--> */}
          {/* <!-- Bottom points--> */}
          <div className="sidebar-footer">
            {/* <!-- item--> */}
            <Link
              to="/vendor/setting"
              className="link"
              data-toggle="tooltip"
              title="Settings"
              onClick={removeLeftNavigation}
            >
              <i className="ti-settings"></i>
            </Link>
            {/* <!-- item--> */}
            <Link
              to="#"
              className="link"
              data-toggle="tooltip"
              title="Email"
              onClick={removeLeftNavigation}
            >
              <i className="mdi mdi-gmail"></i>
            </Link>
            {/* <!-- item--> */}

            <Link
              to="#"
              onClick={(evt) => logout(evt)}
              className="link"
              data-toggle="tooltip"
              title="Logout"
            >
              <i className="mdi mdi-power"></i>
            </Link>
          </div>
          {/* <!-- End Bottom points--> */}
        </aside>
      )}
    </div>
  );
}

export default LeftNavigation;
