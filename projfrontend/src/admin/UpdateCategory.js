import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { getAllCategories, UpdateCategoryCall,getCategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateCategory = ({ match }) => {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    getRedirect: false,
    formData: "",
    updatedCategory: false,
    error: "",
  });

  const { name, getRedirect, formData, updatedCategory, error } = values;

  const preload = (categoryId) => {
    getCategory(categoryId).then(data=>{
      if (data?.error) {
        setValues({ ...values, error: data?.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          loading: false,
          getRedirect: false,
          formData: new FormData(),
        });
      }
    })
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      error: "",
      updatedCategory: false
    });
    console.log(formData);
    UpdateCategoryCall(match.params.categoryId, user._id, token, formData).then(
      (data) => {
        if (data?.error) {
          setValues({ ...values, error: data?.error });
        } else {
          setValues({
            ...values,
            name: "",
            updatedCategory: true,
            error: "",
          });
          //console.log("DATA:",data);
          setTimeout(() => setValues({ getRedirect: true }), 1000);
        }
      }
    );
  };
  const handleChange = (name) => (event) => {
    const value = event.target.value;
    formData.set(name, value);
    //console.log(value);
    //console.log(formData);
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: updatedCategory ? "" : "none" }}
    >
      <h3>Category updated successfully</h3>
    </div>
  );

  const errorMessage = () => (
    <div
      className="alert alert-danger mt-3"
      style={{ display: error ? "" : "none" }}
    >
      <h3>Error in updating the category</h3>
    </div>
  );

  const RedirectHome = () => {
    if (getRedirect) {
      return <Redirect to="/admin/dashboard"></Redirect>;
    }
    return null;
  };

  const updateCategoryForm = () => (
    <form>
      <div className="form-group mt-3">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-4"
      >
        Update Category
      </button>
    </form>
  );
  return (
    <Base
      title="Update Category"
      description="This is category updation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-dark btn-md mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {RedirectHome()}
          {updateCategoryForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
