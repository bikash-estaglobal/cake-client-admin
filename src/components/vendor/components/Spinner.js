import React from "react";

const Spinner = () => {
  return (
    <div>
      <span
        className="spinner-border spinner-border-sm mr-1"
        role="status"
        aria-hidden="true"
      ></span>
      Loading..
    </div>
  );
};

export default Spinner;
