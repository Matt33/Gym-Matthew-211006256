# Gym Management System (API + React Frontend)

## Application description
This project is a **Gym Management System** with:

- **Backend**: ASP.NET Core Web API (with EF Core + PostgreSQL + JWT auth)
- **Frontend**: React (Vite) + React Router + Axios (`frontend/`)

The frontend lets users browse gym classes, and authorized users (Admin/Trainer) can create, edit, and delete classes.

## Setup instructions

### Backend (ASP.NET Core API)
1. Go to the backend folder:
   - `cd Gym-Project`
2. Install prerequisites:
   - .NET SDK (project targets .NET 8+)
   - PostgreSQL running locally (check `appsettings.json` connection settings)
3. (If using EF migrations) apply the database:
   - `dotnet tool install --global dotnet-ef`
   - `dotnet ef database update`
4. Run the API:
   - `dotnet run`

Default URLs (see `Properties/launchSettings.json`):
- `http://localhost:5108`
- `https://localhost:7196`

Swagger is available at:
- `http://localhost:<port>/swagger`

### Frontend (React + Vite)
1. Go to the frontend folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. (Optional) configure the API base URL:
   - Create `frontend/.env`:
     - `VITE_API_BASE_URL=http://localhost:5108`
4. Run the dev server:
   - `npm run dev`

Vite will print the local URL (usually `http://localhost:5173`).

## API routes used (from the React app)
The React app uses Axios (`frontend/src/services/apiClient.js`) to call these endpoints:

### Authentication
- `POST /api/auth/login` (login and receive JWT token)

### Gym Classes
- `GET /classes` (list all classes)
- `GET /classes/{id}` (get class details)
- `POST /classes` (create class)
- `PUT /classes/{id}` (update class)
- `DELETE /classes/{id}` (delete class)

### Trainers
- `GET /trainers` (load trainers for dropdowns/forms)

## More docs
- Backend documentation: `Gym-Project/README.md`
- Frontend documentation: `frontend/README.md`

