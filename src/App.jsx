import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import StaffLayout from "./layouts/StaffLayout";
import CollectorLayout from "./layouts/CollectorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Lazy-load pages for a snappy experience.
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

const StaffDashboard = lazy(() => import("./pages/staff/Dashboard"));
const IdentifyWaste = lazy(() => import("./pages/staff/IdentifyWaste"));
const CollectionRequest = lazy(() => import("./pages/staff/CollectionRequest"));
const StaffRequests = lazy(() => import("./pages/staff/Requests"));
const StaffRequestDetail = lazy(() => import("./pages/staff/RequestDetail"));
const StaffProfile = lazy(() => import("./pages/staff/Profile"));
const CollectorDashboard = lazy(() => import("./pages/collector/Dashboard"));
const CollectorRequestDetail = lazy(() => import("./pages/collector/RequestDetail"));
const CollectorScan = lazy(() => import("./pages/collector/Scan"));
const CollectorProfile = lazy(() => import("./pages/collector/Profile"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBins = lazy(() => import("./pages/admin/Bins"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminTracking = lazy(() => import("./pages/admin/Tracking"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));

// Protected route that enforces role membership.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner full />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }
  return children;
};

function App() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />


        {/* Staff routes */}
        <Route
          path="/staff"
          element={
                      <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="identify-waste" element={<IdentifyWaste />} />
          <Route path="collection-request" element={<CollectionRequest />} />
          <Route path="requests" element={<StaffRequests />} />
          <Route path="requests/:id" element={<StaffRequestDetail />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>

        {/* Collector routes */}
        <Route
          path="/collector"
          element={
                      <ProtectedRoute allowedRoles={["collector"]}>
              <CollectorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CollectorDashboard />} />
          <Route path="requests/:id" element={<CollectorRequestDetail />} />
          <Route path="scan" element={<CollectorScan />} />
          <Route path="profile" element={<CollectorProfile />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
                      <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bins" element={<AdminBins />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="tracking" element={<AdminTracking />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

