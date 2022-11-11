import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { initialState, vendorReducer } from "../../reducer/VendorReducer";
import Profile from "./pages/Profile";
import PageNoteFound from "./pages/PageNotFound";

import NewOrders from "./pages/orders/NewOrders";
import CustomerList from "./pages/customers/CustomerList";
import ViewOrder from "./pages/orders/ViewOrder";
import OrderList from "./pages/orders/OrderList";

// import CustomerReports from "./pages/reports/CustomerReports";
import ProductReports from "./pages/reports/ProductReports";
import EditCustomer from "./pages/customers/EditCustomer";
import ViewCustomer from "./pages/customers/ViewCustomer";

import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";

// Create Context
export const VendorContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Vendor Context
  const { state, dispatch } = useContext(VendorContext);
  useEffect(() => {
    const vendor = JSON.parse(localStorage.getItem("vendor"));
    if (vendor) {
      dispatch({ type: "VENDOR", payload: vendor });
      // history.push("/")
    } else {
      history.push("/vendor/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/vendor" component={Dashboard} />
      <Route exact path="/vendor/login" component={Login} />
      <Route exact path="/vendor/profile" component={Profile} />
      <Route exact path="/vendor/forgot-password" component={ForgotPassword} />
      <Route exact path="/vendor/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/vendor/create-password"
        component={CreateNewPassword}
      />

      {/* Orders */}
      <Route exact path="/vendor/newOrders" component={NewOrders} />
      <Route exact path="/vendor/order/show/:id" component={ViewOrder} />
      <Route exact path="/vendor/orders" component={OrderList} />

      {/* Reports */}
      {/* <Route
        exact
        path="/vendor/report/customers"
        component={CustomerReports}
      /> */}

      <Route exact path="/vendor/report/products" component={ProductReports} />

      {/* Customer */}
      <Route exact path="/vendor/customers" component={CustomerList} />
      <Route exact path="/vendor/customer/edit/:id" component={EditCustomer} />
      <Route exact path="/vendor/customer/show/:id" component={ViewCustomer} />

      {/* Page Not Found */}
      <Route exact path="/*" component={PageNoteFound} />
    </Switch>
  );
};

const Vendor = () => {
  const [state, dispatch] = useReducer(vendorReducer, initialState);
  return (
    <div id="main-wrapper">
      <VendorContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
        </Router>
      </VendorContext.Provider>
    </div>
  );
};

export default Vendor;
