import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import Skeleton from "../components/common/Skeleton.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Campaigns = lazy(() => import("../pages/Campaigns.jsx"));
const CampaignDetail = lazy(() => import("../pages/CampaignDetail.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const DonorDashboard = lazy(() => import("../pages/DonorDashboard.jsx"));
const CampaignerDashboard = lazy(() => import("../pages/CampaignerDashboard.jsx"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard.jsx"));
const CreateCampaign = lazy(() => import("../pages/CreateCampaign.jsx"));
const ApplyCampaigner = lazy(() => import("../pages/ApplyCampaigner.jsx"));
const Unauthorized = lazy(() => import("../pages/Unauthorized.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-28">
      <Skeleton className="h-12 w-2/3" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route element={<RoleRoute roles={["donor", "campaigner", "admin"]} />}>
                <Route path="dashboard/donor" element={<DonorDashboard />} />
                <Route path="apply-campaigner" element={<ApplyCampaigner />} />
              </Route>
              <Route element={<RoleRoute roles={["campaigner", "admin"]} />}>
                <Route path="dashboard/campaigner" element={<CampaignerDashboard />} />
                <Route path="campaigner/create" element={<CreateCampaign />} />
              </Route>
              <Route element={<RoleRoute roles={["admin"]} />}>
                <Route path="dashboard/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>
          <Route path="dashboard" element={<Navigate to="/dashboard/donor" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
