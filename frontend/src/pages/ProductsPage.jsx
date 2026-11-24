import { useEffect, useState } from 'react'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await api.getProducts(search.trim(), categoryId)
        if (!cancelled) setProducts(data)
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
  }, [search, categoryId])

  return (
    <div>
      <h1>Products</h1>

      <div className="filter-bar">
        <div className="form-field">
          <label htmlFor="search">Search by name</label>
          <input
            id="search"
            className="input"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="For example: keyboard"
          />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="input"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products match your search." />
      )}
      {!loading && !error && products.length > 0 && (
        <>
          <p className="result-count">{products.length} product(s)</p>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
