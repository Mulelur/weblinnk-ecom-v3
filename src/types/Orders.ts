export interface Order {
  userId: string;
  storeUId: string;
  shopId: string;
  tax: number; // Tax amount
  subTotal: number; // Tax amount
  total: number; // Total amount including tax and shipping
  user: User;
  products: Product[];
  orderDate: string; // Assuming createOrderDate() returns a string
  status: OrderStatus; // Could be 'Processing', 'Shipped', 'Delivered', 'Cancelled', etc.
  shipping: Shipping;
  id?: string;
}

interface User {
  email: string | undefined;
}

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  suburb: string;
}

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productUrl: string;
}

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"; // Extend this as needed

interface Shipping {
  method: string; // Could be 'Standard Shipping', 'Express Shipping', etc.
  cost: number | string;
  trackingNumber: string;
  address: Address;
}
