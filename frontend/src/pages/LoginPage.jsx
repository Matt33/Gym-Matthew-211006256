import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { ErrorMessage } from '../components/ErrorMessage'

export function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await login(formData.email, formData.password)
      const token = data?.token ?? data?.Token
      if (token) {
        localStorage.setItem('jwt', token)
        // Store roles if returned
        const roles = data?.roles ?? data?.Roles
        if (roles) {
          localStorage.setItem('roles', JSON.stringify(roles))
        }
        navigate('/')
      } else {
        setError('Login failed: No token received.')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.Message || err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. you@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem' }} 
            type="submit" 
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="muted" style={{ fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
