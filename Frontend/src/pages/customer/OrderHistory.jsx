import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useOrder } from '../../context/OrderContext'

function formatOrderTime(createdAt) {
  return new Date(createdAt).toLocaleString()
}

function RatingStars({ orderId, onRate }) {
  return (
    <div className="app-inline">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={`${orderId}-${star}`}
          type="button"
          className="app-button app-button--secondary"
          onClick={() => onRate(star)}
        >
          {star} star{star > 1 ? 's' : ''}
        </button>
      ))}
    </div>
  )
}

function OrderHistory() {
  const { user } = useAuth()
  const { orders, addRating } = useOrder()
  const [hiddenRatingOrders, setHiddenRatingOrders] = useState([])

  const completedOrders = orders.filter(
    (order) => order.customerName === user?.name && order.status === 'completed',
  )

  const handleSkip = (orderId) => {
    setHiddenRatingOrders((prev) =>
      prev.includes(orderId) ? prev : [...prev, orderId],
    )
  }

  const handleShowRating = (orderId) => {
    setHiddenRatingOrders((prev) => prev.filter((id) => id !== orderId))
  }

  return (
    <main className="app-page">
      <h1 className="app-title">My Orders</h1>
      <p className="app-subtitle">Review your completed orders and add optional ratings.</p>

      {completedOrders.length === 0 && <p className="app-empty">No completed orders yet.</p>}

      {completedOrders.map((order) => (
        <section key={order.id} className="app-card">
          <p>Shop: {order.shopName}</p>
          <p className="app-muted">Status: {order.status}</p>
          <p className="app-muted">Order Time: {formatOrderTime(order.createdAt)}</p>
          <p className="app-divider-title">Items</p>
          <div className="app-list">
            {order.items.map((item, index) => (
            <p className="app-muted" key={`${order.id}-${item.id}-${index}`}>
              {item.name} x{item.quantity}
            </p>
          ))}
          </div>

          {order.rating !== null ? (
            <p className="app-divider-title">Rating: {order.rating}/5</p>
          ) : hiddenRatingOrders.includes(order.id) ? (
            <div className="app-stack">
              <p className="app-muted">Rate this order later if you want.</p>
              <button className="app-button app-button--ghost" type="button" onClick={() => handleShowRating(order.id)}>
                Rate Later
              </button>
            </div>
          ) : (
            <div className="app-stack">
              <p className="app-divider-title">Rate this order</p>
              <RatingStars orderId={order.id} onRate={(rating) => addRating(order.id, rating)} />
              <button className="app-button app-button--ghost" type="button" onClick={() => handleSkip(order.id)}>
                Skip
              </button>
            </div>
          )}
        </section>
      ))}
    </main>
  )
}

export default OrderHistory
