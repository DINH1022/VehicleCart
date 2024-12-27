export const getCartSessionStorage = () => {
  const cartsJSON = sessionStorage.getItem("carts");
  console.log("cart", JSON.parse(cartsJSON));
  return cartsJSON ? JSON.parse(cartsJSON) : [];
};

export const addCartToSessionStorage = (product, quantity) => {
  const carts = getCartSessionStorage();
  const existingProduct = carts.find((p) => p.product._id === product._id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    const data = { product, quantity };
    carts.push(data);
  }

  sessionStorage.setItem("carts", JSON.stringify(carts));
};

export const removeCartFromSessionStorage = (productId) => {
  const carts = getCartSessionStorage();
  const updateCarts = carts.filter(
    (product) => product.product._id !== productId
  );
  sessionStorage.setItem("carts", JSON.stringify(updateCarts));
};

export const updateQuanityCartSessionStorage = (productId, newQuantiy) => {
  const carts = getCartSessionStorage();
  const product = carts.find((p) => p.product._id === productId);
  product.quantity = newQuantiy;
  sessionStorage.setItem("carts", JSON.stringify(carts));
};
export const clearCartSessionStorage = () => {
  sessionStorage.removeItem("carts");
};
