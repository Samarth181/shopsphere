export default function ErrorMessage({ message, variant = 'error' }) {
  if (!message) {
    return null
  }
  return (
    <div className={variant === 'success' ? 'state-box state-success' : 'state-box state-error'}>
      {message}
    </div>
  )
}
