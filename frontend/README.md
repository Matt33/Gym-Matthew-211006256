# Gym Management System - Frontend

A modern React application built with Vite, React Router, and Axios to manage gym classes and trainers.

## Application Description
This application provides a user-friendly interface for managing a gym's training schedule. Users can view available classes, while authorized trainers and admins can create, update, and delete class records. The UI features a premium dark-mode design with responsive layouts and real-time API integration.

## Setup Instructions

### Backend Setup
1. Navigate to the `Gym-Project` folder.
2. Ensure you have the .NET SDK installed.
3. Run `dotnet run` to start the backend API.
4. The API will typically be available at `http://localhost:5108`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root (optional):
   ```
   VITE_API_BASE_URL=http://localhost:5108
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

## API Routes Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Fetch all gym classes |
| GET | `/api/classes/{id}` | Fetch a specific gym class |
| POST | `/api/classes` | Create a new gym class |
| PUT | `/api/classes/{id}` | Update an existing gym class |
| DELETE | `/api/classes/{id}` | Delete a gym class |
| GET | `/trainers` | Fetch all trainers |
| POST | `/trainers` | Create a new trainer |
| PUT | `/trainers/{id}` | Update an existing trainer |
| DELETE | `/trainers/{id}` | Delete a trainer |
| GET | `/api/workout-plans` | Fetch workout plans |
| POST | `/api/workout-plans` | Create a workout plan |
| PUT | `/api/workout-plans/{id}` | Update a workout plan |
| DELETE | `/api/workout-plans/{id}` | Delete a workout plan |
| GET | `/api/progress` | Fetch user progress records |
| POST | `/api/progress` | Create a progress record |
| PUT | `/api/progress/{id}` | Update a progress record |
| DELETE | `/api/progress/{id}` | Delete a progress record |
| GET | `/api/sessions` | Fetch class sessions |
| POST | `/api/sessions` | Create a class session |
| PUT | `/api/sessions/{id}` | Update a class session |
| DELETE | `/api/sessions/{id}` | Delete a class session |
| POST | `/enrollments/{classId}` | Enroll in a class |
| DELETE | `/enrollments/{classId}` | Unenroll from a class |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

## Key Features
- **Client-side Routing**: Seamless navigation using React Router.
- **State Management**: Using `useState` and `useEffect` for data handling and loading states.
- **Axios Integration**: Robust API communication with error handling.
- **Controlled Forms**: Secure and validated form inputs for data entry.
- **Premium Design**: Custom CSS design system with glassmorphism and smooth animations.
