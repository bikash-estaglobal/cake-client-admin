import React, {
  Fragment,
  createContext,
  useReducer,
  useContext,
  useEffect,
} from "react";
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
import { initialState, branchReducer } from "../../reducer/branchReducer";
import Profile from "./pages/Profile";
import PageNoteFound from "./pages/PageNotFound";

import ParentCategory from "./pages/ParentCategory";
import Category from "./pages/Category";

// ================   Products  =====================
import AddProduct from "./pages/products/AddProduct";
import ProductList from "./pages/products/ProductList";

// ================   Coupons  =====================
import AddCoupon from "./pages/coupons/AddCoupon";
import CouponList from "./pages/coupons/CouponList";
import EditCoupon from "./pages/coupons/EditCoupon";
import ShippingMethodList from "./pages/shippingMethod/ShippingMethodList";
import AddShippingMethod from "./pages/shippingMethod/AddShippingMethod";
import EditShippingMethod from "./pages/shippingMethod/EditShippingMethod";
import FlavourList from "./pages/flavours/FlavourList";
import AddFlavour from "./pages/flavours/AddFlavour";
import EditFlavour from "./pages/flavours/EditFlavour";
import ColorList from "./pages/colors/ColorList";
import AddColor from "./pages/colors/AddColor";
import EditColor from "./pages/colors/EditColor";
import EditProduct from "./pages/products/EditProduct";
import AdonProductList from "./pages/adonProducts/AdonProductList";
import EditAdonProduct from "./pages/adonProducts/EditAdonProduct";
import AddAdonProduct from "./pages/adonProducts/AddAdonProduct";
import DealsList from "./pages/deals/DealsList";
import AddDeals from "./pages/deals/AddDeals";
import EditDeals from "./pages/deals/EditDeals";
import PincodeList from "./pages/pincode/PincodeList";
import AddPincode from "./pages/pincode/AddPincode";
import EditPincode from "./pages/pincode/EditPincode";
import ShapeList from "./pages/shapes/ShapeList";
import AddShape from "./pages/shapes/AddShape";
import EditShape from "./pages/shapes/EditShape";
import NewOrders from "./pages/orders/NewOrders";
import CustomerList from "./pages/customers/CustomerList";
import ViewOrder from "./pages/orders/ViewOrder";
import OrderList from "./pages/orders/OrderList";
import Setting from "./pages/setting/Setting";
import MainSlider from "./pages/banners/MainSlider";
import NextToSlider from "./pages/banners/NextToSlider";
import DailyBestSaleBanner from "./pages/banners/DailyBestSaleBanner";
import CategoryPageBanner from "./pages/banners/CategoryPageBanner";
import OfferBanner from "./pages/banners/OfferBanner";
import ParentCategoryList from "./pages/parentCategory/ParentCategoryList";
import AddParentCategory from "./pages/parentCategory/AddParentCategory";
import EditParentCategory from "./pages/parentCategory/EditParentCategory";
import SubCategoryList from "./pages/subCategory/SubCategoryList";
import AddCouponFromCSV from "./pages/coupons/AddCouponFromCSV";
import EditCouponFromCSV from "./pages/coupons/EditCouponFromCSV";
import AddFlaourFromCSV from "./pages/flavours/AddFlavourFromCSV";
import EditFlavourFromCSV from "./pages/flavours/EditFlavourFomCSV";
import AddShapeFromCSV from "./pages/shapes/AddShapeFromCSV";
import EditShapeFromCSV from "./pages/shapes/EditShapeFromCSV";
import AddColorFromCSV from "./pages/colors/AddColorFromCSV";
import EditColorFromCSV from "./pages/colors/EditColorFromCSV";
import EditPincodeFromCSV from "./pages/pincode/EditPincodeFromCSV";
import AddPincodeFromCSV from "./pages/pincode/AddPincodeFromCSV";
import AddParentCategoryFromCSV from "./pages/parentCategory/AddParentCategoryFromCSV";
import EditParentCategoryFromCSV from "./pages/parentCategory/EditParenrtCategortyFromCSV";
import AddAdonProductFromCSV from "./pages/adonProducts/AddAdonProductFromCSV";
import EditAdonProductFromCSV from "./pages/adonProducts/EditAdonProductFromCSV";
import CustomerReports from "./pages/reports/CustomerReports";
import ProductReports from "./pages/reports/ProductReports";
import EditCustomer from "./pages/customers/EditCustomer";
import ViewCustomer from "./pages/customers/ViewCustomer";
import AddSubCategory from "./pages/subCategory/AddSubCategory";
import EditSubCategory from "./pages/subCategory/EditSubCategory";
import AddSubCategoryFromCSV from "./pages/subCategory/AddSubCategoryFromCSV";
import EditSubCategoryFromCSV from "./pages/subCategory/EditSubCategoryFromCSV";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";
import TypeList from "./pages/types/TypeList";
import AddType from "./pages/types/AddType";
import EditType from "./pages/types/EditType";
import AddTypeFromCSV from "./pages/types/AddTypeFromCSV";
import EditTypeFromCSV from "./pages/types/EditTypeFromCSV";
import NewsletterList from "./pages/newsletters/NewsletterList";
import AddNewsletter from "./pages/newsletters/AddNewsletter";
import EditNewsletter from "./pages/newsletters/EditNewsletter";
import AddNewsletterFromCSV from "./pages/newsletters/AddNewsletterFromCSV";
import EditNewsletterFromCSV from "./pages/newsletters/EditNewsletterFromCSV";
import AddProductFromCSV from "./pages/products/AddProductFromCSV";
import EditProductFromCSV from "./pages/products/EditProductFromCSV";
import VendorList from "./pages/vendors/VendorList";
import AddVendor from "./pages/vendors/AddVendors";
import EditVendor from "./pages/vendors/EditVendor";
import VendorDashboard from "./pages/vendors/VendorDashboard";
import Footer from "./Footer";
import CategoryNavigationBanner from "./pages/banners/CategoryNavigationBanner";
import InquiryList from "./pages/inquiries/InquiryList";
import AddInquiry from "./pages/inquiries/AddInquiry";
import EditInquiry from "./pages/inquiries/EditInquiry";
import AddInquiryFromCSV from "./pages/inquiries/AddInquiryFromCSV";
import EditInquiryFromCSV from "./pages/inquiries/EditInquiryFromCSV";

// Create Context
export const BranchContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(BranchContext);
  useEffect(() => {
    const branch = JSON.parse(localStorage.getItem("branch"));
    if (branch) {
      dispatch({ type: "BRANCH", payload: branch });
      // history.push("/")
    } else {
      history.push("/branch/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/branch" component={Dashboard} />
      <Route exact path="/branch/login" component={Login} />
      <Route exact path="/branch/profile" component={Profile} />
      <Route exact path="/branch/forgot-password" component={ForgotPassword} />
      <Route exact path="/branch/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/branch/create-password"
        component={CreateNewPassword}
      />

      {/* Parent Category */}
      <Route
        exact
        path="/branch/parentCategories"
        component={ParentCategoryList}
      />
      <Route
        exact
        path="/branch/parentCategory/add"
        component={AddParentCategory}
      />
      <Route
        exact
        path="/branch/parentCategory/addByCSV"
        component={AddParentCategoryFromCSV}
      />
      <Route
        exact
        path="/branch/parentCategory/editByCSV"
        component={EditParentCategoryFromCSV}
      />
      <Route
        exact
        path="/branch/parentCategory/edit/:id"
        component={EditParentCategory}
      />

      <Route exact path="/branch/parentCategory" component={ParentCategory} />

      {/* Sub Category */}

      <Route exact path="/branch/category" component={Category} />
      <Route exact path="/branch/categories" component={SubCategoryList} />
      <Route exact path="/branch/categories/add" component={AddSubCategory} />
      <Route
        exact
        path="/branch/categories/edit/:id"
        component={EditSubCategory}
      />
      <Route
        exact
        path="/branch/categories/addByCSV"
        component={AddSubCategoryFromCSV}
      />
      <Route
        exact
        path="/branch/categories/editByCSV"
        component={EditSubCategoryFromCSV}
      />

      {/* Products */}
      <Route exact path="/branch/products" component={ProductList} />
      <Route exact path="/branch/product/add" component={AddProduct} />
      <Route
        exact
        path="/branch/product/addByCSV"
        component={AddProductFromCSV}
      />
      <Route exact path="/branch/product/edit/:id" component={EditProduct} />
      <Route
        exact
        path="/branch/product/editByCSV"
        component={EditProductFromCSV}
      />

      {/* Adon Products */}
      <Route exact path="/branch/adonProducts" component={AdonProductList} />
      <Route exact path="/branch/adonProduct/add" component={AddAdonProduct} />
      <Route
        exact
        path="/branch/adonProduct/addByCSV"
        component={AddAdonProductFromCSV}
      />
      <Route
        exact
        path="/branch/adonProduct/editByCSV"
        component={EditAdonProductFromCSV}
      />

      <Route
        exact
        path="/branch/adonProduct/edit/:id"
        component={EditAdonProduct}
      />

      {/* Coupons */}
      <Route exact path="/branch/coupons" component={CouponList} />
      <Route exact path="/branch/coupon/add" component={AddCoupon} />
      <Route
        exact
        path="/branch/coupon/addByCSV"
        component={AddCouponFromCSV}
      />
      <Route
        exact
        path="/branch/coupon/editByCSV"
        component={EditCouponFromCSV}
      />
      <Route exact path="/branch/coupon/edit/:id" component={EditCoupon} />

      {/* Vendors */}
      <Route exact path="/branch/vendors" component={VendorList} />
      <Route exact path="/branch/vendor/add" component={AddVendor} />
      <Route exact path="/branch/vendor/edit/:id" component={EditVendor} />
      <Route
        exact
        path="/branch/vendor/dashboard/:id"
        component={VendorDashboard}
      />

      {/* Deals */}
      <Route exact path="/branch/deals" component={DealsList} />
      <Route exact path="/branch/deals/add" component={AddDeals} />
      <Route exact path="/branch/deals/edit/:id" component={EditDeals} />

      {/* Shipping Method */}
      <Route
        exact
        path="/branch/shippingMethods"
        component={ShippingMethodList}
      />
      <Route
        exact
        path="/branch/shippingMethod/add"
        component={AddShippingMethod}
      />
      <Route
        exact
        path="/branch/shippingMethod/edit/:id"
        component={EditShippingMethod}
      />
      {/* Flavour */}
      <Route exact path="/branch/flavours" component={FlavourList} />
      <Route exact path="/branch/flavour/add" component={AddFlavour} />
      <Route
        exact
        path="/branch/flavour/addByCSV"
        component={AddFlaourFromCSV}
      />
      <Route
        exact
        path="/branch/flavour/editByCSV"
        component={EditFlavourFromCSV}
      />
      <Route exact path="/branch/flavour/edit/:id" component={EditFlavour} />

      {/* Shape */}
      <Route exact path="/branch/shapes" component={ShapeList} />
      <Route exact path="/branch/shape/add" component={AddShape} />
      <Route exact path="/branch/shape/addByCSV" component={AddShapeFromCSV} />
      <Route
        exact
        path="/branch/shape/editByCSV"
        component={EditShapeFromCSV}
      />
      <Route exact path="/branch/shape/edit/:id" component={EditShape} />

      {/* Types */}
      <Route exact path="/branch/types" component={TypeList} />
      <Route exact path="/branch/type/add" component={AddType} />
      <Route exact path="/branch/type/addByCSV" component={AddTypeFromCSV} />
      <Route exact path="/branch/type/editByCSV" component={EditTypeFromCSV} />
      <Route exact path="/branch/type/edit/:id" component={EditType} />

      {/* Pincode */}
      <Route exact path="/branch/pincodes" component={PincodeList} />
      <Route exact path="/branch/pincode/add" component={AddPincode} />
      <Route
        exact
        path="/branch/pincode/addByCSV"
        component={AddPincodeFromCSV}
      />
      <Route
        exact
        path="/branch/pincode/editByCSV"
        component={EditPincodeFromCSV}
      />
      <Route exact path="/branch/pincode/edit/:id" component={EditPincode} />

      {/* Colors */}
      <Route exact path="/branch/colors" component={ColorList} />
      <Route exact path="/branch/color/addByCSV" component={AddColorFromCSV} />
      <Route
        exact
        path="/branch/color/editByCSV"
        component={EditColorFromCSV}
      />
      <Route exact path="/branch/color/add" component={AddColor} />
      <Route exact path="/branch/color/edit/:id" component={EditColor} />

      {/* Orders */}
      <Route exact path="/branch/newOrders" component={NewOrders} />
      <Route exact path="/branch/order/show/:id" component={ViewOrder} />
      <Route exact path="/branch/orders" component={OrderList} />

      {/* Reports */}
      <Route
        exact
        path="/branch/report/customers"
        component={CustomerReports}
      />

      <Route exact path="/branch/report/products" component={ProductReports} />

      {/* Customer */}
      <Route exact path="/branch/customers" component={CustomerList} />
      <Route exact path="/branch/customer/edit/:id" component={EditCustomer} />
      <Route exact path="/branch/customer/show/:id" component={ViewCustomer} />

      {/* Newsletter */}
      <Route exact path="/branch/newsletters" component={NewsletterList} />
      <Route exact path="/branch/newsletter/add" component={AddNewsletter} />
      <Route
        exact
        path="/branch/newsletter/addByCSV"
        component={AddNewsletterFromCSV}
      />
      <Route
        exact
        path="/branch/newsletter/editByCSV"
        component={EditNewsletterFromCSV}
      />
      <Route
        exact
        path="/branch/newsletter/edit/:id"
        component={EditNewsletter}
      />

      {/* Inquiries */}
      <Route exact path="/branch/inquiries" component={InquiryList} />
      <Route exact path="/branch/inquiry/add" component={AddInquiry} />
      <Route
        exact
        path="/branch/inquiry/addByCSV"
        component={AddInquiryFromCSV}
      />
      <Route
        exact
        path="/branch/inquiry/editByCSV"
        component={EditInquiryFromCSV}
      />
      <Route exact path="/branch/inquiry/edit/:id" component={EditInquiry} />

      {/* Settings */}
      <Route exact path="/branch/setting" component={Setting} />

      {/* Images */}
      <Route exact path="/branch/slider" component={MainSlider} />
      <Route exact path="/branch/nextToSlider" component={NextToSlider} />
      <Route
        exact
        path="/branch/bestSaleBanner"
        component={DailyBestSaleBanner}
      />
      <Route
        exact
        path="/branch/categoryPageBanner"
        component={CategoryPageBanner}
      />
      <Route exact path="/branch/offerBanner" component={OfferBanner} />
      <Route
        exact
        path="/branch/categoryNavigationBanner"
        component={CategoryNavigationBanner}
      />

      {/* Page Not Found */}
      <Route exact path="/*" component={PageNoteFound} />
    </Switch>
  );
};

const Branch = () => {
  const [state, dispatch] = useReducer(branchReducer, initialState);
  return (
    <div id="main-wrapper">
      <BranchContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
          <Footer />
        </Router>
      </BranchContext.Provider>
    </div>
  );
};

export default Branch;
