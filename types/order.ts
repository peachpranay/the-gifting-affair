export interface OrderItem {
  productId: string;  // Document ID of the product
  name: string;      // Product name for quick reference
  quantity: number;
  giftMessage?: string;
  specialRequest?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    time: string;
  };
  specialInstructions?: string;
  deliveryDate: Date | string;  // Only at order level
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: {
    userConfirmed: boolean;
    adminConfirmed: boolean;
    confirmedAt?: Date;
  };
  tracking: {
    isShipped: boolean;
    shippedAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    trackingNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
