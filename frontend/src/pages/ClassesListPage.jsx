import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteClass, getAllClasses } from '../services/gymClassesService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function ClassesListPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const sortNewestFirst = (items) =>
    [...items].sort((a, b) => {
      // Prefer a created/createdAt date if present; fallback to ID (newer rows usually have higher IDs).
      const aDate = a?.createdAt || a?.created_at || a?.createdOn
      const bDate = b?.createdAt || b?.created_at || b?.createdOn
      if (aDate && bDate) return new Date(bDate) - new Date(aDate)

      const aId = Number(a?.id ?? a?.Id ?? 0)
      const bId = Number(b?.id ?? b?.Id ?? 0)
      return bId - aId
    })

  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isTrainer = roles.includes('Trainer') || roles.includes('Admin')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllClasses()
      setClasses(sortNewestFirst(Array.isArray(data) ? data : []))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return
    try {
      await deleteClass(id)
      setClasses(classes.filter((c) => c.id !== id))
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(
          'Unauthorized. Please login as an Admin/Trainer (e.g. admin@test.com / Admin123! or trainer@test.com / Trainer123!) to delete classes.'
        )
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to delete class')
      }
    }
  }


  if (loading) return <Loading />

  return (
    <div>
      <div className="row row--space" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Gym Classes</h2>
          <p className="muted">View all available training classes.</p>
          {isTrainer && (
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              💡 To make these appear on the member schedule, go to{' '}
              <Link to="/trainer/sessions" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                Manage Sessions
              </Link>
            </p>
          )}
        </div>
        {isTrainer && (
          <Link to="/classes/new" className="btn">
            Add New Class
          </Link>
        )}
      </div>

      <ErrorMessage message={error} />

      {!classes.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>You haven't enrolled in any classes yet.</p>
          <Link to="/schedule" className="btn">
            Browse Schedule & Enroll
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table" style={{ gridTemplateColumns: isTrainer ? '2fr 1fr 1.5fr 1fr' : '2fr 1fr 1.5fr' }}>
            <div className="table__row table__head" style={{ gridTemplateColumns: isTrainer ? '2fr 1fr 1.5fr 1fr' : '2fr 1fr 1.5fr' }}>
              <div>Title</div>
              <div>Duration</div>
              <div>Trainer</div>
              {isTrainer && <div>Actions</div>}
            </div>
            {classes.map((c) => (
              <div className="table__row" key={c.id} style={{ gridTemplateColumns: isTrainer ? '2fr 1fr 1.5fr 1fr' : '2fr 1fr 1.5fr' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>{c.title}</span>
                </div>
                <div className="muted">{c.durationInMinutes} mins</div>
                <div>{c.trainerName || 'N/A'}</div>
                {isTrainer && (
                  <div className="row">
                    <Link className="btn btn--secondary btn--tiny" to={`/classes/${c.id}`}>
                      Edit
                    </Link>
                    <button 
                      className="btn btn--danger btn--tiny" 
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
