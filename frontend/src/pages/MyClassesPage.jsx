import { useEffect, useState } from 'react'
import { getMyClasses, unenrollFromClass } from '../services/enrollmentService'
import { getAllSessions } from '../services/classSessionService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyClassesPage() {
  const [enrollments, setEnrollments] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [enrolledData, sessionsData] = await Promise.all([
        getMyClasses(),
        getAllSessions()
      ])
      setEnrollments(enrolledData)
      setSessions(sessionsData)
    } catch (err) {
      setError('Failed to load classes and schedule')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUnenroll = async (gymClassId) => {
    if (!window.confirm('Are you sure you want to unenroll from this class?')) return
    setError('')
    try {
      await unenrollFromClass(gymClassId)
      await fetchData()
    } catch (err) {
      setError('Failed to unenroll from class')
    }
  }

  if (loading) return <Loading />

  // Filter sessions for classes user is enrolled in
  const enrolledClassIds = enrollments.map(e => e.gymClassId)
  const mySchedule = sessions.filter(s => enrolledClassIds.includes(s.gymClassId))

  return (
    <div>
      <h2>My Enrolled Classes</h2>
      <ErrorMessage message={error} />

      {!enrollments.length ? (
        <div className="card">
          <p className="muted">You are not enrolled in any classes yet.</p>
        </div>
      ) : (
        <div className="grid">
          {enrollments.map(e => (
            <div className="card" key={e.gymClassId}>
              <div className="row row--space">
                <h3>{e.gymClassTitle}</h3>
                <button className="btn btn--danger btn--tiny" onClick={() => handleUnenroll(e.gymClassId)}>
                  Unenroll
                </button>
              </div>
              <p className="muted" style={{ marginTop: '0.5rem' }}>Enrolled on: {new Date(e.enrollmentDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: '3rem' }}>My Class Schedule</h2>
      {!mySchedule.length ? (
        <div className="card">
          <p className="muted">No upcoming sessions for your enrolled classes.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table">
            <div className="table__row table__head">
              <div>Class</div>
              <div>Date</div>
              <div>Time</div>
              <div>Location</div>
            </div>
            {mySchedule.map(s => (
              <div className="table__row" key={s.id}>
                <div style={{ fontWeight: '600' }}>{s.gymClassTitle}</div>
                <div>{new Date(s.sessionDate).toLocaleDateString()}</div>
                <div className="muted">{s.startTime} - {s.endTime}</div>
                <div>{s.location || 'Main Gym'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
