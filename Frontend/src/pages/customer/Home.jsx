import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOrder } from '../../context/OrderContext'
import { useShop } from '../../context/ShopContext'

function StatusBadge({ status }) {
  const badgeClasses = {
    active: 'app-status-badge app-status-badge--active',
    busy: 'app-status-badge app-status-badge--busy',
    paused: 'app-status-badge app-status-badge--paused',
  }
  const labels = {
    active: 'Active',
    busy: 'Busy',
    paused: 'Paused',
  }

  return (
    <span className={badgeClasses[status] ?? badgeClasses.active}>
      {labels[status] ?? labels.active}
    </span>
  )
}

function FoodCard({ foodPoint, onClick }) {
  return (
    <button className={`app-card app-card-button app-shop-card app-shop-card--${foodPoint.accent}`} type="button" onClick={onClick}>
      <div className="app-inline app-inline--between">
        <span className="app-chip">{foodPoint.category}</span>
        <StatusBadge status={foodPoint.status} />
      </div>
      <h2 className="app-shop-card__title">{foodPoint.name}</h2>
      <p className="app-shop-card__meta">{foodPoint.cuisine} - {foodPoint.eta}</p>
      <p className="app-muted">{foodPoint.rating}</p>
      <p className="app-shop-card__cta">View menu</p>
    </button>
  )
}

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { orders } = useOrder()
  const { shops } = useShop()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showTopRatedOnly, setShowTopRatedOnly] = useState(false)
  const isCustomer = user?.role === 'customer'

  const orderStatsByShop = useMemo(
    () =>
      orders.reduce((stats, order) => {
        const existing = stats[order.shopName] ?? {
          activeCount: 0,
          ratingTotal: 0,
          ratingCount: 0,
        }

        if (order.status !== 'completed') {
          existing.activeCount += 1
        }

        if (order.rating !== null) {
          existing.ratingTotal += order.rating
          existing.ratingCount += 1
        }

        stats[order.shopName] = existing
        return stats
      }, {}),
    [orders],
  )

  const shopsWithMeta = useMemo(
    () =>
      shops.map((shop) => {
        const shopStats = orderStatsByShop[shop.name]
        const averageRating =
          shopStats?.ratingCount > 0
            ? (
                shopStats.ratingTotal /
                shopStats.ratingCount
              ).toFixed(1)
            : null
        const hasActiveOrders = (shopStats?.activeCount ?? 0) > 0

        let status = 'active'
        if (shop.status === 'paused') {
          status = 'paused'
        } else if (hasActiveOrders) {
          status = 'busy'
        }

        return {
          ...shop,
          status,
          averageRating: averageRating ? Number(averageRating) : null,
        }
      }),
    [orderStatsByShop, shops],
  )

  const categories = useMemo(
    () => Array.from(new Set(shops.map((shop) => shop.category))),
    [shops],
  )

  const filteredShops = useMemo(() => {
    if (!isCustomer) {
      return shopsWithMeta
    }

    return shopsWithMeta.filter((shop) => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter ? shop.status === statusFilter : true
      const matchesCategory = categoryFilter ? shop.category === categoryFilter : true
      const matchesRating = showTopRatedOnly ? (shop.averageRating ?? 0) >= 4 : true

      return matchesSearch && matchesStatus && matchesCategory && matchesRating
    })
  }, [categoryFilter, isCustomer, searchTerm, showTopRatedOnly, shopsWithMeta, statusFilter])

  const highlightedShops = filteredShops.slice(0, 3)
  const otherShops = filteredShops.slice(3)

  return (
    <main className="app-page app-page--wide">
      <section className="app-home-hero">
        <div>
          <span className="app-eyebrow">Customer Discovery</span>
          <h1 className="app-title">Find your next quick bite</h1>
          <p className="app-subtitle">
            Search less, browse faster, and keep the best campus shops front and center.
          </p>
        </div>

        <div className="app-home-hero__stats">
          <div className="app-stat-card">
            <strong>{shops.length}</strong>
            <span>Shops live</span>
          </div>
          <div className="app-stat-card">
            <strong>{shopsWithMeta.filter((shop) => shop.status !== 'paused').length}</strong>
            <span>Open now</span>
          </div>
          <div className="app-stat-card">
            <strong>{orders.filter((order) => order.status !== 'completed').length}</strong>
            <span>Orders cooking</span>
          </div>
        </div>
      </section>

      {isCustomer && (
        <section className="app-card app-section app-filter-bar">
          <div className="app-filter-bar__search">
            <input
              id="search"
              type="text"
              placeholder="Search shops"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="app-filter-bar__controls">
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="busy">Busy</option>
              <option value="paused">Paused</option>
            </select>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">All cuisines</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="app-inline app-filter-pill">
              <input
                type="checkbox"
                checked={showTopRatedOnly}
                onChange={(event) => setShowTopRatedOnly(event.target.checked)}
              />
              Rating 4+
            </label>
          </div>
        </section>
      )}

      {filteredShops.length === 0 && <p className="app-empty">No results found</p>}

      {highlightedShops.length > 0 && (
        <section className="app-shop-showcase">
          {highlightedShops.map((foodPoint) => (
            <FoodCard
              key={foodPoint.id}
              foodPoint={{
                ...foodPoint,
                rating: foodPoint.averageRating
                  ? `${foodPoint.averageRating} stars`
                  : 'No ratings yet',
              }}
              onClick={() => navigate(`/shop/${foodPoint.id}`)}
            />
          ))}
        </section>
      )}

      {otherShops.length > 0 && (
        <section className="app-grid app-grid--cards app-grid--compact-cards">
          {otherShops.map((foodPoint) => (
            <FoodCard
              key={foodPoint.id}
              foodPoint={{
                ...foodPoint,
                rating: foodPoint.averageRating
                  ? `${foodPoint.averageRating} stars`
                  : 'No ratings yet',
              }}
              onClick={() => navigate(`/shop/${foodPoint.id}`)}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default Home
