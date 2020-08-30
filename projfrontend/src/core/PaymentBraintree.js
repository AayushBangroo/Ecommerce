import React, { useState, useEffect } from "react";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { getTokenFromBackend, processPayment } from "./helper/paymentHelper";
import { Link } from "react-router-dom";
import { loadCart, cartEmpty } from "./helper/CartHelper";
import DropIn from "braintree-web-drop-in-react";

const Payment = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getToken = (userId, token) => {
    getTokenFromBackend(userId, token).then((info) => {
      console.log("INFORMATION", info);
      if (info?.error) {
        setInfo({ ...info, error: info?.error });
      } else {
        const clientToken = info?.clientToken;
        setInfo({ clientToken });
        console.log(products);
      }
    });
  };

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };

      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCCESSFUL");

          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };

          createOrder(userId, token, orderData);

          setReload(!reload);
        })
        .catch((err) => {
          setInfo({ ...info, success: false, loading: false, error: err });
          console.log("PAYMENT UNSUCCESSFUL");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount += product.price;
    });
    return amount;
  };

  const loadDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please login or add products to cart</h3>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3>Bill Amount: {getAmount()}</h3>
      {loadDropIn()}
    </div>
  );
};

export default Payment;
