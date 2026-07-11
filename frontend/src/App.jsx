import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddChemical from "./pages/chemicals/AddChemical";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddUsers from "./components/AddUsers";
import PasswordReset from "./components/PasswordReset";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chemicals/add-chemical" element={<AddChemical />} />
          {/* Add other dashboard routes like '/chemicals/list' here when you create them */}
        </Route>
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/add-users" element={<AddUsers />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
