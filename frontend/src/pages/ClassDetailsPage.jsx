import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteClass, getClassById, updateClass } from '../services/gymClassesService'
import { getAllTrainers } from '../services/trainersService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function ClassDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [trainers, setTrainers] = useState([])
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    durationInMinutes: 60,
    trainerId: '',
  })

  useEffect(() => {
    // Edit is protected (Admin/Trainer). If there's no token, send user to login.
    const token = localStorage.getItem('jwt')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const [classData, trainersData] = await Promise.all([
          getClassById(id),
          getAllTrainers()
        ])
        
        setFormData({
          title: classData.title,
          durationInMinutes: classData.durationInMinutes,
          trainerId: classData.trainerId || '',
        })
        setTrainers(trainersData)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load data')
      } finally {
        setLoading(false)
        setLoadingTrainers(false)
      }
    }
    fetchData()
  }, [id])

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
    setSaving(true)
    try {
      const payload = {
        ...formData,
        durationInMinutes: Number(formData.durationInMinutes),
        trainerId: Number(formData.trainerId),
      }
      await updateClass(id, payload)
      setSuccess('Class updated successfully!')
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(
          'Unauthorized. Please login as an Admin/Trainer (e.g. admin@test.com / Admin123! or trainer@test.com / Trainer123!) and try again.'
        )
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update class')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this class?')) return
    try {
      await deleteClass(id)
      navigate('/classes')
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(
          'Unauthorized. Please login as an Admin/Trainer (e.g. admin@test.com / Admin123! or trainer@test.com / Trainer123!) and try again.'
        )
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to delete class')
      }
    }
  }

  if (loading) return <Loading />

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="row row--space" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Edit Class</h2>
          <p className="muted">Viewing and managing <strong>{formData.title}</strong></p>
        </div>
        <div className="row">
          <Link className="btn btn--secondary btn--tiny" to="/classes">
            Back to List
          </Link>
          <button className="btn btn--danger btn--tiny" onClick={handleDelete}>
            Delete Class
          </button>
        </div>
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
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Changes'}
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
