export const getCartSessionStorage = () => {
  const cartsJSON = sessionStorage.getItem("carts");
  return cartsJSON ? JSON.parse(cartsJSON) : [];
};

export const addCartToSessionStorage = (product) => {
  const carts = getCartSessionStorage();
  if (!carts.some((p) => p._id === product._id)) {
    carts.push(product);
    sessionStorage.setItem("carts", JSON.stringify(carts));
  }
};

export const removeCartFromSessionStorage = (productId) => {
  const carts = getCartSessionStorage();
  const updateCarts = carts.filter((product) => product._id !== productId);
  sessionStorage.setItem("carts", JSON.stringify(updateCarts));
};

export const updateQuanityCartSessionStorage = (productId, newQuantiy) => {
  const carts = getCartSessionStorage();
  const product = carts.some((p) => p._id === productId);
  product.quantity = newQuantiy;
  sessionStorage.setItem("carts", JSON.stringify(carts));
};
export const clearCartSessionStorage = () => {
    sessionStorage.removeItem("carts")
}