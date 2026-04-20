import { useContext, useMemo, useState } from 'react'
import CartItem from '../../components/CartItem'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { OrderContext } from '../../context/OrderContext'
import { ShopContext } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'

function Cart() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartNotice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    dismissCartNotice,
  } =
    useContext(CartContext)
  const { placeOrder } = useContext(OrderContext)
  const { shops } = useContext(ShopContext)
  const { user } = useAuth()
  const [orderError, setOrderError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const hasMultipleShops = new Set(cartItems.map((item) => item.shopId)).size > 1
  const invalidCartItems = useMemo(
    () =>
      cartItems.filter((item) => {
        const shop = shops.find((entry) => entry.id === item.shopId)
        return !shop || !shop.menu.some((menuItem) => menuItem.id === item.id)
      }),
    [cartItems, shops],
  )

  const handlePlaceOrder = async () => {
    if (!user) {
      setOrderError('Please log in as a customer to place an order.')
      return
    }

    if (hasMultipleShops) {
      setOrderError('Please keep items from only one shop in the cart before placing an order.')
      return
    }

    if (invalidCartItems.length > 0) {
      setOrderError('Some cart items are outdated. Clear the cart and add them again from the latest menu.')
      return
    }

    setIsSubmitting(true)
    setOrderError('')

    let order = null
    try {
      order = await placeOrder(cartItems)
    } catch (error) {
      setOrderError(error.message || 'Unable to place the order right now.')
    } finally {
      setIsSubmitting(false)
    }

    if (!order) {
      return
    }

    clearCart()
    dismissCartNotice()
    navigate('/order-status')
  }

  return (
    <main className="app-page">
      <h1 className="app-title">Cart</h1>
      <p className="app-subtitle">Total items: {totalItems}</p>

      {cartItems.length === 0 && <p className="app-empty">Your cart is empty.</p>}
      {cartNotice && <p className="app-subtitle">{cartNotice}</p>}
      {orderError && <p className="app-error">{orderError}</p>}
      {invalidCartItems.length > 0 && (
        <p className="app-subtitle">
          Some items in your cart no longer match the current shop menu. Clear the cart and add them again.
        </p>
      )}

      {cartItems.map((item) => (
        <CartItem
          key={`${item.shopId}-${item.id}`}
          item={item}
          onIncrease={() => increaseQuantity(item.id, item.shopId)}
          onDecrease={() => decreaseQuantity(item.id, item.shopId)}
          onRemove={() => removeFromCart(item.id, item.shopId)}
        />
      ))}

      <section className="app-card">
        <h2 className="app-divider-title">Total: Rs. {totalPrice}</h2>
        <button
          type="button"
          className="app-button"
          onClick={handlePlaceOrder}
          disabled={!cartItems.length || isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </section>
    </main>
  )
}

export default Cart
