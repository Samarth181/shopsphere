import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image" aria-hidden="true">
        {product.categoryName}
      </div>
      <h3 className="product-name">
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="product-price">Rs {Number(product.price).toFixed(2)}</p>
      <p className="product-stock">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <Link to={`/products/${product.id}`} className="btn btn-block">
        View details
      </Link>
    </div>
  )
}
