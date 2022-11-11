import React from "react";
import "./App.css";

// import User from './components/user/User'
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useParams,
} from "react-router-dom";

// import leftNavigation from './components/user/LeftNavigation'
import Admin from "./components/admin/Admin";
import Branch from "./components/branch/Branch";
import Vendor from "./components/vendor/Vendor";
import Website from "./components/web/Website";
import Student from "./components/student/Student";
import Staff from "./components/staff/StaffRoutes";

function App(props) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/admin"} component={Admin} />
        <Route path={"/branch"} component={Branch} />
        <Route path={"/vendor"} component={Vendor} />
        <Route path={"/student"} component={Student} />
        <Route path={"/staff"} component={Staff} />
        <Route path={"/"} component={Website} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
