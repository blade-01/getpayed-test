import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../features/dashboard/DashboardPage";
import OrderPage from "../features/orders/OrderPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/orders" element={<OrderPage />} />

      {/* 404 fallback */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}
