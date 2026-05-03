import { NavLink, useNavigate } from 'react-router-dom'

const linkClassName = ({ isActive }) =>
  `nav__link${isActive ? ' nav__link--active' : ''}`

export function NavBar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('jwt')
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  
  const isLoggedIn = !!token
  const isTrainer = roles.includes('Trainer') || roles.includes('Admin')
  const isMember = roles.includes('Member')

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('roles')
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="container row row--space">
        <NavLink to="/" className="nav__brand">
          GYM<span>SYSTEM</span>
        </NavLink>
        <div className="nav__links row">
          <NavLink to="/" className={linkClassName}>
            Home
          </NavLink>
          
          <NavLink to="/schedule" className={linkClassName}>
            Schedule
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/profile" className={linkClassName}>
              Profile
            </NavLink>
          )}

          {isMember && (
            <>
              <NavLink to="/my-classes" className={linkClassName}>
                My Classes
              </NavLink>
              <NavLink to="/my-workout" className={linkClassName}>
                My Workout
              </NavLink>
            </>
          )}

          {isTrainer && (
            <>
              <NavLink to="/trainer/sessions" className={linkClassName}>
                Sessions
              </NavLink>
              <NavLink to="/trainer/workout-plans" className={linkClassName}>
                Plans
              </NavLink>
              <NavLink to="/trainer/progress" className={linkClassName}>
                Progress
              </NavLink>
            </>
          )}

          <NavLink to="/classes" className={linkClassName}>
            Classes
          </NavLink>

          {isLoggedIn ? (
            <button
              className="btn btn--tiny btn--secondary"
              onClick={handleLogout}
              style={{ marginLeft: '0.5rem' }}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className={linkClassName}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn--tiny">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
