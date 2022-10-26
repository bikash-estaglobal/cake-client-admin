import React from "react";
import Papa from "papaparse";
import { useState } from "react";
import Config from "../../../config/Config";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import tableToCSV from "../../helpers";
import Breadcrumb from "../../components/Breadcrumb";

const AddProductFromCSV = () => {
  const history = useHistory();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);

  const fileChangeHandler = (event) => {
    const files = event.target.files[0];
    if (files) {
      setUploadLoading(true);

      Papa.parse(event.target.files[0], {
        complete: async (results) => {
          let keys = results.data[0];
          // I want to remove some óíúáé, blan spaces, etc
          keys = results.data[0].map((v) =>
            v
              // .toLowerCase()
              .replace(/ /g, "_")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
          let values = results.data.slice(1);
          let objects = values.map((array) => {
            let object = {};
            keys.forEach((key, i) => (object[key] = array[i]));
            return object;
          });
          // Now I call to my API and everything goes ok

          // Get data from array and call the api
          objects.map((item, i) => {
            if (item.name) {
              if (item.parentCategories) {
                item.parentCategories = item.parentCategories.split("__");
              }

              item.slug = item.name
                .toLowerCase()
                .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
                .replace(/\s+/g, "-");

              // tags
              item.tags = item.tags.replaceAll("__", ",");
              item.shortDescription = item.shortDescription.replaceAll(
                "__",
                ","
              );

              // price
              item.priceVariants = [
                {
                  mrp: item.mrp,
                  sellingPrice: item.sellingPrice,
                  weight: item.weight,
                },
              ];

              if (item.images) {
                item.images = item.images.split("__").map((img) => {
                  return { url: img };
                });
              }

              item.isEggCake = item.isEggCake.toLowerCase();
              item.isPhotoCake = item.isPhotoCake.toLowerCase();

              submitHandler(item);
            }
            if (i == objects.length - 1) {
              setUploadLoading(false);
            }
          });
        },
      });
    }
  };

  const makeElement = (elemName, innerText = null, row = null) => {
    const elem = document.createElement(elemName);
    if (innerText) {
      elem.innerHTML = innerText;
    }
    if (row) {
      row.appendChild(elem);
    }
    return elem;
  };

  const downloadCSVHandler = () => {
    let table = makeElement("table");
    let thead = makeElement("thead");
    table.appendChild(thead);

    let row = makeElement("tr");
    makeElement("th", "name", row);
    makeElement("th", "sku", row);

    // for price
    makeElement("th", "mrp", row);
    makeElement("th", "sellingPrice", row);
    makeElement("th", "weight", row);

    makeElement("th", "tags", row);
    makeElement("th", "maximumOrderQuantity", row);
    makeElement("th", "flavour", row);
    makeElement("th", "shape", row);
    makeElement("th", "isEggCake", row);
    makeElement("th", "isPhotoCake", row);
    makeElement("th", "parentCategories", row);
    makeElement("th", "defaultImage", row);
    makeElement("th", "images", row);
    makeElement("th", "shortDescription", row);
    makeElement("th", "type", row);

    let dummyRow = makeElement("tr");
    makeElement("td", "Dummy Product", dummyRow); // name
    makeElement("td", "DUMPR011", dummyRow); // sku
    // price
    makeElement("td", "1000", dummyRow); // mrp
    makeElement("td", "850", dummyRow); // selling price
    makeElement("td", "500g", dummyRow); // weight

    makeElement("td", "Sweet Cake__Pan Cake", dummyRow); // tags
    makeElement("td", "3", dummyRow); // maximum order quantity
    makeElement("td", "632c39a12116425068dda665", dummyRow); // flavour
    makeElement("td", "632c3ac52116425068dda6b4", dummyRow); // shape
    makeElement("td", "FALSE", dummyRow); // egg cake
    makeElement("td", "FALSE", dummyRow); // photo cake
    makeElement(
      "td",
      "632c2adb2116425068dda48a__632c2b292116425068dda4bb",
      dummyRow
    ); // parent Categories
    makeElement(
      "td",
      "https://firebasestorage.googleapis.com/v0/b/perfect-app-5eef5.appspot.com/o/products%2Fproduct-1-1.jpg?alt=media&token=a8332ec5-b99a-4729-916a-baeffcadb06e",
      dummyRow
    ); // default image
    makeElement(
      "td",
      "https://firebasestorage.googleapis.com/v0/b/perfect-app-5eef5.appspot.com/o/products%2Fproduct-1-1.jpg?alt=media&token=a8332ec5-b99a-4729-916a-baeffcadb06e",
      dummyRow
    ); // images
    makeElement("td", "This is short description of this cake", dummyRow); // shortDescription
    makeElement("td", "632c6fa85fc2b2c022f1509b", dummyRow); // type

    thead.appendChild(row);
    thead.appendChild(dummyRow);

    tableToCSV("product.csv", table);
  };

  // Submit Handler
  const submitHandler = (data) => {
    const addData = {
      name: data.name,
      slug: data.slug,
      priceVariants: data.priceVariants,
      sku: data.sku,
      tags: data.tags,
      maximumOrderQuantity: data.maximumOrderQuantity,
      flavour: data.flavour,
      shape: data.shape,
      isEggCake: data.isEggCake,
      isPhotoCake: data.isPhotoCake,
      parentCategories: data.parentCategories,
      defaultImage: data.defaultImage,
      images: data.images,
      shortDescription: data.shortDescription,
      description: "",
      type: data.type,
    };

    fetch(Config.SERVER_URL + "/product", {
      method: "POST",
      body: JSON.stringify(addData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            // M.toast({ html: result.message, classes: "bg-success" });
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
          }
          setUploaded((old) => {
            return [
              ...old,
              {
                name: result.body.name || "",
                message: result.message || result.errors.message,
              },
            ];
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"PRODUCT"} pageTitle={"Add Product"} />

        {/* Add  Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              //   onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Color Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12 d-flex justify-content-between">
                  <h3 className={"my-3 text-info"}>Upload CSV File</h3>
                  <div className="">
                    <button
                      onClick={downloadCSVHandler}
                      className="btn btn-info"
                      type="button"
                    >
                      <i className="fa fa-download"></i> Download CSV Format
                    </button>
                  </div>
                </div>

                <div className={"form-group col-md-6"}>
                  <input
                    type="file"
                    onChange={fileChangeHandler}
                    className="form-control"
                    placeholder={"Chocolaty"}
                  />
                </div>
                <div className={"form-group col-md-6"}>
                  {uploadLoading ? (
                    <div className={"bg-white p-3 text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading..
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-11 mx-auto">
            <div className={"row shadow-sm bg-white py-3"}>
              <div className="col-md-12">
                {uploaded.map((item, index) => {
                  return (
                    <div className="card card-body" key={"item" + index}>
                      {" "}
                      {item.name} {item.message}{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductFromCSV;
