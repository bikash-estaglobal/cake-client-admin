import React from "react";
import { Link, useHistory } from "react-router-dom";

const Breadcrumb = ({
  title,
  pageTitle,
  pageLink,
  subPageTitle,
  subPageLink,
  homeLink,
}) => {
  // get History
  const history = useHistory();

  // goBack
  const goBack = (evt) => {
    evt.preventDefault();
    history.goBack();
  };

  const goForward = (evt) => {
    evt.preventDefault();
    history.goForward();
  };

  return (
    <div className="row page-titles d-flex justify-content-between">
      <div className="col-md-5 col-8 align-self-center">
        <h3 className="text-themecolor m-b-0 m-t-0">{title || "Profile"}</h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={homeLink || "/branch"}>Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={pageLink}>{pageTitle || "Home"}</Link>
          </li>
          {subPageTitle && (
            <li className="breadcrumb-item">
              <Link to={subPageLink}>{subPageTitle}</Link>
            </li>
          )}
        </ol>
      </div>
      <div className="">
        <button
          type="button"
          className="btn btn-muted shadow-sm mr-2 px-2 py-1"
          onClick={goBack}
        >
          <i className="fa fa-arrow-left"></i>
        </button>

        <button
          type="button"
          className="btn btn-muted shadow-sm mr-2 px-2 py-1"
          onClick={goForward}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Breadcrumb;
