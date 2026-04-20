import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const roleContent = {
  customer: {
    heading: 'Customer Login',
    subtitle: 'Sign in to browse shops, manage your cart, and track active orders.',
    identityLabel: 'Customer Email',
    helper: 'Use your customer email and password.',
    demo: {
      email: 'customer@example.com',
      password: 'password123',
    },
  },
  vendor: {
    heading: 'Vendor Login',
    subtitle: 'Choose your vendor account and sign in to manage orders and menu items.',
    identityLabel: 'Vendor',
    helper: 'Each vendor uses a separate shop account and password.',
    demo: {
      shopName: 'Sharma Snacks',
      password: 'password123',
    },
  },
}

function Login() {
  const navigate = useNavigate()
  const { login, vendorOptions, refreshVendorOptions } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')

  const currentContent = roleContent[role]

  useEffect(() => {
    refreshVendorOptions()
  }, [refreshVendorOptions])

  useEffect(() => {
    if (role === 'vendor' && !identifier && vendorOptions.length > 0) {
      setIdentifier(vendorOptions[0])
    }
  }, [identifier, role, vendorOptions])

  const handleRoleSelect = (nextRole) => {
    setRole(nextRole)
    setError('')

    if (nextRole === 'vendor') {
      setIdentifier((currentValue) => currentValue || vendorOptions[0] || '')
      return
    }

    setIdentifier('')
  }

  const handleLogin = async () => {
    const result = await login({ role, identifier, password })

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

  const applyDemoCredentials = (selectedRole, demoIdentifier, demoPassword) => {
    setRole(selectedRole)
    setIdentifier(demoIdentifier)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <main className="app-page app-page--auth">
      <section className="app-auth-layout">
        <article className="app-auth-panel app-auth-panel--hero">
          <span className="app-eyebrow">Role Based Access</span>
          <h1 className="app-title">Sign in as customer or vendor</h1>
          <p className="app-subtitle">
            Customers order fast. Vendors log in with their own credentials and manage only their own shop queue.
          </p>

          <div className="app-role-grid">
            {Object.entries(roleContent).map(([roleKey, item]) => (
              <button
                key={roleKey}
                className={`app-role-card ${role === roleKey ? 'active' : ''}`}
                type="button"
                onClick={() => handleRoleSelect(roleKey)}
              >
                <span className="app-role-card__title">{roleKey === 'vendor' ? 'Vendor Portal' : 'Customer Portal'}</span>
                <span className="app-role-card__text">{item.helper}</span>
              </button>
            ))}
          </div>

          <section className="app-card app-auth-tip">
            <p className="app-divider-title">Demo credentials</p>
            <div className="app-demo-actions">
              <button
                className="app-demo-button"
                type="button"
                onClick={() =>
                  applyDemoCredentials(
                    'customer',
                    roleContent.customer.demo.email,
                    roleContent.customer.demo.password,
                  )
                }
              >
                Customer Demo
              </button>
              <button
                className="app-demo-button"
                type="button"
                onClick={() =>
                  applyDemoCredentials(
                    'vendor',
                    roleContent.vendor.demo.shopName,
                    roleContent.vendor.demo.password,
                  )
                }
              >
                Vendor Demo
              </button>
            </div>
          </section>
        </article>

        <section className="app-card app-form-card app-auth-panel">
          <span className={`app-role-pill ${role === 'vendor' ? 'app-role-pill--vendor' : 'app-role-pill--customer'}`}>
            {role === 'vendor' ? 'Vendor Access' : 'Customer Access'}
          </span>
          <h2 className="app-title app-title--compact">{currentContent.heading}</h2>
          <p className="app-subtitle">{currentContent.subtitle}</p>

          {role === 'vendor' ? (
            <div className="app-field">
              <label htmlFor="vendorSelect">Which vendor do you want to login as?</label>
              <select
                id="vendorSelect"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              >
                <option value="">Select vendor</option>
                {vendorOptions.map((shopName) => (
                  <option key={shopName} value={shopName}>
                    {shopName}
                  </option>
                ))}
              </select>
              {vendorOptions.length === 0 && (
                <p className="app-muted">No predefined vendors available yet. Restart the backend once after the database is ready.</p>
              )}
            </div>
          ) : (
            <div className="app-field">
              <label htmlFor="email">{currentContent.identityLabel}</label>
              <input
                id="email"
                type="email"
                placeholder={currentContent.demo.email}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </div>
          )}

          <div className="app-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder={currentContent.demo.password}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="app-error">{error}</p>}

          <button className="app-button" type="button" onClick={handleLogin}>
            Login to {role === 'vendor' ? 'Vendor Panel' : 'Customer Panel'}
          </button>

          <p className="app-muted">
            Need a new account? <Link className="app-text-link" to="/signup">Create one here</Link>.
          </p>
        </section>
      </section>
    </main>
  )
}

export default Login
