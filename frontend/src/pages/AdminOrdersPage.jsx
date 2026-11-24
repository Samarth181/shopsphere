import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const STATUSES = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const formatDate = (value) => (value ? new Date(value).toLocaleString() : '')

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      setOrders(await api.getAdminOrders())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleStatusChange(order, newStatus) {
    if (newStatus === order.status) return
    setError('')
    setSuccess('')
    setBusyId(order.id)
    try {
      const updated = await api.updateOrderStatus(order.id, newStatus)
      setSuccess(`Order #${updated.id} is now ${updated.status}.`)
      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Loading text="Loading orders..." />

  return (
    <div>
      <h1>Admin - orders</h1>
      <ErrorMessage message={error} />
      <ErrorMessage message={success} variant="success" />

      {orders.length === 0 && <EmptyState message="No orders have been placed yet." />}

      {orders.map((order) => {
        const isFinal = order.status === 'DELIVERED' || order.status === 'CANCELLED'
        return (
          <section key={order.id} className="panel">
            <div className="order-head">
              <div>
                <h2>Order #{order.id}</h2>
                <p className="muted">
                  {order.customerName} ({order.customerEmail}) | {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="order-head-right">
                <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
                <label htmlFor={`status-${order.id}`} className="sr-only">
                  Change status
                </label>
                <select
                  id={`status-${order.id}`}
                  className="input input-small"
                  value={order.status}
                  disabled={isFinal || busyId === order.id}
                  onChange={(event) => handleStatusChange(order, event.target.value)}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
            <p className="order-total">Total: Rs {Number(order.totalAmount).toFixed(2)}</p>
            {isFinal && <p className="muted">A {order.status} order can no longer be changed.</p>}
          </section>
        )
      })}
    </div>
  )
}
