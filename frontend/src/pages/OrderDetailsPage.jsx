import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '')

export default function OrderDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const justPlaced = Boolean(location.state?.justPlaced)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getOrder(id)
        if (!cancelled) setOrder(data)
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
  }, [id])

  if (loading) return <Loading text="Loading order..." />
  if (error) return <ErrorMessage message={error} />
  if (!order) return null

  return (
    <div>
      <p className="breadcrumb">
        <Link to="/orders">My orders</Link> / Order #{order.id}
      </p>

      {justPlaced && (
        <ErrorMessage message="Thank you, your order has been placed." variant="success" />
      )}

      <h1>Order #{order.id}</h1>
      <p>
        Placed on {formatDate(order.createdAt)} | Status:{' '}
        <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit price</th>
            <th>Quantity</th>
            <th>Line total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>Rs {Number(item.unitPrice).toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>Rs {Number(item.lineTotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cart-summary">
        Order total: <strong>Rs {Number(order.totalAmount).toFixed(2)}</strong>
      </p>
      <p className="muted">
        These prices are the prices at the time of purchase. Changing a product price later
        does not change this order.
      </p>
    </div>
  )
}
