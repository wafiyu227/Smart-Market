import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages
import Login from "./src/pages/Login";
import Signup from "./src/pages/Signup";
import Landing from "./src/pages/Landing";
import Home from "./src/pages/Home";
import CreateShop from "./src/pages/CreateShop";
import Dashboard from "./src/pages/Dashboard";
import ShopProfile from "./src/pages/ShopProfile";
import HomeSearch from "./src/pages/HomeSearch";
import PricingPage from "./src/pages/PricingPage";
import HelpCenter from "./src/pages/HelpCenter";
import ContactUsPage from "./src/pages/ContactUsPage";
import SearchResults from "./src/pages/SearchResults";
import ForgotPassword from "./src/pages/ForgotPassword";
import ResetPassword from "./src/pages/ResetPassword";
import UpgradeToProPage from "./src/pages/UpgradeToProPage";
import PrivacyPolicy from "./src/pages/PrivacyPolicy";
import TermsOfService from "./src/pages/TermsOfService";

// Auth
import { useAuth } from "./src/context/Authcontext";
import ProtectedRoute from "./src/components/ProtectedRoute";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop/:name" element={<ShopProfile />} />
        <Route path="/search" element={<HomeSearch />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/upgrade" element={<UpgradeToProPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes */}
        <Route
          path="/create-shop"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <CreateShop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRoutes;
