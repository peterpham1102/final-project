import "./App.css";

import { React, createContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AdminPage from "./pages/Admin/AdminPage";
import { Box } from "@mui/system";
import BuyerPage from "./pages/Buyer/BuyerPage";
import { CircularProgress } from "@mui/material";
import LoginPage from "./pages/Login/LoginPage";
import SellerPage from "./pages/Seller/SellerPage";
import ShipperPage from "./pages/Shipper/ShipperPage";
import TestPage from "./TestPage";
import TestPage1 from "./TestPage1";
import api from "./shared/util/api";

export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const login = ({ email, token, role, userId, storeOwnedId }) => {
    localStorage.setItem("token", token);
    setUser({ email, role, userId, storeOwnedId });
  };
  const verifyAuth = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: "/users/verify",
        method: "GET",
      });
      if (res.success) {
        setUser(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      verifyAuth();
      
    }
    setFirstRender(false);
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("react-use-cart")
    setUser(null);
  };
  const authValue = {
    user,
    login,
    logout,
  };
  const PrivateRoute = ({ component: Component, authed, role,  ...rest }) => {
    if (!user) return <Redirect to="/" />;
    console.log("user: ", user);
    return (
      <Route
        {...rest}
        render={(props) =>
          authed.role === role ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: `/${authed.role}`,
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  };
  if (loading || firstRender)
    return (
      <div className="loading-icon">
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="success" />
        </Box>
      </div>
    );

  return (
    <AuthContext.Provider value={authValue}>
      <div className="App">
        <Switch>
          <PrivateRoute
            authed={user}
            role="admin"
            path="/admin"
            component={AdminPage}
          />
          <PrivateRoute
            authed={user}
            role="seller"
            path="/seller"
            component={SellerPage}
          />
          <PrivateRoute
            authed={user}
            role="buyer"
            path="/buyer"
            component={BuyerPage}
          />
          <PrivateRoute
            authed={user}
            role="shipper"
            path="/shipper"
            component={ShipperPage}
          />

          <Route path="/" exact>
            <LoginPage />
          </Route>
          <Route path="/test">
            <TestPage />
          </Route>
          <Route path="/test1">
            <TestPage1 />
          </Route>

          {/* <Route path="/" >
            <HomePage />
          </Route> */}
        </Switch>
      </div>
    </AuthContext.Provider>
  );

  // return (
  //   <BrowserRouter>
  //   <Switch>
  //     <Route path="/admin">
  //       <AdminPage />
  //     </Route>
  //     <Route path="/login">
  //       <LoginPage/>
  //     </Route>

  //   </Switch>
  //   </BrowserRouter>
  // )
};

export default App;
