import { useEffect, useState } from 'react'
import { getAllSessions } from '../services/classSessionService'
import { getAllClasses } from '../services/gymClassesService'
import { enrollInClass } from '../services/enrollmentService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function SchedulePage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const token = localStorage.getItem('jwt')
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isMember = roles.includes('Member')

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions()
        setSessions(data)
      } catch (err) {
        setError('Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const handleEnroll = async (classId) => {
    if (!token) {
      setError('Please login to enroll in classes.')
      return
    }
    setError('')
    setSuccess('')
    try {
      await enrollInClass(classId)
      setSuccess('Successfully enrolled in class!')
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. You might already be enrolled.')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="row row--space" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Gym Schedule</h2>
          <p className="muted">Explore all classes and upcoming sessions.</p>
        </div>
      </div>

      <ErrorMessage message={error} />
      {success && <div className="alert alert--success">{success}</div>}

      <div className="card" style={{ padding: '0' }}>
        <div className="table" style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}>
          <div className="table__row table__head" style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}>
            <div>Class</div>
            <div>Date</div>
            <div>Time</div>
            <div>Location</div>
            <div>Action</div>
          </div>
          
          {/* List all sessions */}
          {sessions.map(s => (
            <div className="table__row" key={`session-${s.id}`} style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}>
              <div style={{ fontWeight: '600' }}>{s.gymClassTitle}</div>
              <div>{new Date(s.sessionDate).toLocaleDateString()}</div>
              <div className="muted">{s.startTime} - {s.endTime}</div>
              <div>{s.location || 'Main Gym'}</div>
              <div>
                {isMember && (
                  <button className="btn btn--tiny" onClick={() => handleEnroll(s.gymClassId)}>
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
