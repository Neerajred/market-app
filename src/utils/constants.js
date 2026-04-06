export const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Meat",
  "Grains",
  "Breakfast"
];

export const APP_NAME = process.env.REACT_APP_NAME || "Fresh-Mart";

export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};
