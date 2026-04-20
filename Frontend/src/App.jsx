import { useContext } from 'react'
import { BrowserRouter, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { CartContext } from './context/CartContext'
import AppRoutes from './routes/AppRoutes'

const getNavLinkClassName = ({ isActive }) =>
  isActive ? 'app-nav-link active' : 'app-nav-link'

function Navbar() {
  const navigate = useNavigate()
  const { user, role, logout } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const currentRole = role ?? user?.role ?? null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="app-navbar">
      <div className="app-navbar__inner">
      <div className="app-navbar__group">
        <span className="app-brand-mark">QuickBytes</span>
      </div>

      {!user && (
        <div className="app-navbar__group">
          <NavLink className={getNavLinkClassName} to="/login">
            Login
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/signup">
            Signup
          </NavLink>
        </div>
      )}

      {user && currentRole === 'customer' && (
        <>
          <div className="app-navbar__group">
            <span className="app-role-pill app-role-pill--customer">Customer Portal</span>
            <span className="app-muted">Hello, {user.name}</span>
            <span className="app-muted">Customer ID: {user.id}</span>
            <span className="app-muted">{user.email}</span>
          </div>
          <div className="app-navbar__group">
            <NavLink className={getNavLinkClassName} to="/home">Home</NavLink>
            <NavLink className={getNavLinkClassName} to="/cart">Cart ({cartItemCount})</NavLink>
            <NavLink className={getNavLinkClassName} to="/order-status">Order Status</NavLink>
            <NavLink className={getNavLinkClassName} to="/order-history">My Orders</NavLink>
            <button className="app-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}

      {user && currentRole === 'vendor' && (
        <>
          <div className="app-navbar__group">
            <span className="app-role-pill app-role-pill--vendor">Vendor Portal</span>
            <span className="app-muted">{user.shopName}</span>
            <span className="app-muted">Vendor ID: {user.id}</span>
          </div>
          <div className="app-navbar__group">
            <NavLink className={getNavLinkClassName} to="/vendor/dashboard">Vendor Dashboard</NavLink>
            <NavLink className={getNavLinkClassName} to="/vendor/orders">Vendor Orders</NavLink>
            <NavLink className={getNavLinkClassName} to="/vendor/history">History</NavLink>
            <button className="app-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
