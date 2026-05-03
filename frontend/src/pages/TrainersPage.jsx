import { useEffect, useState } from 'react'
import { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } from '../services/trainersService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function TrainersPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  
  const initialFormState = {
    name: '',
    specialization: '',
    birthDate: '',
    bio: '',
    certifications: ''
  }
  
  const [formData, setFormData] = useState(initialFormState)

  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isAdmin = roles.includes('Admin')

  const refreshData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllTrainers()
      setTrainers(data || [])
    } catch (err) {
      setError('Failed to load trainers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (trainer) => {
    setEditMode(true)
    setCurrentId(trainer.id)
    setFormData({
      name: trainer.name || '',
      specialization: trainer.specialization || '',
      birthDate: trainer.birthDate ? trainer.birthDate.split('T')[0] : '',
      bio: trainer.bio || '',
      certifications: trainer.certifications || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditMode(false)
    setCurrentId(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (editMode) {
        await updateTrainer(currentId, formData)
      } else {
        await createTrainer({
          ...formData,
          birthDate: formData.birthDate || new Date().toISOString()
        })
      }
      cancelEdit()
      await refreshData()
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} trainer`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return
    try {
      await deleteTrainer(id)
      await refreshData()
    } catch (err) {
      setError('Failed to delete trainer')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="row row--space" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Gym Trainers</h2>
          <p className="muted">Meet our expert trainers.</p>
        </div>
      </div>

      <ErrorMessage message={error} />

      {isAdmin && (
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div className="row row--space">
            <h3>{editMode ? 'Edit Trainer' : 'Add New Trainer'}</h3>
            {editMode && (
              <button className="btn btn--secondary btn--tiny" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="grid">
              <div className="form-group">
                <label className="label">Name</label>
                <input className="input" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Specialization</label>
                <input className="input" name="specialization" value={formData.specialization} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Birth Date</label>
              <input className="input" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Bio</label>
              <textarea className="textarea" name="bio" value={formData.bio} onChange={handleChange} rows="3" />
            </div>
            <div className="form-group">
              <label className="label">Certifications</label>
              <input className="input" name="certifications" value={formData.certifications} onChange={handleChange} />
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editMode ? 'Update Trainer' : 'Add Trainer'}
            </button>
          </form>
        </div>
      )}

      {!trainers.length ? (
        <div className="card">
          <p className="muted">No trainers found.</p>
        </div>
      ) : (
        <div className="grid">
          {trainers.map(t => (
            <div className="card" key={t.id}>
              <div className="row row--space">
                <h3>{t.name}</h3>
                {isAdmin && (
                  <div className="row">
                    <button className="btn btn--secondary btn--tiny" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="btn btn--danger btn--tiny" onClick={() => handleDelete(t.id)}>Delete</button>
                  </div>
                )}
              </div>
              <p className="muted" style={{ marginBottom: '1rem' }}>
                {t.specialization || 'General Trainer'}
              </p>
              {t.bio && <p style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{t.bio}</p>}
              {t.certifications && (
                <div>
                  <strong>Certifications:</strong>
                  <p className="muted">{t.certifications}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
