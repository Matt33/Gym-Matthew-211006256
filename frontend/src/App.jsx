import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ClassesListPage } from './pages/ClassesListPage.jsx'
import { ClassCreatePage } from './pages/ClassCreatePage.jsx'
import { ClassDetailsPage } from './pages/ClassDetailsPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { MyClassesPage } from './pages/MyClassesPage.jsx'
import { WorkoutPlansPage } from './pages/WorkoutPlansPage.jsx'
import { UserProgressPage } from './pages/UserProgressPage.jsx'
import { ClassSessionsPage } from './pages/ClassSessionsPage.jsx'
import { SchedulePage } from './pages/SchedulePage.jsx'
import { MyWorkoutPage } from './pages/MyWorkoutPage.jsx'
import { TrainersPage } from './pages/TrainersPage.jsx'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwt')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/my-classes" element={<MyClassesPage />} />
        <Route path="/my-workout" element={<MyWorkoutPage />} />
        
        {/* Trainer Routes */}
        <Route path="/trainer/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/trainer/progress" element={<UserProgressPage />} />
        <Route path="/trainer/sessions" element={<ClassSessionsPage />} />
        <Route path="/trainers" element={<TrainersPage />} />

        <Route path="/classes" element={<ClassesListPage />} />
        <Route path="/classes/new" element={<ClassCreatePage />} />
        <Route path="/classes/:id" element={<ClassDetailsPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
