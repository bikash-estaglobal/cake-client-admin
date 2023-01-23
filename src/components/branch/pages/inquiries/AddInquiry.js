import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const AddInquiry = () => {
  const history = useHistory();
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [formData, setFormDate] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/inquiries", {
      method: "POST",
      body: JSON.stringify(formData),
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
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb
          title="USER INQUIRY"
          page="INQUIRY"
          pageLink={"/inquiries"}
          subPage={"ADD"}
          goBack={true}
        />

        {/* Add Material Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* SIZE DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>USER DETAILS</h3>
                </div>

                {/* USER NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CUSTOMER NAME !
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(evt) =>
                      setFormDate({ ...formData, name: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Name"}
                  />
                </div>

                {/* USER MOBILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CUSTOMER MOBILE !
                  </label>
                  <input
                    type="number"
                    value={formData.mobile}
                    onChange={(evt) =>
                      setFormDate({ ...formData, mobile: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Mobile"}
                  />
                </div>

                {/* USER EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CUSTOMER EMAIL !
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(evt) =>
                      setFormDate({ ...formData, email: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Email"}
                  />
                </div>

                {/* USER PURPOSE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CUSTOMER PURPOSE !
                  </label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(evt) =>
                      setFormDate({ ...formData, purpose: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Purpose"}
                  />
                </div>

                {/* MESSAGE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MESSAGE !
                  </label>
                  <textarea
                    name=""
                    className="form-control"
                    id=""
                    placeholder="Enter Message"
                    value={formData.message}
                    onChange={(evt) =>
                      setFormDate({ ...formData, message: evt.target.value })
                    }
                    cols="30"
                    rows="2"
                  ></textarea>
                </div>

                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Inquiry
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

export default AddInquiry;
