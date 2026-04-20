import { useAuth } from '../../context/AuthContext'
import { useOrder } from '../../context/OrderContext'

function formatOrderTime(createdAt) {
  return new Date(createdAt).toLocaleString()
}

function History() {
  const { user } = useAuth()
  const { orders } = useOrder()

  const completedOrders = orders.filter(
    (order) =>
      order.shopName === user?.shopName && order.status === 'completed',
  )

  return (
    <main className="app-page app-page--wide">
      <h1 className="app-title">Order History</h1>
      <p className="app-subtitle">Review completed orders from your shop.</p>

      {completedOrders.length === 0 && <p className="app-empty">No completed orders yet.</p>}

      <section className="app-grid app-grid--cards">
      {completedOrders.map((order) => (
        <section key={order.id} className="app-card app-order-card">
          <p className="app-divider-title">{order.customerName}</p>
          <p className="app-muted">Order Time: {formatOrderTime(order.createdAt)}</p>
          {order.rating !== null && <p className="app-muted">Rating: {order.rating}/5</p>}
          <div className="app-list">
            {order.items.map((item, index) => (
            <p className="app-muted" key={`${order.id}-${item.id}-${index}`}>
              {item.name} x{item.quantity}
            </p>
          ))}
          </div>
        </section>
      ))}
      </section>
    </main>
  )
}

export default History
