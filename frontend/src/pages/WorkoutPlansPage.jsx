import { useEffect, useState } from 'react'
import { getAllMembers } from '../services/profileService'
import { getMyWorkoutPlans, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } from '../services/workoutPlanService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function WorkoutPlansPage() {
  const [plans, setPlans] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  
  const initialFormState = {
    title: '',
    description: '',
    userId: ''
  }
  
  const [formData, setFormData] = useState(initialFormState)

  const refreshData = async () => {
    try {
      const [plansData, membersData] = await Promise.all([
        getMyWorkoutPlans(),
        getAllMembers()
      ])
      setPlans(plansData)
      setMembers(membersData)
    } catch (err) {
      setError('Failed to load workout plans and members')
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

  const handleEdit = (plan) => {
    setEditMode(true)
    setCurrentId(plan.id)
    setFormData({
      title: plan.title || '',
      description: plan.description || '',
      userId: plan.userId || ''
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
        await updateWorkoutPlan(currentId, formData)
      } else {
        await createWorkoutPlan(formData)
      }
      cancelEdit()
      await refreshData()
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} workout plan`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return
    try {
      await deleteWorkoutPlan(id)
      await refreshData()
    } catch (err) {
      setError('Failed to delete workout plan')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2>Manage Workout Plans</h2>
      
      <div className="card" style={{ marginBottom: '3rem' }}>
        <div className="row row--space">
          <h3>{editMode ? 'Edit Workout Plan' : 'Create New Plan'}</h3>
          {editMode && (
            <button className="btn btn--secondary btn--tiny" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="label">Member</label>
            <select className="select" name="userId" value={formData.userId} onChange={handleChange} required disabled={editMode}>
              <option value="">Select a member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Plan Title</label>
            <input className="input" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Description / Exercises</label>
            <textarea className="textarea" name="description" value={formData.description} onChange={handleChange} rows="4" required />
          </div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editMode ? 'Update Plan' : 'Create Plan'}
          </button>
        </form>
      </div>

      <h3>My Created Plans</h3>
      {!plans.length ? (
        <div className="card">
          <p className="muted">You haven't created any workout plans yet.</p>
        </div>
      ) : (
        <div className="grid">
          {plans.map(p => (
            <div className="card" key={p.id}>
              <div className="row row--space">
                <h3>{p.title}</h3>
                <div className="row">
                  <button className="btn btn--secondary btn--tiny" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn--danger btn--tiny" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
              <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                For: <strong>{p.userName}</strong>
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{p.description}</p>
              <p className="muted" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                Created: {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
