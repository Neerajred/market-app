export const formatPrice = (price) => {
  return `₹${Number(price).toFixed(2)}`;
};

export const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0).toFixed(2);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return /^\d{10}/.test(phone);
};

export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const getItemCount = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};
