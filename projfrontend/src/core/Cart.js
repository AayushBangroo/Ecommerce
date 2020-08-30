import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import Payment from "./PaymentBraintree";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadCartItems = (products) => {
    //console.log(products[0]);
    return (
      <div className="text-center">
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            addToCart={false}
            removeFromCart={true}
            setReload={setReload}
            reload={reload}
          ></Card>
        ))}
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="This is cartpage">
      <div className="row">
        <div className="col-6">
          {products.length > 0 ? (
            loadCartItems(products)
          ) : (
            <h3>Cart is empty</h3>
          )}
        </div>
        <div className="col-6">
          <Payment products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
