import { useEffect, useState } from 'react'
import { getAllClasses } from '../services/gymClassesService'
import { getAllSessions, createSession, updateSession, deleteSession } from '../services/classSessionService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function ClassSessionsPage() {
  const [sessions, setSessions] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  
  const initialFormState = {
    gymClassId: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    location: '',
    maxCapacity: '20'
  }
  
  const [formData, setFormData] = useState(initialFormState)

  const refreshData = async () => {
    try {
      const [sessionsData, classesData] = await Promise.all([
        getAllSessions(),
        getAllClasses()
      ])
      setSessions(sessionsData)
      setClasses(classesData)
    } catch (err) {
      setError('Failed to load sessions and classes')
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

  const handleEdit = (session) => {
    setEditMode(true)
    setCurrentId(session.id)
    setFormData({
      gymClassId: session.gymClassId || '',
      sessionDate: session.sessionDate ? session.sessionDate.split('T')[0] : '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
      location: session.location || '',
      maxCapacity: session.maxCapacity || '20'
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
        gymClassId: parseInt(formData.gymClassId),
        maxCapacity: parseInt(formData.maxCapacity)
      }

      if (editMode) {
        await updateSession(currentId, payload)
      } else {
        await createSession(payload)
      }
      
      cancelEdit()
      await refreshData()
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'schedule'} session`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this session?')) return
    try {
      await deleteSession(id)
      await refreshData()
    } catch (err) {
      setError('Failed to delete session')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2>Manage Class Sessions</h2>
      
      <div className="card" style={{ marginBottom: '3rem' }}>
        <div className="row row--space">
          <h3>{editMode ? 'Edit Session' : 'Schedule New Session'}</h3>
          {editMode && (
            <button className="btn btn--secondary btn--tiny" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="grid">
            <div className="form-group">
              <label className="label">Class</label>
              <select className="select" name="gymClassId" value={formData.gymClassId} onChange={handleChange} required disabled={editMode}>
                <option value="">Select a class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Date</label>
              <input className="input" type="date" name="sessionDate" value={formData.sessionDate} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid">
             <div className="form-group">
              <label className="label">Start Time</label>
              <input className="input" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </div>
             <div className="form-group">
              <label className="label">End Time</label>
              <input className="input" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid">
            <div className="form-group">
              <label className="label">Location</label>
              <input className="input" name="location" value={formData.location} placeholder="Studio A" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Max Capacity</label>
              <input className="input" type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} />
            </div>
          </div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editMode ? 'Update Session' : 'Schedule Session'}
          </button>
        </form>
      </div>

      <h3>Current Schedule</h3>
      {!sessions.length ? (
        <div className="card">
          <p className="muted">No sessions scheduled.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table" style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 0.5fr' }}>
            <div className="table__row table__head" style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 0.5fr' }}>
              <div>Class</div>
              <div>Date</div>
              <div>Time</div>
              <div>Location</div>
              <div></div>
            </div>
            {sessions.map(s => (
              <div className="table__row" key={s.id} style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 0.5fr' }}>
                <div style={{ fontWeight: '600' }}>{s.gymClassTitle}</div>
                <div>{new Date(s.sessionDate).toLocaleDateString()}</div>
                <div className="muted">{s.startTime} - {s.endTime}</div>
                <div>{s.location || 'Main Gym'}</div>
                <div>
                  <div className="row">
                    <button className="btn btn--secondary btn--tiny" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn--danger btn--tiny" onClick={() => handleDelete(s.id)}>X</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
