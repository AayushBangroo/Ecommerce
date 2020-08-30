import React, { useState } from "react";
import ImageHelper from "./helper/ImageHelper";
import { getProducts } from "./helper/coreapicalls";
import { Redirect } from "react-router";
import { addItemToCart, removeItemFromCart } from "./helper/CartHelper";

const Card = ({
  product,
  addToCart = true,
  removeFromCart = false,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const cardDescription = product ? product.description : "Default Description";
  const cardPrice = product ? product.price : "Default Price";
  const cardName = product ? product.name : "Default Name";

  const getRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const addToCartItem = () => {
    addItemToCart(product, () => setRedirect(true));
  };

  const addToCartButton = (addToCart) => {
    return (
      addToCart && (
        <button
          onClick={addToCartItem}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const removeFromCartButton = (addToCart) => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload);
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardName}</div>
      <div className="card-body">
        {getRedirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          <div className="col-12">{addToCartButton(addToCart)}</div>
          <div className="col-12">{removeFromCartButton(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
