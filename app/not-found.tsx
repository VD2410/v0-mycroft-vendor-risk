export default function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Go back home</a>
      </div>
    </div>
  )
}
