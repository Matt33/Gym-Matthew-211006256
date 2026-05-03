export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="alert alert--error">
      <strong>Error:</strong> {message}
    </div>
  )
}
