import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import { useAuth } from "./hooks/useAuth";
import ProductDetailPage from "./Pages/ProductDetailPage";
import LoginPage from "./Pages/LoginPage";
import ConfirmationPage from "./Pages/ConfirmationPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrdersPage from "./Pages/OrdersPage";
import RegisterPage from "./Pages/RegisterPage";

function App() {
  const { user } = useAuth();

  // undefined = still loading auth state
  if (user === undefined) return null;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/s" />} />
          <Route path="/s" element={<MainPage user={user} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/s/:id" element={<ProductDetailPage user={user} />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />
          <Route
            path="/checkout/:id"
            element={user ? <CheckoutPage /> : <LoginPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
