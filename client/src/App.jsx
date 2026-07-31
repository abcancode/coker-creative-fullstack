import { Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import Header from "./components/Header";
import GoTop from "./components/GoTop";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import WhoWeAre from "./pages/WhoWeAre";
import StartYourExperience from "./pages/StartYourExperience";
import ExperienceDetails from "./pages/ExperienceDetails";

// ADMIN
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Analytics from "./admin/pages/Analytics";

import AdminExperiences from "./admin/pages/Experiences";
import ViewExperience from "./admin/pages/ViewExperience";
import EditExperience from "./admin/pages/EditExperience";

import SEO from "./admin/pages/SEO";
import Media from "./admin/pages/Media";
import Settings from "./admin/pages/Settings";
import FeaturedBrands from "./admin/pages/FeaturedBrands";
import Testimonials from "./admin/pages/Testimonials";
import Recognitions from "./admin/pages/Recognitions";
// import Inquiries from "./admin/pages/Inquiries";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ForgotPassword from "./admin/pages/ForgotPassword";
import ResetPassword from "./admin/pages/ResetPassword";

import ProtectedRoute from "./admin/routes/ProtectedRoute";

function App() {
  const location = useLocation();

  // CHECK IF CURRENT ROUTE IS ADMIN
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {/* HIDE PUBLIC LAYOUT ON ADMIN PAGES */}
      {!isAdminRoute && <Header />}

      {!isAdminRoute && <AnalyticsTracker />}

      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={<Home />} />

        <Route path="/experiences" element={<Experiences />} />

        <Route path="/who-we-are" element={<WhoWeAre />} />

        <Route
          path="/start-your-experience"
          element={<StartYourExperience />}
        />

        <Route path="/experiences/:slug" element={<ExperienceDetails />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ANALYTICS */}
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* EXPERIENCES MANAGER */}
        <Route
          path="/admin/experiences"
          element={
            <ProtectedRoute>
              <AdminExperiences />
            </ProtectedRoute>
          }
        />

        {/* VIEW EXPERIENCE */}
        <Route
          path="/admin/experiences/:id"
          element={
            <ProtectedRoute>
              <ViewExperience />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/experiences/edit/:id"
          element={
            <ProtectedRoute>
              <EditExperience />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/seo"
          element={
            <ProtectedRoute>
              <SEO />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <Media />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/featured-brands"
          element={
            <ProtectedRoute>
              <FeaturedBrands />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <Testimonials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/recognitions"
          element={
            <ProtectedRoute>
              <Recognitions />
            </ProtectedRoute>
          }
        />
        {/* 
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute>
              <Inquiries />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/admin/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/admin/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>

      {/* HIDE FOOTER ON ADMIN PAGES */}
      {!isAdminRoute && <Footer />}

      {!isAdminRoute && <GoTop />}
    </>
  );
}

export default App;
