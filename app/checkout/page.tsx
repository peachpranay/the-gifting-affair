"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/components/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/utils/userService';
import { createOrder, createGuestOrder } from '@/utils/orderService';
import { getProductById } from '@/utils/productService';

interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface BillingDetails extends ShippingDetails {
  sameAsShipping: boolean;
}

const shippingMethods = [
  { id: 'standard', name: 'Standard Delivery', price: 49, time: '2-3 business days' },
];

const CheckoutPage = () => {
  const { items, getSubtotal, clearCart, deliveryDate } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [selectedShipping] = useState(shippingMethods[0]);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    sameAsShipping: true,
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [specialRequest, setSpecialRequest] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrichedItems, setEnrichedItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (user) {
      const userData = await getUserData(user.uid);
      if (userData) {
        setShippingDetails({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          address: userData.shippingAddress?.street || '',
          city: userData.shippingAddress?.city || '',
          state: userData.shippingAddress?.state || '',
          pincode: userData.shippingAddress?.postalCode || '',
          phone: userData.phoneNumber
        });
      }
    }
  };

  useEffect(() => {
    const enrichItems = async () => {
      try {
        const enriched = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            return {
              ...item,
              price: product?.price || 0,
              image: product?.image
            };
          })
        );
        setEnrichedItems(enriched);
      } catch (error) {
        console.error('Error enriching items:', error);
        setEnrichedItems(items);
      }
    };
    
    enrichItems();
  }, [items]);

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check if delivery date is set
      if (!deliveryDate) {
        alert('Please select a delivery date in your cart');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          giftMessage: item.giftMessage || null,
          specialRequest: item.specialRequest || null
        })),
        deliveryDate, // Single delivery date for the entire order
        shippingAddress: {
          firstName: shippingDetails.firstName,
          lastName: shippingDetails.lastName,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode
        },
        billingAddress: billingDetails.sameAsShipping
          ? {
              firstName: shippingDetails.firstName,
              lastName: shippingDetails.lastName,
              email: shippingDetails.email,
              phone: shippingDetails.phone,
              address: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state,
              pincode: shippingDetails.pincode
            }
          : {
              firstName: billingDetails.firstName,
              lastName: billingDetails.lastName,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              pincode: billingDetails.pincode
            },
        shippingMethod: selectedShipping,
        ...(specialRequest.trim() && { specialInstructions: specialRequest.trim() }),
        subtotal,
        shippingCost: selectedShipping.price,
        total,
      };

      let orderId;
      if (user) {
        orderId = await createOrder({ ...orderData, userId: user.uid });
      } else {
        orderId = await createGuestOrder(orderData);
      }

      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + selectedShipping.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 font-alegreya">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Login Section */}
            {!user && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">Want to save your details for future orders?</p>
                <button
                  onClick={() => router.push('/auth')}
                  className="text-bg4 font-semibold hover:underline"
                >
                  Login or create an account
                </button>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={shippingDetails.firstName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  value={shippingDetails.lastName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
              </div>
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mt-4"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="pincode"
                  value={shippingDetails.pincode}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Special Request (Optional)</h2>
              <textarea
                name="specialRequest"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
              />
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Billing Address</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={billingDetails.sameAsShipping}
                    onChange={handleBillingInputChange}
                    className="form-checkbox"
                  />
                  <span className="text-sm text-gray-600">Same as shipping address</span>
                </label>
              </div>

              {!billingDetails.sameAsShipping && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={billingDetails.firstName}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={billingDetails.lastName}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={billingDetails.address}
                    onChange={handleBillingInputChange}
                    className="w-full p-2 border rounded mt-4"
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      name="city"
                      value={billingDetails.city}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="state"
                      value={billingDetails.state}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      name="pincode"
                      value={billingDetails.pincode}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-4">
                {enrichedItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{selectedShipping.price}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-6 flex flex-col items-center">
                <h3 className="font-semibold mb-3">Scan QR to Pay</h3>
                <img 
                  src="\images\qr-code.png"
                  alt="Payment QR Code"
                  className="w-48 h-48 mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="paymentVerification"
                    checked={paymentVerified}
                    onChange={(e) => setPaymentVerified(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="paymentVerification" className="text-sm text-gray-600">
                    I confirm that I have made the payment
                  </label>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={!paymentVerified || isSubmitting}
                  className={`w-full py-3 rounded-md font-semibold ${
                    paymentVerified && !isSubmitting
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
