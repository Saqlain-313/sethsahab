import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

// ================= CLIENT =================
import PrivateRoute from "./Components/PrivateRoute";
import PhoneLayout from "./Layout/PhoneLayout";

import BuyTicket from "./Pages/BuyTicket";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import MyTickets from "./Pages/MyTickets";
import ProfilePage from "./Pages/ProfilePage";
import Register from "./Pages/Register";
import ResultPage from "./Pages/ResultPage";
import PaymentSuccess from "./Pages/PaymentSuccess";
import WithdrawalRequest from "./Pages/WithdrawalRequest";

// ================= ADMIN =================
import AdminLayout from "./admin/adminComponents/AdminLayout";
import AdminPrivateRoute from "./admin/adminComponents/PrivateRoute";

import AdminLogin from "./admin/adminPages/AdminLogin";
import Amount from "./admin/adminPages/Amount";
import Dashboard from "./admin/adminPages/Dashboard";
import AdminResults from "./admin/adminPages/Results";
import Users from "./admin/adminPages/Users";
import LotteryConfig from "./admin/adminPages/LotteryConfig";
import AdminLottery from "./admin/adminPages/AdminLottery";
import AdminDeposits from "./admin/adminPages/AdminDeposits";
import WithdrawalManagement from "./admin/adminPages/WithdrawalManagement";

// ==========================================================
// WHATSAPP SUPPORT NUMBER
// ==========================================================
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

// ==========================================================
// WHATSAPP FLOATING BUTTON
// ==========================================================
const WhatsappFloatingButton = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hello, mujhe support chahiye."
    );

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


};

// ==========================================================
// WHATSAPP VISIBILITY
// ==========================================================
const WhatsappForUser = () => {
  const location = useLocation();

  // Admin ke saare routes par WhatsApp hide rahega
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/users" ||
    location.pathname === "/amount" ||
    location.pathname === "/lottery-config";

  if (isAdminRoute) {
    return null;
  }

  return <WhatsappFloatingButton />;
};

function App() {
  return (
    <>
      <Routes>
        {/* =====================================================
            CLIENT ROUTES
        ===================================================== */}
        <Route element={<PhoneLayout />}>

          {/* ================= CLIENT PUBLIC ================= */}

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* CLIENT RESULTS */}
          <Route
            path="/results"
            element={<ResultPage />}
          />

          {/* ================= CLIENT PRIVATE ================= */}

          <Route element={<PrivateRoute />}>

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/buy-ticket"
              element={<BuyTicket />}
            />

            <Route
              path="/my-tickets"
              element={<MyTickets />}
            />

            <Route
              path="/user/withdraw"
              element={<WithdrawalRequest />}
            />

            <Route
              path="/payment-success"
              element={<PaymentSuccess />}
            />

          </Route>
        </Route>

        {/* =====================================================
            ADMIN PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =====================================================
            ADMIN PRIVATE ROUTES
        ===================================================== */}

        <Route element={<AdminPrivateRoute />}>
          <Route element={<AdminLayout />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Users */}
            <Route
              path="/users"
              element={<Users />}
            />

            {/* Amount */}
            <Route
              path="/amount"
              element={<Amount />}
            />

            {/* ADMIN RESULTS */}
            <Route
              path="/admin/results"
              element={<AdminResults />}
            />

            {/* Lottery Config */}
            <Route
              path="/lottery-config"
              element={<LotteryConfig />}
            />

            {/* Admin Lottery */}
            <Route
              path="/admin/lottery"
              element={<AdminLottery />}
            />

            {/* Admin Deposits */}
            <Route
              path="/admin/deposits"
              element={<AdminDeposits />}
            />

            {/* Admin Withdrawals */}
            <Route
              path="/admin/withdrawals"
              element={<WithdrawalManagement />}
            />

          </Route>
        </Route>

        {/* =====================================================
            DEFAULT
        ===================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* =====================================================
          WHATSAPP - USER SIDE ONLY
      ===================================================== */}
      <WhatsappForUser />
    </>
  );
}

export default App;