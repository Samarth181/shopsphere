import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          ShopSphere
        </Link>

        <nav className="navbar-links">
          <NavLink to="/products">Products</NavLink>
          {isLoggedIn && <NavLink to="/cart">Cart</NavLink>}
          {isLoggedIn && <NavLink to="/orders">My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin/products">Admin Products</NavLink>}
          {isAdmin && <NavLink to="/admin/orders">Admin Orders</NavLink>}
        </nav>

        <div className="navbar-user">
          {isLoggedIn ? (
            <>
              <span className="navbar-name">{user.name}</span>
              <button type="button" className="btn btn-small" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
