import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { API_BASE_URL } from '../config/api'

const OrderContext = createContext(null)

function normalizeOrder(order) {
  return {
    id: order.id,
    shopId: order.shopId,
    shopName: order.shopName,
    customerName: order.customerName,
    status: order.status?.toLowerCase() ?? 'placed',
    createdAt: order.createdAt,
    rating: order.rating ?? null,
    items: (order.items ?? []).map((item) => ({
      id: item.menuItemId,
      menuItemId: item.menuItemId,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
    })),
  }
}

async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const errorBody = await response.json()
      message = errorBody.message ?? message
    } catch {
      // Keep fallback message if the response body is unavailable.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function OrderProvider({ children }) {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])

  const refreshOrders = async () => {
    if (!token || !user?.role) {
      setOrders([])
      return
    }

    const endpoint = user.role === 'vendor' ? '/vendor/orders' : '/orders/me'
    const response = await apiRequest(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setOrders(response.map(normalizeOrder))
  }

  useEffect(() => {
    refreshOrders().catch(() => {
      setOrders([])
    })
  }, [token, user?.role])

  const placeOrder = async (cartItems) => {
    if (!cartItems || cartItems.length === 0 || !token) {
      return null
    }

    const shopId = cartItems[0]?.shopId
    const response = await apiRequest('/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shopId,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      }),
    })

    const normalizedOrder = normalizeOrder(response)
    setOrders((prev) => [normalizedOrder, ...prev])
    return normalizedOrder
  }

  const updateOrderStatus = async (orderId, status) => {
    if (!token) {
      return null
    }

    const response = await apiRequest(`/vendor/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status.toUpperCase(),
      }),
    })

    const normalizedOrder = normalizeOrder(response)
    setOrders((prev) =>
      prev.map((order) => (order.id === normalizedOrder.id ? normalizedOrder : order)),
    )
    return normalizedOrder
  }

  const addRating = async (orderId, rating) => {
    if (!token) {
      return null
    }

    const response = await apiRequest(`/orders/${orderId}/rating`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
      }),
    })

    const normalizedOrder = normalizeOrder(response)
    setOrders((prev) =>
      prev.map((order) => (order.id === normalizedOrder.id ? normalizedOrder : order)),
    )
    return normalizedOrder
  }

  const value = useMemo(
    () => ({
      orders,
      placeOrder,
      updateOrderStatus,
      addRating,
      refreshOrders,
    }),
    [orders, token],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

const useOrder = () => useContext(OrderContext)

export { OrderContext, OrderProvider, useOrder }
