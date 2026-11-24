const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'shopsphere_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {

    throw new Error('Cannot reach the server. Is the backend running?')
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = buildErrorMessage(data, response.status)
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}

function buildErrorMessage(data, status) {
  if (data && data.fieldErrors) {
    return Object.values(data.fieldErrors).join(' ')
  }
  if (data && data.message) {
    return data.message
  }
  if (status === 401) {
    return 'Please log in again.'
  }
  return `Request failed (${status})`
}

export const api = {

  register: (body) => request('/api/auth/register', { method: 'POST', body }),
  login: (body) => request('/api/auth/login', { method: 'POST', body }),
  me: () => request('/api/auth/me'),

  getProducts: (search, categoryId) => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId)
    const query = params.toString()
    return request(`/api/products${query ? `?${query}` : ''}`)
  },
  getProduct: (id) => request(`/api/products/${id}`),
  getCategories: () => request('/api/categories'),

  getCart: () => request('/api/cart'),
  addToCart: (productId, quantity) =>
    request('/api/cart/items', { method: 'POST', body: { productId, quantity } }),
  updateCartItem: (itemId, quantity) =>
    request(`/api/cart/items/${itemId}`, { method: 'PUT', body: { quantity } }),
  removeCartItem: (itemId) => request(`/api/cart/items/${itemId}`, { method: 'DELETE' }),

  checkout: () => request('/api/orders/checkout', { method: 'POST' }),
  getOrders: () => request('/api/orders'),
  getOrder: (id) => request(`/api/orders/${id}`),

  getAdminProducts: () => request('/api/admin/products'),
  createProduct: (body) => request('/api/admin/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/api/admin/products/${id}`, { method: 'PUT', body }),
  deactivateProduct: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  getAdminOrders: () => request('/api/admin/orders'),
  updateOrderStatus: (id, status) =>
    request(`/api/admin/orders/${id}/status`, { method: 'PUT', body: { status } }),
}
