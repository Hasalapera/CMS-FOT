import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddChemical from "./pages/chemicals/AddChemical";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ViewChemicals from "./pages/chemicals/ViewChemicals";
import ChemicalDetails from "./pages/chemicals/ChemicalDetails";
import ViewDeactivatedChemicals from "./pages/chemicals/ViewDeactivatedChemicals"; 
import AddNewBatch from "./pages/batches/AddNewBatch";
import AddLocation from "./pages/locations/AddLocation";

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
          <Route path="/chemicals/list" element={<ViewChemicals />} />
          <Route path="/chemicals/:id" element={<ChemicalDetails />} />
          <Route path="/chemicals/deactivated" element={<ViewDeactivatedChemicals />} /> 
          <Route path="/stock/add" element={<AddNewBatch />} />
          <Route path="/locations/add" element={<AddLocation />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
