import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../services/profileService'
import { Loading } from '../components/Loading'
import { ErrorMessage } from '../components/ErrorMessage'

export function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data)
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || ''
        })
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        ...formData,
        phoneNumber: formData.phoneNumber?.trim() || null
      }
      const data = await updateProfile(payload)
      setProfile(data)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      <div className="card">
        <ErrorMessage message={error} />
        {success && <div className="alert alert--success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email (cannot be changed)</label>
            <input className="input" value={profile?.email || ''} disabled />
          </div>

          <div className="form-group">
            <label className="label">First Name</label>
            <input 
              className="input" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="label">Last Name</label>
            <input 
              className="input" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="label">Phone Number</label>
            <input 
              className="input" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label className="label">Roles</label>
            <div className="row" style={{ gap: '0.5rem' }}>
              {profile?.roles?.map(role => (
                <span key={role} className="btn btn--tiny btn--secondary" style={{ cursor: 'default' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>

          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
