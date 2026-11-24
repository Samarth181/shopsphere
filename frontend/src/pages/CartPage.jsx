import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyItemId, setBusyItemId] = useState(null)

  async function loadCart() {
    setLoading(true)
    setError('')
    try {
      setCart(await api.getCart())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  async function changeQuantity(item, newQuantity) {
    if (newQuantity < 1) return
    setError('')
    setBusyItemId(item.id)
    try {
      setCart(await api.updateCartItem(item.id, newQuantity))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  async function removeItem(item) {
    setError('')
    setBusyItemId(item.id)
    try {
      setCart(await api.removeCartItem(item.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  if (loading) return <Loading text="Loading cart..." />

  return (
    <div>
      <h1>Your cart</h1>
      <ErrorMessage message={error} />

      {cart && cart.items.length === 0 && (
        <EmptyState message="Your cart is empty.">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/products/${item.productId}`}>{item.productName}</Link>
                  </td>
                  <td>Rs {Number(item.unitPrice).toFixed(2)}</td>
                  <td>
                    <div className="quantity-cell">
                      <button
                        type="button"
                        className="btn btn-small"
                        disabled={busyItemId === item.id || item.quantity <= 1}
                        onClick={() => changeQuantity(item, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-small"
                        disabled={busyItemId === item.id || item.quantity >= item.availableStock}
                        onClick={() => changeQuantity(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>Rs {Number(item.lineTotal).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-small"
                      disabled={busyItemId === item.id}
                      onClick={() => removeItem(item)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>
              Items: {cart.itemCount} | Total: <strong>Rs {Number(cart.totalAmount).toFixed(2)}</strong>
            </p>
            <button type="button" className="btn" onClick={() => navigate('/checkout')}>
              Go to checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
