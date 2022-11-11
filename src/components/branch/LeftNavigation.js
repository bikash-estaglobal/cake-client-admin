import React, { useContext, useState, useEffect } from "react";
import { Link, BrowserRouter, useHistory } from "react-router-dom";
import M from "materialize-css";
import { BranchContext } from "./Branch";
import $ from "jquery";

function LeftNavigation() {
  const history = useHistory();
  const { state, dispatch } = useContext(BranchContext);

  // Fetching the data
  useEffect(() => {}, []);

  // Login Function
  const logout = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("branch");
    localStorage.removeItem("jwt_branch_token");
    dispatch({ type: "CLEAR" });
    history.push("/branch/login");
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
                    to="/branch/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-user"></i> My Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/branch/profile"
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
                    to="/branch"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-gauge"></i>
                    <span className="hide-menu">Dashboard </span>
                  </Link>
                </li>

                {/* Setup Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-settings"></i>
                    <span className="hide-menu">SETTING</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/setting" onClick={removeLeftNavigation}>
                        Setting
                      </Link>
                    </li>
                    <li>
                      <Link to="/branch/coupons" onClick={removeLeftNavigation}>
                        Coupons
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/shippingMethods"
                        onClick={removeLeftNavigation}
                      >
                        Shipping Method
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/flavours"
                        onClick={removeLeftNavigation}
                      >
                        Cake Flavour
                      </Link>
                    </li>
                    <li>
                      <Link to="/branch/shapes" onClick={removeLeftNavigation}>
                        Cake Shape
                      </Link>
                    </li>
                    <li>
                      <Link to="/branch/types" onClick={removeLeftNavigation}>
                        Cake Type
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/branch/colors" onClick={removeLeftNavigation}>
                        Cake Color
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/branch/pincodes"
                        onClick={removeLeftNavigation}
                      >
                        Pincodes
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/branch/deals" onClick={removeLeftNavigation}>
                        Deals
                      </Link>
                    </li> */}
                  </ul>
                </li>

                {/* Users Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">USERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/branch/customers"
                        onClick={removeLeftNavigation}
                      >
                        User Lists
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/newsletters"
                        onClick={removeLeftNavigation}
                      >
                        Newsletter Emails
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Vendors Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">VENDORS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/vendors" onClick={removeLeftNavigation}>
                        Vendor Lists
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Customer Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-image-area"></i>
                    <span className="hide-menu">BANNERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/slider" onClick={removeLeftNavigation}>
                        Main Slider
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/nextToSlider"
                        onClick={removeLeftNavigation}
                      >
                        Next to Slider
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/bestSaleBanner"
                        onClick={removeLeftNavigation}
                      >
                        Best Sale Banner
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/categoryPageBanner"
                        onClick={removeLeftNavigation}
                      >
                        Category Page Banner
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/offerBanner"
                        onClick={removeLeftNavigation}
                      >
                        Offer Banner
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Category */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-book-open-variant"></i>
                    <span className="hide-menu">CATEGORIES</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/branch/parentCategories"
                        onClick={removeLeftNavigation}
                      >
                        Parent Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/categories"
                        onClick={removeLeftNavigation}
                      >
                        Sub Category
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Product Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-note-multiple-outline"></i>
                    <span className="hide-menu">PRODUCTS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/branch/products"
                        onClick={removeLeftNavigation}
                      >
                        Product List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/adonProducts"
                        onClick={removeLeftNavigation}
                      >
                        Adon Products
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Order Section */}
                <li>
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
                        to="/branch/newOrders"
                        onClick={removeLeftNavigation}
                      >
                        Today Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/branch/orders" onClick={removeLeftNavigation}>
                        Order List
                      </Link>
                    </li>
                  </ul>
                </li>

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
                    <li>
                      <Link
                        to="/branch/report/customers"
                        onClick={removeLeftNavigation}
                      >
                        Top 10 Customers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/branch/report/products"
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
              to="/branch/setting"
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
