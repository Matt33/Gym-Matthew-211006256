import { useEffect, useState } from 'react'
import { getAllMembers } from '../services/profileService'
import { getAllProgress, createProgress, updateProgress, deleteProgress } from '../services/userProgressService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function UserProgressPage() {
  const [progressRecords, setProgressRecords] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  
  const initialFormState = {
    userId: '',
    weight: '',
    performanceNotes: '',
    goals: ''
  }
  
  const [formData, setFormData] = useState(initialFormState)

  const refreshData = async () => {
    try {
      const [progressData, membersData] = await Promise.all([
        getAllProgress(),
        getAllMembers()
      ])
      setProgressRecords(progressData)
      setMembers(membersData)
    } catch (err) {
      setError('Failed to load progress records')
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

  const handleEdit = (progress) => {
    setEditMode(true)
    setCurrentId(progress.id)
    setFormData({
      userId: progress.userId || '',
      weight: progress.weight ? progress.weight.toString() : '',
      performanceNotes: progress.performanceNotes || '',
      goals: progress.goals || ''
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
      const payload = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null
      }
      
      if (editMode) {
        await updateProgress(currentId, payload)
      } else {
        await createProgress(payload)
      }
      
      cancelEdit()
      await refreshData()
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'record'} progress`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try {
      await deleteProgress(id)
      await refreshData()
    } catch (err) {
      setError('Failed to delete progress record')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2>Monitor User Progress</h2>
      
      <div className="card" style={{ marginBottom: '3rem' }}>
        <div className="row row--space">
          <h3>{editMode ? 'Edit Progress Record' : 'Record New Progress'}</h3>
          {editMode && (
            <button className="btn btn--secondary btn--tiny" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="label">Member</label>
              <select className="select" name="userId" value={formData.userId} onChange={handleChange} required disabled={editMode}>
                <option value="">Select a member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Weight (kg)</label>
              <input className="input" type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Performance Notes</label>
            <input className="input" name="performanceNotes" value={formData.performanceNotes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="label">Next Goals</label>
            <input className="input" name="goals" value={formData.goals} onChange={handleChange} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editMode ? 'Update Progress' : 'Record Progress'}
          </button>
        </form>
      </div>

      <h3>Recent Progress Records</h3>
      {!progressRecords.length ? (
        <div className="card">
          <p className="muted">No progress records found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table" style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr 1fr 0.5fr' }}>
             <div className="table__row table__head" style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr 1fr 0.5fr' }}>
              <div>Member</div>
              <div>Weight</div>
              <div>Notes</div>
              <div>Goals</div>
              <div>Date</div>
              <div></div>
            </div>
            {progressRecords.map(p => (
              <div className="table__row" key={p.id} style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr 1fr 0.5fr' }}>
                <div style={{ fontWeight: '600' }}>{p.userName}</div>
                <div className="muted">{p.weight ? `${p.weight} kg` : '-'}</div>
                <div style={{ fontSize: '0.875rem' }}>{p.performanceNotes}</div>
                <div style={{ fontSize: '0.875rem' }}>{p.goals}</div>
                <div className="muted" style={{ fontSize: '0.8125rem' }}>{new Date(p.recordedAt).toLocaleDateString()}</div>
                <div className="row">
                  <button className="btn btn--secondary btn--tiny" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn--danger btn--tiny" onClick={() => handleDelete(p.id)}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
