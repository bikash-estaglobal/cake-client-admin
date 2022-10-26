import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import Config from "../../../config/Config";
import { storage } from "../../../../firebase/FirebaseConfig";
import Breadcrumb from "../../components/Breadcrumb";

const AddParentCategory = () => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const [isAddLaoded, setIsAddLaoded] = useState(true);
  const [uploaded, setUploaded] = useState(true);

  const [isAdded, setIsAdded] = useState(false);

  const [data, setData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "null",
    description: "",
  });

  const titleChangeHandler = (evt) => {
    const value = evt.target.value;
    setFormData({
      ...formData,
      slug: value.toLowerCase().replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLaoded(false);
    evt.preventDefault();

    if (progress > 0 && progress < 100) {
      M.toast({ html: "Wait for Image uploading", classes: "bg-warning" });
      return;
    }

    fetch(Config.SERVER_URL + "/parent-category", {
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
          setIsAddLaoded(true);

          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });

            setIsAdded(!isAdded);
            setProgress(0);
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          setIsAddLaoded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // For Image
  const imgChangeHandler = (e, type) => {
    if (e.target.files[0]) {
      setUploaded(false);
      handleUpload(e.target.files[0], type);
    }
  };

  // Upload Image
  const handleUpload = (image, type) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (type == "ADD") {
              setFormData({
                ...formData,
                image: url,
              });
            } else {
              setData({
                ...data,
                image: url,
              });
            }
            setUploaded(true);
            // setCategory({ ...category, category_image: url })
          });
      }
    );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"PARENT CATEGORY"} pageTitle={"Add Category"} />

        {/* Add Flavour Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Flavour Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Category Details</h3>
                </div>

                {/* CATEGORY NAME */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>CATEGORY NAME</label>
                  <input
                    type="text"
                    onChange={titleChangeHandler}
                    value={formData.name}
                    className="form-control"
                    placeholder={"Photo Cake"}
                  />
                </div>

                {/* CATEGORY SLUG */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>CATEGORY SLUG</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        slug: evt.target.value,
                      })
                    }
                    value={formData.slug}
                    className="form-control"
                    placeholder={"photo-cake"}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>DESCRIPTION</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        description: evt.target.value,
                      })
                    }
                    value={formData.description}
                    className="form-control"
                    placeholder={"Enter Description"}
                  />
                </div>

                {/* CATEGORY IMAGE */}
                <div className={"form-group mb-3 col-md-6"}>
                  <div className="row">
                    <div
                      className={
                        formData.image !== "null" ? "col-md-8" : "col-md-12"
                      }
                    >
                      <label className={"text-dark h6"}>CATEGORY IMAGE</label>
                      <input
                        type="file"
                        name=""
                        className="form-control"
                        onChange={(e) => imgChangeHandler(e, "ADD")}
                      />
                    </div>

                    {!uploaded ? (
                      <div className="col-md-4">
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </div>
                    ) : (
                      <div className="col-md-4">
                        {formData.image !== "null" ? (
                          <img
                            style={{
                              height: "100px",
                              width: "100px",
                              borderRadius: "20px",
                            }}
                            className="img img-thumbnail"
                            src={formData.image}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <h6 className="text-center">
                    <button className="btn btn-outline-info shadow-none">
                      OR
                    </button>
                  </h6>
                </div>

                {/* EMAGE URL */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>EMAGE URL</label>
                  <input
                    type="text"
                    name=""
                    className="form-control"
                    placeholder="Image URL"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div className={"form-group col-md-12"}>
                  <button className="btn btn-info rounded" type={"submit"}>
                    {isAddLaoded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add
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

                  <button
                    className="btn btn-secondary rounded ml-2"
                    data-dismiss="modal"
                    id={"closeAddModalButton"}
                  >
                    Close
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

export default AddParentCategory;
