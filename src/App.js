import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

// ─── Shared / Infrastructure ───────────────────────────────────────────────────
import { ToastProvider } from './screens/Toast/ToastProvider';
import { PageLoader } from './screens/Loader/Loader';
import NoNetwork, { useNetworkStatus } from './screens/NoNetwork/NoNetwork';
import { authAPI, productAPI, cartAPI } from './services/api';
import './App.css';

// ─── Customer Screens ──────────────────────────────────────────────────────────
import Navbar from './screens/customer/Navbar/Navbar';
import Header from './screens/customer/Header/Header';
import HomeScreen from './screens/customer/HomeScreen/HomeScreen';
import CartScreen from './screens/customer/CartScreen/CartScreen';
import LoginScreen from './screens/customer/LoginScreen/LoginScreen';
import RegisterScreen from './screens/customer/RegisterScreen/RegisterScreen';
import CheckoutScreen from './screens/customer/CheckoutScreen/CheckoutScreen';
import PaymentScreen from './screens/customer/PaymentScreen/PaymentScreen';
import OrderConfirmationScreen from './screens/customer/OrderConfirmationScreen/OrderConfirmationScreen';
import OrderTrackingScreen from './screens/customer/OrderTrackingScreen/OrderTrackingScreen';
import OrdersScreen from './screens/customer/OrdersScreen/OrdersScreen';
import ProfileScreen from './screens/customer/ProfileScreen/ProfileScreen';
import WishlistScreen from './screens/customer/WishlistScreen/WishlistScreen';
import NotFoundScreen from './screens/customer/NotFoundScreen/NotFoundScreen';
import { ConfirmationProvider, useConfirmation } from './screens/Modal/ConfirmationProvider';

// ─── Admin Screens ─────────────────────────────────────────────────────────────
import AdminDashboardScreen from './screens/admin/DashboardScreen/DashboardScreen';

// ─── Route Guards ─────────────────────────────────────────────────────────────
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

// Admin route: must have token — actual role check is inside AdminDashboard
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// ─── App Layout ───────────────────────────────────────────────────────────────
const AppContent = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    cart, setCart, categories, selectedCategory, handleCategoryClick,
    handleAddClick, handleRemoveClick, handleChange,
    handleLogin, handleLogout, username, isLoggedIn, appReady,
    email, password, setEmail, setPassword, error, showModal,
    searchQuery, setSearchQuery, products, productsLoading
  } = props;

  if (!isOnline) return <NoNetwork />;
  if (!appReady || productsLoading) return <PageLoader message="Setting up your store..." />;

  // ─── Admin Layout (no customer header/navbar) ───────────────────────────────
  if (isAdminRoute) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/admin" element={<AdminRoute><AdminDashboardScreen /></AdminRoute>} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  // ─── Auth Layout (no header/navbar) ────────────────────────────────────────
  if (isAuthRoute) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={
              <LoginScreen
                handleLogin={handleLogin}
                error={error}
                showModal={showModal}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
              />
            }
          />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </div>
    );
  }

  // ─── Customer Layout (with header + sidebar navbar) ─────────────────────────
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryClick={(cat) => {
          handleCategoryClick(cat);
          if (location.pathname !== '/') navigate('/');
        }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          size={cart.length}
          username={username}
          handleLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <HomeScreen
                  categories={categories}
                  selectedCategory={selectedCategory}
                  products={products}
                  handleAddClick={handleAddClick}
                  cartItems={cart}
                  handleRemoveClick={handleRemoveClick}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/cart" element={<CartScreen cart={cart} setCart={setCart} handleChange={handleChange} handleRemoveClick={handleRemoveClick} />} />
            <Route path="/checkout" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CheckoutScreen cart={cart} /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute isLoggedIn={isLoggedIn}><PaymentScreen cart={cart} setCart={setCart} isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute isLoggedIn={isLoggedIn}><OrderConfirmationScreen /></ProtectedRoute>} />
            <Route path="/order-tracking/:orderId" element={<ProtectedRoute isLoggedIn={isLoggedIn}><OrderTrackingScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ProfileScreen /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute isLoggedIn={isLoggedIn}><WishlistScreen /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute isLoggedIn={isLoggedIn}><OrdersScreen /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Fruits');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { askConfirm } = useConfirmation();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productData, catData] = await Promise.all([
          productAPI.getProducts(),
          productAPI.getCategories()
        ]);
        setProducts(productData);
        setCategories(catData);
        if (catData.length > 0 && selectedCategory === 'Fruits') {
          if (!catData.includes('Fruits')) setSelectedCategory(catData[0]);
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchInitialData();

    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setShowModal(true);
      if (storedUsername) {
        setUserName(storedUsername);
        fetchCart();
      }
    }
    const timer = setTimeout(() => setAppReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();
      if (res.success) {
        const mappedCart = res.cart.items.map(i => ({
          ...i.product,
          quantity: i.quantity,
          cartItemId: i.id // store backend item id
        }));
        setCart(mappedCart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleChange = async (item, d) => {
    const token = localStorage.getItem('token');
    let newQuantity = item.quantity + d;
    if (newQuantity === 0) newQuantity = 1;

    if (token && (item.cartItemId || item.id)) {
      try {
        // If we don't have cartItemId yet (added before fetch), we need it
        if (item.cartItemId) {
          await cartAPI.updateCartItem(item.cartItemId, newQuantity);
        } else {
          // Fallback: addToCart with absolute quantity if possible, or just re-fetch
          await cartAPI.addToCart(item.id, d);
        }
        await fetchCart();
        return;
      } catch (err) { console.error(err); }
    }

    // Local-only update fallback
    const ind = cart.findIndex(i => i.id === item.id);
    if (ind === -1) return;
    const tempArr = [...cart];
    tempArr[ind].quantity = newQuantity;
    setCart(tempArr);
  };

  const handleCategoryClick = (category) => setSelectedCategory(category);

  const handleRemoveClick = (item) => {
    askConfirm({
      title: 'Remove Item',
      message: `Are you sure you want to remove ${item.name} from your cart?`,
      onConfirm: async () => {
        const token = localStorage.getItem('token');
        if (token && item.cartItemId) {
          try {
            await cartAPI.removeCartItem(item.cartItemId);
            await fetchCart();
            return;
          } catch (err) { console.error(err); }
        }
        setCart(cart.filter((i) => i.id !== item.id));
      }
    });
  };

  const handleAddClick = async (item) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartAPI.addToCart(item.id, 1);
        await fetchCart();
        return;
      } catch (err) { console.error(err); }
    }

    if (!cart.some((p) => p.id === item.id)) {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authAPI.login(email, password);
      const userName = data.user.fullname || data.user.name || 'User';
      setUserName(userName);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', userName);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userRole', data.user.role || 'user');

      setIsLoggedIn(true);
      setShowModal(true);

      // Merge local cart to DB after login
      if (cart.length > 0) {
        for (const item of cart) {
          try { await cartAPI.addToCart(item.id, item.quantity); } catch (e) {}
        }
      }
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleLogout = async (navigate) => {
    try { await authAPI.logout(); } catch (err) { }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setShowModal(false);
    setUserName('');
    setCart([]);
    setIsLoggedIn(false);
    if (navigate) navigate('/');
  };

  return (
    <AppContent
      cart={cart} setCart={setCart}
      categories={categories}
      selectedCategory={selectedCategory}
      handleCategoryClick={handleCategoryClick}
      handleAddClick={handleAddClick}
      handleRemoveClick={handleRemoveClick}
      handleChange={handleChange}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      username={username}
      isLoggedIn={isLoggedIn}
      appReady={appReady}
      email={email} password={password}
      setEmail={setEmail} setPassword={setPassword}
      error={error} showModal={showModal}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      products={products}
      productsLoading={productsLoading}
    />
  );
};

export default App;
