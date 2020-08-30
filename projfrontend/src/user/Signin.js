import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, isAuthenticated, authenticate } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    errors: "",
    loading: false,
    isRedirected: false,
  });

  const { email, errors, password, loading, isRedirected } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, errors: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, errors: false, loading: true });
    signin({ email, password })
      .then((data) => {
        //data comes from the DB
        if (data?.errors) {
          setValues({
            ...values,
            errors: data?.errors,
            loading: false,
          });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              isRedirected: true,
            });
          });
        }
      })
      .catch((err) => console.log("Signin attempt failed-react"));
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: errors ? "" : "none" }}
          >
            {errors}
          </div>
        </div>
      </div>
    );
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const performRedirect = () => {
    if (isRedirected) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }

    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const SigninForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={handleChange("email")}
              />
            </div>

            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={handleChange("password")}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-block"
              onClick={onSubmit}
            >
              submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="signin" description="Signin description">
      {errorMessage()}
      {/* {loadingMessage()} */}
      {SigninForm()}
      {performRedirect()}
      <p className="text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signin;
