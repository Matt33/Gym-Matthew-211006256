import { useEffect, useState } from 'react'
import { getMyWorkoutPlans } from '../services/workoutPlanService'
import { getMyProgress } from '../services/userProgressService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyWorkoutPage() {
  const [plans, setPlans] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, progressData] = await Promise.all([
          getMyWorkoutPlans(),
          getMyProgress()
        ])
        setPlans(plansData)
        setProgress(progressData)
      } catch (err) {
        setError('Failed to load your workout plans and progress.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <h2>My Workout Plans</h2>
      <ErrorMessage message={error} />

      {!plans.length ? (
        <div className="card">
          <p className="muted">Your trainer hasn't created any workout plans for you yet.</p>
        </div>
      ) : (
        <div className="grid">
          {plans.map(p => (
            <div className="card" key={p.id}>
              <h3>{p.title}</h3>
              <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Assigned by: <strong>{p.trainerName}</strong>
              </p>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{p.description}</div>
              <p className="muted" style={{ fontSize: '0.75rem', marginTop: '1.5rem' }}>
                Last Updated: {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: '4rem' }}>My Progress History</h2>
      {!progress.length ? (
        <div className="card">
          <p className="muted">No progress records found yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table" style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr' }}>
            <div className="table__row table__head" style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr' }}>
              <div>Weight</div>
              <div>Notes</div>
              <div>Goals</div>
              <div>Date</div>
            </div>
            {progress.map(p => (
              <div className="table__row" key={p.id} style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr' }}>
                <div style={{ fontWeight: '600' }}>{p.weight ? `${p.weight} kg` : '-'}</div>
                <div style={{ fontSize: '0.875rem' }}>{p.performanceNotes}</div>
                <div style={{ fontSize: '0.875rem' }}>{p.goals}</div>
                <div className="muted">{new Date(p.recordedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
