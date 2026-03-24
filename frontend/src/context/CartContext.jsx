import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });
  const [orderType, setOrderType] = useState('dine-in');
  const [deliveryInfo, setDeliveryInfo] = useState({
    tableNumber: '',
    pickupTime: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`, { icon: '🛒' });
  };

  const removeFromCart = (itemId) => {
    setItems(prev => prev.filter(i => i._id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getItemQuantity = (itemId) => {
    const item = items.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, orderType, deliveryInfo,
      setOrderType, setDeliveryInfo,
      addToCart, removeFromCart, updateQuantity, clearCart, getItemQuantity,
      subtotal, tax, deliveryFee, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
