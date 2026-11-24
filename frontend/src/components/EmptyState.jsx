export default function EmptyState({ message, children }) {
  return (
    <div className="state-box">
      <p>{message}</p>
      {children}
    </div>
  )
}
