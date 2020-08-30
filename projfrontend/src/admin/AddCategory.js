import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const handleChange=(event)=>{
    setError("");
    setName(event.target.value);
  }

  const onSubmit=(event)=>{
    event.preventDefault();
    setSuccess(false);

    //backend request for creating category
    createCategory(user._id,token,{name})
    .then(data=>{
      if(data?.error){
        setError(true)
      }
      else{
        setError("");
        setSuccess(true);
        setName("");
      }
    })
  }

  const successMessage=()=>{
    if(success){
      return(
        <h1 className="text-success">Successfully created category</h1>
      );
    }
  }

  const errorMessage=()=>{
    if(error){
      return(
        <h1 className="text-warning">Error in creating category</h1>
      );
    }
  }

  const goBack=()=>{
      return(
          <div className="mt-5">
              <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
          </div>
      );
  }
  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter Category</p>
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            placeholder="For Ex.Summer"
            onChange={handleChange}
            value={name}
          />
          <button className="btn btn-outline-info" onClick={onSubmit}>Create Category</button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create category here"
      description="Add a new category for new t-shirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
