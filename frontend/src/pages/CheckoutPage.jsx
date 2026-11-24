import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getCart()
        if (!cancelled) setCart(data)
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

  async function placeOrder() {
    setError('')
    setPlacing(true)
    try {
      const order = await api.checkout()
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <Loading text="Loading checkout..." />

  return (
    <div>
      <h1>Checkout</h1>
      <ErrorMessage message={error} />

      {cart && cart.items.length === 0 && (
        <EmptyState message="Your cart is empty, so there is nothing to order.">
          <Link to="/products" className="btn">
            Browse products
          </Link>
        </EmptyState>
      )}

      {cart && cart.items.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>Rs {Number(item.unitPrice).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>Rs {Number(item.lineTotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>
              Total to pay: <strong>Rs {Number(cart.totalAmount).toFixed(2)}</strong>
            </p>
            <p className="muted">This is a demo shop. No real payment is taken.</p>
            <button type="button" className="btn" onClick={placeOrder} disabled={placing}>
              {placing ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
