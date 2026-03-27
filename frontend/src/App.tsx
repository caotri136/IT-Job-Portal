import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotVerify from "./pages/auth/ForgotVerify";
import ResetPassword from "./pages/auth/ResetPassword";
import Homepage from "./pages/home/Homepage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/verify" element={<Verify/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/verify-otp" element={<ForgotVerify/>}></Route>
        <Route path="/reset-password" element={<ResetPassword/>}></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}