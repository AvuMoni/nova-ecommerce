import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import PaymentCallback from "./pages/PaymentCallback";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Account from "./pages/Account";
import AdminRoute from "./components/AdminRoute";
import AdminOrders from "./pages/AdminOrders";


function App() {
return ( <BrowserRouter> <Navbar />


  <Routes>

    {/* Public routes */}

    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/shop"
      element={<Shop />}
    />

    <Route
      path="/product/:id"
      element={<ProductDetails />}
    />

    <Route
      path="/cart"
      element={<Cart />}
    />

    <Route
      path="/wishlist"
      element={<Wishlist />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />

    {/* Protected account route */}

    <Route
      path="/account"
      element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      }
    />

    {/* Protected checkout route */}

    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />

    {/* Paystack payment callback */}

    <Route
      path="/payment/callback"
      element={
        <ProtectedRoute>
          <PaymentCallback />
        </ProtectedRoute>
      }
    />
    <Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>
    {/* 404 */}

    <Route
      path="*"
      element={<NotFound />}
    />
    <Route
  path="/account/orders/:id"
  element={
    <ProtectedRoute>
      <OrderDetails />
    </ProtectedRoute>
  }
/>
  </Routes>

  <Footer />
</BrowserRouter>


);
}

export default App;
