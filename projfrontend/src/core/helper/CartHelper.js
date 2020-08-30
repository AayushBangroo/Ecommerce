export const addItemToCart = (item, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart")); //convert JSON string to JS object
    }
    cart.push({
      ...item,
      count: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart)); //convert JSON obj to JSON string
    next();
  }
};

export const loadCart = (item, next) => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")); //convert JSON string to JS object
    }
  }
};

export const removeItemFromCart = (productId) => {
  let cart = [];
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart")); //convert JSON string to JS object
  }

  cart.map((product, index) => {
    if (product._id == productId) {
      cart.splice(index, 1);
    }
  });

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const cartEmpty = (next) => {
  if (typeof window != undefined) {
    localStorage.removeItem("cart"); //remove the item from cart after successful payment
  }
  let cart=[];
  localStorage.setItem("cart", JSON.stringify(cart));
  next();
};
