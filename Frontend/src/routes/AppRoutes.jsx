import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import Cart from '../pages/customer/Cart'
import Home from '../pages/customer/Home'
import OrderHistory from '../pages/customer/OrderHistory'
import OrderStatus from '../pages/customer/OrderStatus'
import Shop from '../pages/customer/Shop'
import Dashboard from '../pages/vendor/Dashboard'
import History from '../pages/vendor/History'
import Orders from '../pages/vendor/Orders'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRole, children }) {
  const { user, role } = useAuth()
  const currentRole = role ?? user?.role ?? null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={currentRole === 'vendor' ? '/vendor/dashboard' : '/home'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<ProtectedRoute allowedRole="customer"><Home /></ProtectedRoute>} />
      <Route path="/shop/:id" element={<ProtectedRoute allowedRole="customer"><Shop /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute allowedRole="customer"><Cart /></ProtectedRoute>} />
      <Route path="/order-status" element={<ProtectedRoute allowedRole="customer"><OrderStatus /></ProtectedRoute>} />
      <Route path="/order-history" element={<ProtectedRoute allowedRole="customer"><OrderHistory /></ProtectedRoute>} />
      <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRole="vendor"><Dashboard /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute allowedRole="vendor"><Orders /></ProtectedRoute>} />
      <Route path="/vendor/history" element={<ProtectedRoute allowedRole="vendor"><History /></ProtectedRoute>} />
    </Routes>
  )
}

export default AppRoutes
