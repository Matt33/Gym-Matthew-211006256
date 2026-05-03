import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClass } from '../services/gymClassesService'
import { getAllTrainers } from '../services/trainersService'
import { ErrorMessage } from '../components/ErrorMessage'

export function ClassCreatePage() {
  const navigate = useNavigate()
  const [trainers, setTrainers] = useState([])
  const [loadingTrainers, setLoadingTrainers] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    durationInMinutes: 60,
    trainerId: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Create is protected (Admin/Trainer). If there's no token, send user to login.
    const token = localStorage.getItem('jwt')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchTrainers = async () => {
      try {
        const data = await getAllTrainers()
        setTrainers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load trainers', err)
      } finally {
        setLoadingTrainers(false)
      }
    }
    fetchTrainers()
  }, [])

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
    setSuccess('')
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        durationInMinutes: Number(formData.durationInMinutes),
        trainerId: Number(formData.trainerId),
      }
      await createClass(payload)
      setSuccess('Class created successfully! Redirecting...')
      setTimeout(() => navigate('/classes'), 2000)
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(
          'Unauthorized. Please login as an Admin/Trainer (e.g. admin@test.com / Admin123! or trainer@test.com / Trainer123!) and try again.'
        )
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create class')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="row row--space" style={{ marginBottom: '2rem' }}>
        <h2>Create New Class</h2>
        <Link className="btn btn--secondary btn--tiny" to="/classes">
          Back to List
        </Link>
      </div>

      <div className="card">
        <ErrorMessage message={error} />
        {success && <div className="alert alert--success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Class Title</label>
            <input
              className="input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Yoga Flow"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="label">Duration (minutes)</label>
            <input
              className="input"
              type="number"
              name="durationInMinutes"
              value={formData.durationInMinutes}
              onChange={handleChange}
              min={10}
              max={300}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Trainer</label>
            <select
              className="select"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              required
            >
              <option value="">
                {loadingTrainers ? 'Loading trainers...' : 'Select a trainer'}
              </option>
              {trainers.map((t) => (
                <option key={t.id || t.Id} value={t.id || t.Id}>
                  {t.name || t.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="row" style={{ marginTop: '2rem' }}>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Class'}
            </button>
            <Link className="btn btn--secondary" to="/classes">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
