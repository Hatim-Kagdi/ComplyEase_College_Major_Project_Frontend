import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Unauthorized from "./pages/auth/Unauthorized"

import UserDashboard from "./pages/dashboard/UserDashboard"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import CaDashboard from "./pages/dashboard/CaDashboard"

import Business from "./pages/business/Business"
import Compliance from "./pages/compliance/Compliance"
import Document from "./pages/document/Document"

import ProtectedRoute from "./routes/ProtectedRoutes"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_USER"]} />}>

          <Route
            path="/user/dashboard"
            element={<UserDashboard />}
          />

          <Route
            path="/business"
            element={<Business />}
          />

          <Route
            path="/compliance"
            element={<Compliance />}
          />

          <Route
            path="/document"
            element={<Document />}
          />

        </Route>

        {/* CA ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_CA"]} />}>

          <Route
            path="/ca/dashboard"
            element={<CaDashboard />}
          />

        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App