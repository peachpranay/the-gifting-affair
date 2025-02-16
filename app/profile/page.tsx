'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, updateUserData } from '@/utils/userService';
import { UserData } from '@/types/user';
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getOrdersByUser } from '@/utils/orderService';
import { getProductById } from '@/utils/productService';  // You'll need to create this

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enrichedOrders, setEnrichedOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
    if (user) {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      if (data) {
        setUserData(data);
        setAddress({
          street: data.shippingAddress?.street || '',
          city: data.shippingAddress?.city || '',
          state: data.shippingAddress?.state || '',
          postalCode: data.shippingAddress?.postalCode || '',
          phone: data.phoneNumber || ''
        });

        // Fetch orders and enrich with product details
        const userOrders = await getOrdersByUser(user.uid);
        const enriched = await Promise.all(userOrders.map(async (order) => {
          const enrichedItems = await Promise.all(order.items.map(async (item) => {
            const product = await getProductById(item.productId);
            return {
              ...item,
              price: product?.price || 0,
              image: product?.image // Remove placeholder fallback
            };
          }));
          return { ...order, items: enrichedItems };
        }));
        setEnrichedOrders(enriched);
      }
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUserData(user.uid, {
        phoneNumber: address.phone,
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode
        }
      });
      setIsEditing(false);
      await fetchUserData();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const renderOrderStatus = (order: Order) => {
    const getStatusDetails = () => {
      if (!order.paymentStatus.adminConfirmed) {
        return {
          color: 'yellow',
          text: 'Payment Pending Confirmation'
        };
      }
      switch (order.status) {
        case 'processing':
          return { color: 'blue', text: 'Processing' };
        case 'shipped':
          return { color: 'indigo', text: 'Shipped' };
        case 'delivered':
          return { color: 'green', text: 'Delivered' };
        case 'cancelled':
          return { color: 'red', text: 'Cancelled' };
        default:
          return { color: 'gray', text: 'Pending' };
      }
    };

    const { color, text } = getStatusDetails();
    return (
      <span className={`px-3 py-1 rounded-full text-sm bg-${color}-100 text-${color}-800`}>
        {text}
      </span>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{userData?.firstName} {userData?.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{userData?.email}</p>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delivery Address</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Street Address"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                placeholder="ZIP Code"
                className="border p-2 rounded"
              />
              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                className="border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-1">
            <p className="text-gray-700">{address.street}</p>
            <p className="text-gray-700">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-gray-700">Phone: {address.phone}</p>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <div className="space-y-4">
        {enrichedOrders.length > 0 ? (
          enrichedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-gray-600 text-sm">
                    {order.createdAt.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  {renderOrderStatus(order)}
                  <p className="font-medium mt-2">Total: ₹{order.total}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              {order.tracking.isShipped && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Tracking Number: {order.tracking.trackingNumber}
                  </p>
                  {order.tracking.shippedAt && (
                    <p className="text-sm text-gray-600">
                      Shipped on: {order.tracking.shippedAt.toDate().toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}