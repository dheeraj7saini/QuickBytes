function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const itemTotal = item.price * item.quantity

  return (
    <div className="app-card">
      <p>
        {item.name} x{item.quantity} - ₹{itemTotal}
      </p>
      <div className="app-inline">
        <button className="app-button app-button--secondary" type="button" onClick={onDecrease}>
          [-]
        </button>
        <button className="app-button app-button--secondary" type="button" onClick={onIncrease}>
          [+]
        </button>
        <button className="app-button" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem
