import { Link } from 'react-router-dom'

export function HomePage() {
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isTrainer = roles.includes('Trainer') || roles.includes('Admin')
  const isMember = roles.includes('Member')

  return (
    <div className="hero-page">
      <div className="hero-content">
        <h1>Welcome Back to <span>GYMSYSTEM</span></h1>
        <p className="muted">
          {isTrainer 
            ? "Manage your classes, track member progress, and create workout plans. You have full control over the gym's operations." 
            : "Check your schedule, enroll in new sessions, and follow your personalized workout plans. Let's hit your fitness goals!"}
        </p>
        
        <div className="row" style={{ marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <Link className="btn" to="/schedule">
            View Schedule
          </Link>
          
          {isMember && (
            <Link className="btn btn--secondary" to="/my-workout">
              My Workout Plan
            </Link>
          )}

          {isTrainer && (
            <>
              <Link className="btn btn--secondary" to="/trainer/sessions">
                Manage Sessions
              </Link>
              <Link className="btn btn--secondary" to="/classes/new">
                Create Class
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-media__frame">
          <img className="hero-media__img" src="/get-strong-safely.png" alt="Dashboard" />
        </div>
      </div>
    </div>
  )
}
