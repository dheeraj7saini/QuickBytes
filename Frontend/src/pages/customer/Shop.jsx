import { useParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useShop } from '../../context/ShopContext'

function ShopStatusBadge({ status }) {
  const badgeClass =
    status === 'paused'
      ? 'app-status-badge app-status-badge--paused'
      : 'app-status-badge app-status-badge--active'

  return (
    <span className={badgeClass}>{status === 'paused' ? 'Paused' : 'Active'}</span>
  )
}

function MenuItem({
  shop,
  item,
  cartItem,
  isPaused,
  onAddToCart,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className={`app-card app-menu-card app-shop-card--${shop.accent ?? 'ocean'}`}>
      <div className="app-menu-card__content">
        <div className="app-inline app-inline--between">
          <p className="app-divider-title">{item.name}</p>
          <span className="app-chip">Rs. {item.price}</span>
        </div>
        <p className="app-muted">{shop.category} favourite</p>
        {!cartItem && (
          <button
            type="button"
            className="app-button"
            onClick={onAddToCart}
            disabled={isPaused}
          >
            Add to Cart
          </button>
        )}
        {cartItem && (
          <div className="app-inline">
            <button className="app-button app-button--secondary" type="button" onClick={onDecrease} disabled={isPaused}>
              [-]
            </button>
            <span> {cartItem.quantity} </span>
            <button className="app-button app-button--secondary" type="button" onClick={onIncrease} disabled={isPaused}>
              [+]
            </button>
          </div>
        )}
      </div>
      {item.imageUrl && (
        <div className="app-menu-card__media">
          <img
            className="app-menu-card__image"
            src={item.imageUrl}
            alt={item.name}
          />
        </div>
      )}
    </div>
  )
}

function Shop() {
  const { id } = useParams()
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart()
  const { getShopById } = useShop()
  const shop = getShopById(id)

  if (!shop) {
    return <h1>Shop not found</h1>
  }

  const shopStatus = shop.status ?? 'active'
  const isPaused = shopStatus === 'paused'

  const handleAddToCart = (item) => {
    if (isPaused) {
      return
    }

    console.log('Added:', item)
    addToCart({
      ...item,
      shopId: shop.id,
      shopName: shop.name,
    })
  }

  return (
    <main className="app-page app-page--wide">
      <section className={`app-card app-shop-hero app-shop-card--${shop.accent ?? 'ocean'}`}>
        <span className="app-chip">{shop.category}</span>
        <h1 className="app-title">{shop.name}</h1>
        <p className="app-subtitle">{shop.cuisine} - {shop.eta}</p>
        <p className="app-inline app-section">
          Status: <ShopStatusBadge status={shopStatus} />
        </p>
      </section>
      {isPaused && <p className="app-subtitle">This shop is currently not accepting orders</p>}
      <section className="app-grid app-grid--cards">
        {shop.menu.map((item) => {
          const cartItem = cartItems.find(
            (entry) => entry.id === item.id && entry.shopId === shop.id,
          )

          return (
            <MenuItem
              key={`${shop.id}-${item.id}`}
              shop={shop}
              item={item}
              cartItem={cartItem}
              isPaused={isPaused}
              onAddToCart={() => handleAddToCart(item)}
              onIncrease={() => increaseQuantity(item.id, shop.id)}
              onDecrease={() => decreaseQuantity(item.id, shop.id)}
            />
          )
        })}
      </section>
    </main>
  )
}

export default Shop
