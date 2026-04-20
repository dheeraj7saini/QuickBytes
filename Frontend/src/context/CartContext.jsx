import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'cartItems'

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem(CART_STORAGE_KEY)
    return savedCartItems ? JSON.parse(savedCartItems) : []
  })
  const [cartNotice, setCartNotice] = useState('')

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems((prev) => {
      const hasDifferentShopItems =
        prev.length > 0 && prev.some((entry) => entry.shopId !== item.shopId)

      if (hasDifferentShopItems) {
        setCartNotice('Your cart was reset because an order can include items from only one shop at a time.')
        return [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            shopId: item.shopId ?? null,
            shopName: item.shopName ?? '',
            quantity: 1,
          },
        ]
      }

      const existingItem = prev.find(
        (entry) => entry.id === item.id && entry.shopId === item.shopId,
      )

      if (existingItem) {
        return prev.map((entry) =>
          entry.id === item.id && entry.shopId === item.shopId
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        )
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          shopId: item.shopId ?? null,
          shopName: item.shopName ?? '',
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (id, shopId) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.shopId === shopId)),
    )
  }

  const increaseQuantity = (itemId, shopId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.shopId === shopId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  const decreaseQuantity = (itemId, shopId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId && item.shopId === shopId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const dismissCartNotice = () => {
    setCartNotice('')
  }

  const value = useMemo(
    () => ({
      cartItems,
      cartNotice,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      dismissCartNotice,
    }),
    [cartItems, cartNotice],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

const useCart = () => useContext(CartContext)

export { CartContext, CartProvider, useCart }
