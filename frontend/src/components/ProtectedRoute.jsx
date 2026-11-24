import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading text="Checking login..." />
  }

  if (!isLoggedIn) {

    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="state-box state-error">
        This page is for administrators only.
      </div>
    )
  }

  return children
}
