import React from "react";
import Papa from "papaparse";
import { useState } from "react";
import Config from "../../../config/Config";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import tableToCSV from "../../helpers";
import Breadcrumb from "../../components/Breadcrumb";

const EditProductFromCSV = () => {
  const history = useHistory();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [isAllRecordLoaded, setIsAllRecordLoaded] = useState(true);

  const fileChangeHandler = (event) => {
    const files = event.target.files;
    if (files) {
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
            if (item.id != "") {
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

              if (item.images) {
                item.images = item.images.split("__").map((img) => {
                  return { url: img };
                });
              }

              item.isEggCake = item.isEggCake.toLowerCase();
              item.isPhotoCake = item.isPhotoCake.toLowerCase();
              item.status = item.status.toLowerCase();

              submitHandler(item);
            }
          });
        },
      });
    }
  };

  // Update Submit Handler
  const submitHandler = (data) => {
    const updateData = {
      name: data.name,
      slug: data.slug,
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
      type: data.type,
      status: data.status,
    };
    fetch(`${Config.SERVER_URL}/product/${data.id}`, {
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
    table.setAttribute("id", "download-csv");
    let thead = makeElement("thead");
    table.appendChild(thead);

    let row = makeElement("tr");
    makeElement("th", "id", row);
    makeElement("th", "name", row);
    makeElement("th", "sku", row);

    // for price
    // makeElement("th", "mrp", row);
    // makeElement("th", "sellingPrice", row);
    // makeElement("th", "weight", row);

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
    makeElement("th", "status", row);

    thead.appendChild(row);
    // Load Data from the Database
    setIsAllRecordLoaded(false);
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=0&status=All`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllRecordLoaded(true);
          if (result.status === 200) {
            console.log(result.body);

            result.body.map((item, index) => {
              const parentCategories = item.parentCategories
                .map((item) => {
                  return item._id;
                })
                .join("__");

              let images = "";
              if (item.images) {
                images = item.images
                  .map((img) => {
                    return img.url;
                  })
                  .join("__");
              }

              let dataRow = document.createElement("tr");
              makeElement("td", item._id.toString(), dataRow); //id
              makeElement("td", item.name, dataRow); // name
              makeElement("td", item.sku, dataRow); // sku
              makeElement("td", item.tags.replaceAll(",", "__"), dataRow); // tags
              makeElement("td", item.maximumOrderQuantity, dataRow); // maximum Order Quantity
              makeElement("td", item.flavour._id, dataRow); // flavour
              makeElement("td", item.shape._id, dataRow); // flavour
              makeElement("td", item.isEggCake.toString(), dataRow); // flavour
              makeElement("td", item.isPhotoCake.toString(), dataRow); // flavour
              makeElement("td", parentCategories, dataRow); // parent categories
              makeElement("td", item.defaultImage, dataRow); // default image
              makeElement("td", images, dataRow); // images
              makeElement(
                "td",
                item.shortDescription.replaceAll(",", "__"),
                dataRow
              ); // shortDescription

              makeElement("td", item.type._id, dataRow); // type
              makeElement("td", item.status.toString(), dataRow); //

              thead.appendChild(dataRow);
            });
            tableToCSV("products.csv", table);
            // setAllRecords(result.body || []);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllRecordLoaded(true);
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}

        <Breadcrumb title={"PRODUCTS"} pageTitle={"Update Product"} />

        {/* Add Color Form */}
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
                      {isAllRecordLoaded ? (
                        <span>
                          <i className="fa fa-download"></i> Download CSV Format
                        </span>
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

                {/* File */}
                <div className={"form-group col-md-6"}>
                  <input
                    type="file"
                    onChange={fileChangeHandler}
                    className="form-control"
                    placeholder={"Range Name"}
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
                    <div className="card card-body">
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

export default EditProductFromCSV;
