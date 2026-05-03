import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { ErrorMessage } from '../components/ErrorMessage'

export function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    hashedPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
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
      const payload = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim() || null
      }
      const data = await register(payload)
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
        setError('Registration failed: No token received.')
      }
    } catch (err) {
      const errData = err.response?.data
      console.error('Registration Error Data:', errData)

      if (errData?.errors) {
        // Handle ASP.NET Core validation errors (e.g. ModelState)
        const messages = Object.values(errData.errors).flat().join(', ')
        setError(messages)
      } else if (Array.isArray(errData)) {
        // Handle ASP.NET Identity errors
        setError(errData.map((e) => e.description || e.Description).join(', '))
      } else {
        setError(errData?.message || errData?.Message || err.message || 'Registration failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">First Name</label>
            <input
              className="input"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Last Name</label>
            <input
              className="input"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="hashedPassword"
              value={formData.hashedPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Phone Number (optional)</label>
            <input
              className="input"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>

          <button
            className="btn"
            style={{ width: '100%', marginTop: '1rem' }}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="muted" style={{ fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'underline' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
