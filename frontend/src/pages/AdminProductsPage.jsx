import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import FormField from '../components/FormField'

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '' }

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      setProducts(await api.getAdminProducts())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFieldErrors({})
    setError('')
    setSuccess('')
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.categoryId),
    })
    setFieldErrors({})
    setError('')
    setSuccess('')
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function validate() {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.price || Number(form.price) <= 0) errors.price = 'Price must be greater than 0'
    if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Stock cannot be negative'
    if (!form.categoryId) errors.categoryId = 'Choose a category'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!validate()) return

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
    }

    const idBeingEdited = editingId
    setSaving(true)
    try {
      if (idBeingEdited) {
        await api.updateProduct(idBeingEdited, body)
      } else {
        await api.createProduct(body)
      }
      await loadProducts()

      startCreate()
      setSuccess(idBeingEdited ? `Saved product #${idBeingEdited}.` : 'Product created.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(product) {
    setError('')
    setSuccess('')
    try {
      await api.deactivateProduct(product.id)
      setSuccess(`Deactivated "${product.name}". Order history is unaffected.`)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Admin - products</h1>
      <ErrorMessage message={error} />
      <ErrorMessage message={success} variant="success" />

      <section className="panel">
        <h2>{editingId ? `Edit product #${editingId}` : 'Add a product'}</h2>
        <form onSubmit={handleSubmit} className="form form-wide">
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
          />
          <FormField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <FormField
            label="Price (Rs)"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={handleChange}
            error={fieldErrors.price}
          />
          <FormField
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            error={fieldErrors.stock}
          />
          <div className="form-field">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              className={fieldErrors.categoryId ? 'input input-error' : 'input'}
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && <span className="field-error">{fieldErrors.categoryId}</span>}
          </div>

          <div className="button-row">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={startCreate}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <h2>All products</h2>
      {loading && <Loading text="Loading products..." />}
      {!loading && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.categoryName}</td>
                <td>Rs {Number(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <div className="button-row">
                    <button type="button" className="btn btn-small" onClick={() => startEdit(product)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-small"
                      disabled={!product.active}
                      onClick={() => handleDeactivate(product)}
                    >
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
