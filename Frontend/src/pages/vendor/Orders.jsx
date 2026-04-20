import { useOrder } from '../../context/OrderContext'
import { useAuth } from '../../context/AuthContext'

function Orders() {
  const { orders, updateOrderStatus } = useOrder()
  const { user } = useAuth()
  const filteredOrders = orders.filter(
    (order) =>
      order.shopName?.toLowerCase() === (user?.shopName || '').toLowerCase() &&
      order.status !== 'completed',
  )

  return (
    <main className="app-page app-page--wide">
      <h1 className="app-title">Vendor Orders</h1>
      <p className="app-subtitle">Manage every live order from one focused queue.</p>

      {filteredOrders.length === 0 && <p className="app-empty">No orders available.</p>}

      <section className="app-grid app-grid--cards">
      {filteredOrders.map((order) => (
        <section key={order.id} className="app-card app-order-card">
          <div className="app-inline app-inline--between">
            <p className="app-divider-title">{order.customerName}</p>
            <span className={order.status === 'ready' ? 'app-status-badge app-status-badge--ready' : 'app-status-badge app-status-badge--busy'}>{order.status}</span>
          </div>
          <div className="app-list">
            {order.items.map((item) => (
            <p className="app-muted" key={item.id}>
              {item.name} x{item.quantity}
            </p>
          ))}
          </div>

          <div className="app-inline">
            <button className="app-button app-button--secondary" type="button" onClick={() => updateOrderStatus(order.id, 'preparing')}>
            Accept
            </button>
            <button className="app-button app-button--secondary" type="button" onClick={() => updateOrderStatus(order.id, 'ready')}>
            Ready
            </button>
            <button className="app-button" type="button" onClick={() => updateOrderStatus(order.id, 'completed')}>
            Complete
            </button>
          </div>
        </section>
      ))}
      </section>
    </main>
  )
}

export default Orders
