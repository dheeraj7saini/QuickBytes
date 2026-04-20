import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('customer')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopCategory, setShopCategory] = useState('New Vendor')
  const [shopCuisine, setShopCuisine] = useState('Quick Bites')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Password and Confirm Password must match.')
      return
    }

    if (!name.trim()) {
      setError(role === 'vendor' ? 'Vendor name is required.' : 'Customer name is required.')
      return
    }

    if (role === 'vendor' && !shopName.trim()) {
      setError('Shop name is required for vendor signup.')
      return
    }

    const result = await register({
      role,
      name,
      email,
      password,
      shopName,
      shopCategory,
      shopCuisine,
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    setError('')

    if (role === 'vendor') {
      navigate('/vendor/dashboard')
      return
    }

    navigate('/home')
  }

  return (
    <main className="app-page app-page--auth">
      <section className="app-auth-layout">
        <article className="app-auth-panel app-auth-panel--hero">
          <span className="app-eyebrow">Create Account</span>
          <h1 className="app-title">Open the right portal from the start</h1>
          <p className="app-subtitle">
            Customers get their own ordering account. Vendors get their own account, shop identity, and private dashboard access.
          </p>

          <div className="app-role-grid">
            <button
              className={`app-role-card ${role === 'customer' ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setRole('customer')
                setError('')
              }}
            >
              <span className="app-role-card__title">Customer Signup</span>
              <span className="app-role-card__text">Create an account to order from nearby shops.</span>
            </button>
            <button
              className={`app-role-card ${role === 'vendor' ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setRole('vendor')
                setError('')
              }}
            >
              <span className="app-role-card__title">Vendor Signup</span>
              <span className="app-role-card__text">Create a separate vendor login with your own shop identity.</span>
            </button>
          </div>

          <section className="app-card app-auth-tip">
            <p className="app-divider-title">What vendors get</p>
            <div className="app-list">
              <p className="app-muted">A separate vendor account from customer users</p>
              <p className="app-muted">A vendor ID generated automatically after signup</p>
              <p className="app-muted">Access only to that vendor's own dashboard and orders</p>
            </div>
          </section>
        </article>

        <section className="app-card app-form-card app-auth-panel">
      <h2 className="app-title app-title--compact">Signup</h2>
      <p className="app-subtitle">Create a clean, fast food ordering account.</p>

      <div className="app-field">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(event) => {
            setRole(event.target.value)
            setError('')
          }}
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      <div className="app-field">
        <label htmlFor="name">{role === 'vendor' ? 'Vendor Name' : 'Customer Name'}</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {role === 'vendor' && (
        <>
          <div className="app-field">
            <label htmlFor="shopName">Shop Name</label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
            />
          </div>
          <div className="app-field">
            <label htmlFor="shopCategory">Shop Category</label>
            <input
              id="shopCategory"
              type="text"
              value={shopCategory}
              onChange={(event) => setShopCategory(event.target.value)}
            />
          </div>
          <div className="app-field">
            <label htmlFor="shopCuisine">Cuisine</label>
            <input
              id="shopCuisine"
              type="text"
              value={shopCuisine}
              onChange={(event) => setShopCuisine(event.target.value)}
            />
          </div>
        </>
      )}

      <div className="app-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="app-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="app-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {error && <p className="app-error">{error}</p>}

      <button className="app-button" type="button" onClick={handleSignup}>
        Create {role === 'vendor' ? 'Vendor' : 'Customer'} Account
      </button>

      <p className="app-muted">
        Already registered? <Link className="app-text-link" to="/login">Go to login</Link>.
      </p>
      </section>
      </section>
    </main>
  )
}

export default Signup
