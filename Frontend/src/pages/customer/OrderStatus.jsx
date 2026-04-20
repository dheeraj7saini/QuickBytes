import { useOrder } from '../../context/OrderContext'
import { useAuth } from '../../context/AuthContext'

const progressSteps = ['placed', 'preparing', 'ready', 'completed']
const statusLabels = {
  placed: 'Your order has been placed',
  preparing: 'Your order is being prepared',
  ready: 'Your order is ready for pickup',
  completed: 'Order completed',
}

function formatOrderTime(createdAt) {
  return new Date(createdAt).toLocaleString()
}

function OrderStatus() {
  const { orders } = useOrder()
  const { user } = useAuth()
  const activeOrders = orders.filter(
    (order) => order.customerName === user?.name && order.status !== 'completed',
  )

  if (activeOrders.length === 0) {
    return (
      <main className="app-page">
        <h1 className="app-title">Order Status</h1>
        <p className="app-empty">No active orders</p>
      </main>
    )
  }

  return (
    <main className="app-page">
      <h1 className="app-title">Order Status</h1>
      <p className="app-subtitle">Track every active order in one place.</p>

      {activeOrders.map((order) => (
        <section key={order.id} className="app-card">
          <p>Shop: {order.shopName}</p>
          <p className="app-muted">Status: {order.status}</p>
          <p className="app-muted">{statusLabels[order.status]}</p>
          <p className="app-muted">Created: {formatOrderTime(order.createdAt)}</p>

          <h2 className="app-divider-title">Items</h2>
          <div className="app-list">
            {order.items.map((item, index) => (
            <p className="app-muted" key={`${order.id}-${item.id}-${index}`}>
              {item.name} x{item.quantity} - Rs. {item.price * item.quantity}
            </p>
          ))}
          </div>

          <h2 className="app-divider-title">Progress</h2>
          <p className="app-progress">
            {progressSteps.map((step, index) => (
              <span
                key={step}
                className={step === order.status ? 'app-progress__step--active' : ''}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
                {index < progressSteps.length - 1 ? ' -> ' : ''}
              </span>
            ))}
          </p>
        </section>
      ))}
    </main>
  )
}

export default OrderStatus
