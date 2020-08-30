import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#fff" };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-item">
        <Link to="/" className="nav-link" style={currentTab(history, "/")}>
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link
          to="/cart"
          className="nav-link"
          style={currentTab(history, "/cart")}
        >
          Cart
        </Link>
      </li>

      {isAuthenticated() && isAuthenticated().user.role===0 && (
        <li className="nav-item">
        <Link
          to="/user/dashboard"
          className="nav-link"
          style={currentTab(history, "/user/dashboard")}
        >
          U.Dashboard
        </Link>
      </li>
      )}

      {isAuthenticated() && isAuthenticated().user.role==1 && (
        <li className="nav-item">
        <Link
          to="/admin/dashboard"
          className="nav-link"
          style={currentTab(history, "/admin/dashboard")}
        >
          A.Dashboard
        </Link>
      </li>
      )}
      

      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link
              to="/signup"
              className="nav-link"
              style={currentTab(history, "/signup")}
            >
              SignUp
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/signin"
              className="nav-link"
              style={currentTab(history, "/signin")}
            >
              SignIn
            </Link>
          </li>
        </Fragment>
      )}
      
      {isAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link text-warning"
            onClick={() => {
              {
                signout(() => {
                  history.push("/");
                });
              }
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
