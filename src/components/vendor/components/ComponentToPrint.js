import React from "react";

const ComponentToPrint = React.forwardRef(({ order = {} }, ref) => {
  return (
    <div ref={ref} id={"print-container"}>
      <div class="container">
        <div className="row">
          <div className="col-md-12">
            <h4 id="heading">Shipping Details</h4>
            <hr />
          </div>
          {order?.personalize?.keepPrivate != true ? (
            <div className="col-md-12">
              <div className="pb-4">
                <h4>From</h4>
                <p>{order?.personalize?.senderName}</p>
                {order?.personalize?.message && (
                  <p>Message : {order.personalize.message}</p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="col-md-12 to">
            <div className="pb-4">
              <h4>To</h4>
              <hr />
              {order.shippingAddress ? (
                <div className="">
                  <table width="100%">
                    <tr>
                      <td>{order.shippingAddress?.name || "N/A"}</td>
                      <td>
                        {" "}
                        <b>Order Id :</b> {order._id}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {order.shippingAddress?.mobile || "N/A"},{" "}
                        {order.shippingAddress?.alternateMobile || "N/A"}
                      </td>
                      <td colSpan={"2"}></td>
                    </tr>
                    <tr>
                      <td>{order.shippingAddress?.address || "N/A"} </td>
                      <td colSpan={"2"}></td>
                    </tr>
                    <tr>
                      <td>{order.shippingAddress?.landmark || "N/A"} </td>
                      <td colSpan={"2"}></td>
                    </tr>
                    <tr>
                      <td>
                        {order.shippingAddress?.city || "N/A"},{" "}
                        {order.shippingAddress?.pincode || "N/A"}{" "}
                      </td>
                      <td colSpan={"2"}></td>
                    </tr>
                    <tr>
                      <td> {order.shippingAddress?.addressType || "N/A"} </td>
                      <td colSpan={"2"}></td>
                    </tr>
                  </table>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentToPrint;
