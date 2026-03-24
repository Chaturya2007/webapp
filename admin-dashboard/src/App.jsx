import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import MenuManagementPage from './pages/MenuManagementPage';
import CustomersPage from './pages/CustomersPage';
import ReviewsPage from './pages/ReviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/menu': 'Menu Management',
  '/customers': 'Customers',
  '/reviews': 'Reviews',
  '/analytics': 'Analytics',
};

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Admin';

  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });
    socket.on('new-order', (order) => {
      toast.success(`New Order #${order?.orderId || ''}!`, { icon: '🛍️' });
      setNewOrderCount(c => c + 1);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header title={title} newOrderCount={newOrderCount} onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, padding: 24, backgroundColor: '#F5F5F5' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function AuthRedirect({ children }) {
  const { admin } = useAuth();
  return admin ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><Layout><MenuManagementPage /></Layout></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Layout><CustomersPage /></Layout></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Layout><ReviewsPage /></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
