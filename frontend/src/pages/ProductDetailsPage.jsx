import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getProduct(id)
        if (!cancelled) setProduct(data)
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

  async function handleAddToCart() {
    setError('')
    setSuccess('')
    setAdding(true)
    try {
      await api.addToCart(product.id, Number(quantity))
      setSuccess('Added to cart.')
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Loading text="Loading product..." />
  if (error && !product) return <ErrorMessage message={error} />
  if (!product) return null

  return (
    <div>
      <p className="breadcrumb">
        <Link to="/products">Products</Link> / {product.name}
      </p>

      <div className="details">
        <div className="details-image" aria-hidden="true">
          {product.categoryName}
        </div>
        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="details-price">Rs {Number(product.price).toFixed(2)}</p>
          <p>{product.description || 'No description.'}</p>
          <p className="muted">
            Category: {product.categoryName} | {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <ErrorMessage message={error} />
          <ErrorMessage message={success} variant="success" />

          {isLoggedIn ? (
            product.stock > 0 ? (
              <div className="add-row">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  className="input input-small"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
                <button type="button" className="btn" onClick={handleAddToCart} disabled={adding}>
                  {adding ? 'Adding...' : 'Add to cart'}
                </button>
              </div>
            ) : (
              <p className="state-box">This product is out of stock.</p>
            )
          ) : (
            <p className="state-box">
              Please <Link to="/login">log in</Link> to add items to your cart.
            </p>
          )}

          {isLoggedIn && (
            <p className="form-hint">
              <button type="button" className="btn btn-small" onClick={() => navigate('/cart')}>
                Go to cart
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
