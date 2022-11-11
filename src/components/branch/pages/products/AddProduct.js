import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import M from "materialize-css";
import Config from "../../../config/Config";
import { storage } from "../../../../firebase/FirebaseConfig";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";

function AddProduct() {
  const history = useHistory();
  // State Variable
  const [weight, setWeight] = useState("");
  const [mrp, setMRP] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [imageUploaded, setImageUploaded] = useState(true);
  const [defaultImages, setDefaultImages] = useState("");
  const [defaultImgProgress, setDefaultImgProgress] = useState("");

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    parentCategories: [],
    // categories: [],
    priceVariants: [],
    maximumOrderQuantity: 2,
    sku: "",
    flavour: "",
    shape: "",
    type: "",
    images: [],
    isEggCake: false,
    isPhotoCake: false,
    description: "",
    shortDescription: "",
    tags: "",
  });
  const [logoDefault, setlogoDefault] = useState("https://bit.ly/3kPLfxF");
  const [previewImages, setPreviewImages] = useState([]);
  const [progressInfos, setProgressInfos] = useState([]);

  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [flavour, setFlavour] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [types, setTypes] = useState([]);
  const [color, setColor] = useState([]);
  const [progress, setProgress] = useState("");

  const [selectPCat, setSelectPCat] = useState([]);
  const [selectSCat, setSelectSCat] = useState([]);
  const [selectFlavour, setSelectFlavour] = useState("");
  const [selectType, setSelectType] = useState("");
  const [selectColor, setSelectColor] = useState("");

  const titleChangeHandler = (evt) => {
    const value = evt.target.value;
    setProduct({
      ...product,
      slug: value
        .toLowerCase()
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
        .replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Image Change
  const imageChangeHandler = (event, type) => {
    if (type == "default_image") {
      handleUpload(event.target.files[0], "", type);
    } else {
      if (event.target.files && event.target.files.length) {
        [...event.target.files].map((value, index) => {
          handleUpload(value, index);
        });
      }
    }
  };

  // File Delete Handler
  const fileDeleteHandler = (image, index, type) => {
    // Create a reference to the file to delete
    const fileRef = storage.refFromURL(image);
    // Delete the file
    fileRef
      .delete()
      .then(() => {
        // File deleted successfully
        if (type == "default_image") {
          setDefaultImages("");
          setDefaultImgProgress("");
        } else {
          let pImages = [...previewImages];
          pImages.splice(index, 1);

          let pInfos = [...progressInfos];
          pInfos.splice(index, 1);
          setProgressInfos(pInfos);
          setPreviewImages(pImages);
        }
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        M.toast({ html: error, classes: "bg-danger" });
      });
  };

  // Upload Image
  const handleUpload = (image, i, type) => {
    const uploadTask = storage.ref(`products/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (type == "default_image") {
          setDefaultImgProgress(progress);
        } else {
          let arrs = [...progressInfos];
          arrs[i] = progress;
          setProgressInfos((old) => {
            return [...arrs];
          });
        }
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
            console.log(url);
            if (type == "default_image") {
              setDefaultImages(url);
              setProduct((old) => {
                return {
                  ...old,
                  defaultImage: url,
                };
              });
            } else {
              setPreviewImages((old) => [...old, url]);
              setProduct((old) => {
                return {
                  ...old,
                  images: [...old.images, { url }],
                };
              });
            }
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
    // const filteredSCat = selectSCat.map((value) => {
    //   return value.catId;
    // });

    const addProduct = {
      ...product,
      parentCategories: filteredPCat,
      // categories: filteredSCat,
      flavour: selectFlavour,
      type: selectType,
      // color: selectColor,
      images: previewImages.map((img) => {
        return {
          url: img,
        };
      }),
    };

    fetch(Config.SERVER_URL + "/product", {
      method: "POST",
      body: JSON.stringify(addProduct),
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

  // get Parent Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=5000`, {
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

  // get Shapes
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/shape?skip=0&limit=0`, {
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
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setShapes(modifyForSelect);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get types
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/type?skip=0&limit=0`, {
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
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setTypes(modifyForSelect);
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
      url = `${url}/byParentCategory?limit=200`;
      body = { catId: filter };
      method = "POST";
    } else {
      url = `${url}?limit=200`;
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

  // get Flavour
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour?limit=0`, {
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
            setFlavour(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Color
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/color?limit=0`, {
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
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setColor(modifyForSelect);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // Add Time Handler
  const addPriceVariantsHandler = (evt) => {
    evt.preventDefault();
    if (weight == "" || mrp == "" || sellingPrice == "") {
      M.toast({ html: "Please Fill Price Details", classes: "text-light" });
      return;
    }

    const isExist = product.priceVariants.find((value) => {
      if (
        value.mrp == mrp &&
        value.weight == weight &&
        value.sellingPrice == sellingPrice
      ) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "SKU is already Exist", classes: "text-light" });
      return;
    }
    setProduct({
      ...product,
      priceVariants: [...product.priceVariants, { mrp, weight, sellingPrice }],
    });
    setMRP("");
    setWeight("");
    setSellingPrice("");
  }; // Add Time Handler

  const deletePriceVariantsHandler = (i) => {
    const filtered = product.priceVariants.filter((value, index) => index != i);

    setProduct({ ...product, priceVariants: [...filtered] });
  };

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
        <Breadcrumb title={"PRODUCTS"} pageTitle={"Add Product"} />

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
                    PRODUCT NAME !
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={titleChangeHandler}
                    className="form-control"
                    placeholder={"Big Rectangle Cake"}
                  />
                </div>

                {/* Product Slug */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SLUG !
                  </label>
                  <input
                    type="text"
                    value={product.slug}
                    onChange={(evt) =>
                      setProduct({ ...product, slug: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"big-rectangle-cake"}
                  />
                </div>

                {/* Product Sku */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SKU !
                  </label>
                  <input
                    type="text"
                    value={product.sku}
                    onChange={(evt) =>
                      setProduct({ ...product, sku: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"CPXY1234"}
                  />
                </div>

                {/* MAXIMUM ORDER QUANTITY */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MAXIMUM ORDER QUANTITY !
                  </label>
                  <input
                    type="text"
                    value={product.maximumOrderQuantity}
                    onChange={(evt) =>
                      setProduct({
                        ...product,
                        maximumOrderQuantity: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"2"}
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
                    SELECTED PARENT CATEGORY!
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
                    SUB CATEGORY HERE !
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

                {/* Flavour */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT FLAVOUR !
                  </label>

                  <Select
                    options={flavour}
                    onChange={(evt) => {
                      setSelectFlavour(evt.value);
                    }}
                  />
                </div>

                {/* Flavour */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT CAKE TYPES !
                  </label>

                  <Select
                    options={types}
                    onChange={(evt) => {
                      setSelectType(evt.value);
                    }}
                  />
                </div>

                {/* Color */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    COLOR HERE !
                  </label>

                  <Select
                    options={color}
                    onChange={(evt) => {
                      setSelectColor(evt.value);
                    }}
                  />
                </div> */}

                {/* Cake Shape */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT CAKE SHAPE !
                  </label>

                  <div className="">
                    <Select
                      options={shapes}
                      onChange={(evt) => {
                        setProduct({ ...product, shape: evt.value });
                      }}
                    />
                  </div>
                </div>

                {/* Is Egg Cake*/}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    EGG CAKE
                  </label>
                  <div className="d-flex my-3">
                    <div className="custom-control custom-radio pl-0 ml-0">
                      <input
                        type="radio"
                        id="cakeType1"
                        name="eggCake"
                        // checked={!product.isEggCake ? true : false}
                        value={true}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isEggCake: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType1">
                        YES
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="cakeType2"
                        name="eggCake"
                        // checked={!product.isEggCake ? true : false}
                        value={false}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isEggCake: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType2">
                        NO
                      </label>
                    </div>
                  </div>
                </div>

                {/* Is Photo Cake*/}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PHOTO CAKE
                  </label>
                  <div className="d-flex my-3">
                    <div className="custom-control custom-radio pl-0 ml-0">
                      <input
                        type="radio"
                        id="cakeType3"
                        name="photoCake"
                        value={true}
                        // checked={!product.isPhotoCake ? true : false}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isPhotoCake: evt.target.value,
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
                        name="photoCake"
                        // checked={!product.isPhotoCake ? true : false}
                        value={false}
                        onChange={(evt) => {
                          setProduct({
                            ...product,
                            isPhotoCake: evt.target.value,
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
              </div>

              {/* priceVariants */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT PRICE DETAILS</h3>
                </div>
                {/* Weight */}
                <div className={"form-group col-md-4"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CAKE WEIGHT
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setWeight(evt.target.value)}
                    name="weight"
                    value={weight}
                    className="form-control"
                    placeholder={"1/2 kg"}
                  />
                </div>

                {/* MRP */}
                <div className={"form-group col-md-3"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CAKE MRP
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setMRP(evt.target.value)}
                    name="mrp"
                    value={mrp}
                    className="form-control"
                    placeholder={"700"}
                  />
                </div>

                {/* Selling Price */}
                <div className={"form-group col-md-3"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELLING PRICE
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setSellingPrice(evt.target.value)}
                    name="sellingPrice"
                    value={sellingPrice}
                    className="form-control"
                    placeholder={"599"}
                  />
                </div>
                <div className={"form-group col-md-2"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"button"}
                    onClick={addPriceVariantsHandler}
                  >
                    <div>
                      <i className="fas fa-plus"></i> Add
                    </div>
                  </button>
                </div>

                <div className="col-md-11">
                  {product.priceVariants.map((value, index) => {
                    return (
                      <div className="card m-0 mb-1">
                        <div className="card-body px-2 py-2 d-flex justify-content-between">
                          <h6>Cake Weight: {value.weight} </h6>
                          <h6>Cake MRP: {value.mrp} </h6>
                          <h6>Cake Selling Price: {value.sellingPrice} </h6>
                          <button
                            type="button"
                            className="btn btn-danger px-2 py-0 m-0"
                            onClick={() => deletePriceVariantsHandler(index)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PRODUCT DESCRIPTION */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT DESCRIPTION</h3>
                </div>

                {/* SHORT DESCRIPTION */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SHORT DESCRIPTION
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setProduct({
                        ...product,
                        shortDescription: evt.target.value,
                      })
                    }
                    name="weight"
                    value={product.shortDescription}
                    className="form-control"
                    placeholder={"Write Short Descriptions"}
                  />
                </div>

                {/* PRODUCT TAGS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT TAGS
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setProduct({
                        ...product,
                        tags: evt.target.value,
                      })
                    }
                    name="weight"
                    value={product.tags}
                    className="form-control"
                    placeholder={"Snack, Organic, Brown"}
                  />
                </div>

                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LONG DESCTRIPTION
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    style={{ height: "100px" }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setProduct({ ...product, description: data });
                    }}
                    data={product.description}
                  />
                </div>
              </div>

              {/* PRODUCT IMAGES */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT IMAGES</h3>
                </div>

                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT DEFAULT IMAGE
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
                    <div className={"form-group"}>
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
                          right: "45%",
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

                {/* Products Multiple Images */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT IMAGES
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={imageChangeHandler}
                    className="form-control"
                  />
                </div>

                {/*Multiple Image Preview */}
                <div className="col-md-12 mb-1">
                  <div className="row">
                    {previewImages.map((img, index) => {
                      return (
                        <div className={"form-group col-md-3"} key={index}>
                          <img
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              border: "1px solid #5a5a5a",
                            }}
                            src={img}
                          />
                          <button
                            style={{
                              position: "absolute",
                              top: "40%",
                              right: "45%",
                            }}
                            type="button"
                            className="btn bg-light text-danger"
                            title={"Delete Image"}
                            onClick={(evt) => fileDeleteHandler(img, index)}
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Multiple image prpgress */}
                <div className="col-md-12 mb-2">
                  <div className="row">
                    {progressInfos.map((info, index) => {
                      return (
                        <div className="col-md-3" key={index}>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${info}%` }}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {info}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Product
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

export default AddProduct;
