import React from "react";
import { API } from "../../backend";

export const getProducts = () => {
  return fetch(`${API}/products/allproducts`, { method: "GET" })
    .then((response) => {
      if (response?.error) {
        console.log(response?.error);
      }
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
