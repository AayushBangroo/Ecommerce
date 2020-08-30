import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data?.error) {
        console.log("FAILED TO LOAD PRODUCTS");
      }
      setProducts(data);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <Base title="Home Page" description="This is homepage">
      <h3>All Tshirts</h3>
      <div className="row text-center">
        {products.map((product, index) => {
          return (
            <div key={index} className="col-4 mb-4">
              <Card product={product} />
            </div>
          );
        })}
      </div>
    </Base>
  );
};

export default Home;
