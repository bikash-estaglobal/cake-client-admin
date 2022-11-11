import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import { storage } from "../../../../firebase/FirebaseConfig";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";

function EditAdonProduct() {
  const history = useHistory();
  const { id } = useParams();
  // State Variable
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [defaultImages, setDefaultImages] = useState("");
  const [defaultImgProgress, setDefaultImgProgress] = useState("");

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    parentCategories: [],
    categories: [],
    image: "",
    status: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [progressInfos, setProgressInfos] = useState([]);

  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);

  const [selectPCat, setSelectPCat] = useState([]);
  const [selectSCat, setSelectSCat] = useState([]);
  const [selectShape, setSelectShape] = useState([]);
  const [selectFlavour, setSelectFlavour] = useState("");
  const [selectType, setSelectType] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [productDescriptions, setProductDescriptions] = useState("");

  // Image Change
  const imageChangeHandler = (event) => {
    handleUpload(event.target.files[0]);
  };

  // File Delete Handler
  const fileDeleteHandler = (image, index, type) => {
    setDefaultImages("");
    setProduct({ ...product, image: "" });
    setDefaultImgProgress("");

    // // Create a reference to the file to delete
    // const fileRef = storage.refFromURL(image);
    // // Delete the file
    // fileRef
    //   .delete()
    //   .then(() => {
    //     // File deleted successfully
    //     if (type == "default_image") {
    //       setDefaultImages("");
    //       setDefaultImgProgress("");
    //     } else {
    //       let pImages = [...previewImages];
    //       pImages.splice(index, 1);

    //       let pInfos = [...progressInfos];
    //       pInfos.splice(index, 1);
    //       setProgressInfos(pInfos);
    //       setPreviewImages(pImages);
    //     }
    //   })
    //   .catch((error) => {
    //     // Uh-oh, an error occurred!
    //     M.toast({ html: error, classes: "bg-danger" });
    //   });
  };

  // Upload Image
  const handleUpload = (image) => {
    const uploadTask = storage.ref(`products/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setDefaultImgProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("products")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setDefaultImages(url);
            setProduct((old) => {
              return {
                ...old,
                image: url,
              };
            });
          });
      }
    );
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    const filteredPCat = selectPCat.map((value) => {
      return value.catId;
    });
    const filteredSCat = selectSCat.map((value) => {
      return value.catId;
    });

    const updateProduct = {
      ...product,
      parentCategories: filteredPCat,
      categories: filteredSCat,
      _id: undefined,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    console.log(updateProduct);

    fetch(`${Config.SERVER_URL}/adon-product/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateProduct),
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
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Get Product Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/adon-product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Type", result.body);
          if (result.status === 200) {
            setProduct(result.body);
            setDefaultImages(result.body.image);

            // Set Sub Categories
            if (result.body.parentCategories) {
              if (result.body.parentCategories.length) {
                let c = [];
                result.body.parentCategories.forEach((item) => {
                  c.push({ name: item.name, catId: item._id });
                });
                setSelectPCat(c);
              }
            }

            // Set Sub Categories
            if (result.body.categories) {
              if (result.body.categories.length) {
                let c = [];
                result.body.categories.forEach((item) => {
                  c.push({ name: item.name, catId: item._id });
                });
                setSelectSCat(c);
              }
            }
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Parent Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=200`, {
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
            let f = result.body.map((v) => {
              return { label: v.name, value: v._id };
            });

            setParentCategory(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Category
  useEffect(() => {
    let url = `${Config.SERVER_URL}/category`;
    let body = "";
    let method = "GET";
    if (selectPCat.length) {
      const filter = selectPCat.map((value) => value.catId);
      url = `${url}/byParentCategory?limit=0`;
      body = { catId: filter };
      method = "POST";
    } else {
      url = `${url}?limit=0`;
      setSelectSCat([]);
    }

    fetch(url, {
      method: method,
      body: body != "" ? JSON.stringify(body) : null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            if (!result.body.length) setSelectSCat([]);
            let f = result.body.map((v) => {
              return { label: v.name, value: v._id };
            });
            setCategory(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, [selectPCat]);

  const addParentCategoryHandler = (evt) => {
    const cat = {
      catId: evt.value,
      name: evt.label,
    };

    const isExist = selectPCat.find((value) => {
      if (value.catId == cat.catId) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "Already Exist", classes: "text-light" });
      return;
    }

    setSelectPCat([...selectPCat, cat]);
  };

  const deleteParentCategoryHandler = (evt, value) => {
    evt.preventDefault();
    const filtered = selectPCat.filter(
      (cat, index) => cat.catId != value.catId
    );

    setSelectPCat([...filtered]);
  };

  const addSubCategoryHandler = (evt) => {
    const cat = {
      name: evt.label,
      catId: evt.value,
    };

    const isExist = selectSCat.find((value) => {
      if (value.catId == cat.catId) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "Already Exist", classes: "text-light" });
      return;
    }

    console.log(selectSCat);
    setSelectSCat([...selectSCat, cat]);
  };

  const deleteSubCategoryHandler = (evt, value) => {
    evt.preventDefault();
    const filtered = selectSCat.filter(
      (cat, index) => cat.catId != value.catId
    );

    setSelectSCat([...filtered]);
  };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"PRODUCTS"} pageTitle={"Update Product"} />
        {/* End Bread crumb and right sidebar toggle */}

        {/* Listing Form */}
        <div className="row mt-2">
          <div className={"col-md-12 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* PRODUCT DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT DETAILS</h3>
                </div>

                {/* Product Name */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT NAME HERE !
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(evt) => {
                      setProduct({ ...product, name: evt.target.value });
                    }}
                    className="form-control"
                    placeholder={"Big Rectangle Cake"}
                  />
                </div>

                {/* sellingPrice */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELLING PRICE
                  </label>
                  <input
                    type="text"
                    value={product.sellingPrice}
                    onChange={(evt) =>
                      setProduct({ ...product, sellingPrice: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"499"}
                  />
                </div>

                {/* Parent Category */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT PARENT CATEGORY !
                  </label>
                  <div className="">
                    <Select
                      options={parentCategory}
                      onChange={addParentCategoryHandler}
                    />
                  </div>
                </div>

                {/* Selected Parent Category */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED PARENT CATEGORY !
                  </label>
                  <div className="border p-2">
                    {selectPCat.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-success p-2 btn mr-2 "
                          onClick={(evt) =>
                            deleteParentCategoryHandler(evt, value)
                          }
                        >
                          <i className="fa fa-times text-danger"></i>{" "}
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Sub Category */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT SUB CATEGORY !
                  </label>

                  <div className="">
                    <Select
                      options={category}
                      onChange={addSubCategoryHandler}
                    />
                  </div>
                </div> */}

                {/* Selected Sub Category */}
                {/* <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED SUB CATEGORY !
                  </label>
                  <div className="border p-2">
                    {selectSCat.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-info p-2 btn mr-2"
                          onClick={(evt) =>
                            deleteSubCategoryHandler(evt, value)
                          }
                        >
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div> */}

                {/* SELECT STATUS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT STATUS
                  </label>
                  <select
                    name=""
                    id=""
                    value={product.status}
                    onChange={(evt) => {
                      setProduct({ ...product, status: evt.target.value });
                    }}
                    className="form-control"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Disabled</option>
                  </select>
                </div>
              </div>

              {/* PRODUCT IMAGES */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT IMAGES</h3>
                </div>

                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT IMAGE
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(evt) => imageChangeHandler(evt, "default_image")}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  {defaultImages ? (
                    <div
                      className={"form-group text-center"}
                      style={{ position: "relative" }}
                    >
                      <img
                        style={{
                          maxHeight: "200px",
                          maxWidth: "200px",
                          border: "1px solid #5a5a5a",
                        }}
                        src={defaultImages}
                      />
                      <button
                        style={{
                          position: "absolute",
                          top: "40%",
                          left: "50%",
                        }}
                        type="button"
                        className="btn bg-light text-danger"
                        title={"Delete Image"}
                        onClick={(evt) =>
                          fileDeleteHandler(defaultImages, "", "default_image")
                        }
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {defaultImgProgress ? (
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${defaultImgProgress}%` }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {defaultImgProgress}%
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Submit Button */}
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-refresh"></i> Update Product
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
}

export default EditAdonProduct;
