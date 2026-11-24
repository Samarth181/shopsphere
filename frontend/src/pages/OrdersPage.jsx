import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '')

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getOrders()
        if (!cancelled) setOrders(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <Loading text="Loading orders..." />

  return (
    <div>
      <h1>My orders</h1>
      <ErrorMessage message={error} />

      {!error && orders.length === 0 && (
        <EmptyState message="You have not placed any orders yet.">
          <Link to="/products" className="btn">
            Browse products
          </Link>
        </EmptyState>
      )}

      {orders.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  {}
                  -
                </td>
                <td>Rs {Number(order.totalAmount).toFixed(2)}</td>
                <td>
                  <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>
                  <Link to={`/orders/${order.id}`}>View details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
