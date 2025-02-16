import { db } from '@/firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Order } from '@/types/order';
import { updateUserData, getUserData } from './userService';

// Add utility functions for date handling
const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

const parseDate = (date: any): Date | null => {
  if (date instanceof Date) return date;
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    return isValidDate(parsedDate) ? parsedDate : null;
  }
  return null;
};

// Add utility function to clean data for Firestore
const cleanDataForFirestore = (data: any) => {
  if (data === undefined || data === null) return null;
  if (data instanceof Date) return isValidDate(data) ? data : null;
  if (Array.isArray(data)) return data.map(cleanDataForFirestore);
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: cleanDataForFirestore(value),
    }), {});
  }
  return data;
};

const cleanItemsData = (items: any[]) => {
  return items.map(item => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    giftMessage: item.giftMessage || null,
    specialRequest: item.specialRequest || null
  }));
};

export const getOrdersByIds = async (orderIds: string[]) => {
  try {
    const orders = await Promise.all(
      orderIds.map(async (id) => {
        const orderRef = doc(db, 'orders', id);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          return {
            id: orderSnap.id,
            ...orderSnap.data()
          };
        }
        return null;
      })
    );

    return orders.filter((order): order is NonNullable<typeof order> => order !== null);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Validate delivery date
    const deliveryDate = parseDate(orderData.deliveryDate);
    if (!deliveryDate) {
      throw new Error('Invalid delivery date format');
    }

    if (deliveryDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new Error('Delivery date cannot be in the past');
    }

    // Clean items data to store essential information
    const cleanedItems = cleanItemsData(orderData.items);

    const now = new Date();
    const orderDoc = cleanDataForFirestore({
      userId: orderData.userId,
      items: cleanedItems,
      deliveryDate,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      shippingMethod: orderData.shippingMethod,
      subtotal: Number(orderData.subtotal) || 0,
      shippingCost: Number(orderData.shippingCost) || 0,
      total: Number(orderData.total) || 0,
      specialInstructions: orderData.specialInstructions || null,
      status: 'pending',
      paymentStatus: {
        userConfirmed: true,
        adminConfirmed: false,
      },
      tracking: {
        isShipped: false,
        isDelivered: false,
      },
      createdAt: now,
      updatedAt: now,
    });

    // Create order in Firestore
    const orderRef = await addDoc(collection(db, 'orders'), orderDoc);

    // Update user's orderIds
    const userData = await getUserData(orderData.userId);
    if (userData) {
      await updateUserData(orderData.userId, {
        orderIds: [...(userData.orderIds || []), orderRef.id]
      });
    }

    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createGuestOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  try {
    // Validate delivery date
    const deliveryDate = parseDate(orderData.deliveryDate);
    if (!deliveryDate) {
      throw new Error('Invalid delivery date format');
    }

    if (deliveryDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new Error('Delivery date cannot be in the past');
    }

    // Clean items data to store essential information
    const cleanedItems = cleanItemsData(orderData.items);

    const now = new Date();

    // Create the order document with cleaned data
    const orderDoc = cleanDataForFirestore({
      userId: 'guest',
      items: cleanedItems,
      deliveryDate, // Only at order level
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      shippingMethod: orderData.shippingMethod,
      subtotal: Number(orderData.subtotal) || 0,
      shippingCost: Number(orderData.shippingCost) || 0,
      total: Number(orderData.total) || 0,
      specialInstructions: orderData.specialInstructions || null,
      status: 'pending',
      paymentStatus: {
        userConfirmed: true,
        adminConfirmed: false,
      },
      tracking: {
        isShipped: false,
        isDelivered: false,
      },
      createdAt: now,
      updatedAt: now,
    });

    // Create order in Firestore
    const orderRef = await addDoc(collection(db, 'orders'), orderDoc);
    return orderRef.id;
  } catch (error) {
    console.error('Error creating guest order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) {
      console.error('userId is required for getOrdersByUser');
      return [];
    }

    // First try with the indexed query
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const orderSnap = await getDocs(ordersQuery);
      return orderSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error: any) {
      // If index doesn't exist yet, fallback to simple query
      if (error.code === 'failed-precondition') {
        console.warn('Index not ready yet, falling back to simple query');
        const simpleQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const orderSnap = await getDocs(simpleQuery);
        return orderSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Order))
          .sort((a, b) => {
            // Client-side sorting as fallback
            const dateA = (a.createdAt as any)?.toDate?.() || new Date(a.createdAt);
            const dateB = (b.createdAt as any)?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  tracking?: Partial<Order['tracking']>
) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      ...(tracking && { tracking: tracking }),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const confirmPayment = async (orderId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      'paymentStatus.adminConfirmed': true,
      'paymentStatus.confirmedAt': new Date(),
      status: 'processing',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};
