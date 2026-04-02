# Gym Management System API

This is a comprehensive Web API for a Gym Management System, built as the foundation for a university course project.

## How to Run the Project

1. **Pre-requisites:** 
   - Ensure you have the [.NET 8 SDK](https://dotnet.microsoft.com/download) (or later) installed.
   - Install **PostgreSQL** locally (usually on port 5432) and ensure the Postgres service is running. You should have a superuser named `postgres` with the password configured to match `appsettings.json`.
2. **Database Setup:**
   - Open a terminal in the project root directory (where `WebApplication3.csproj` is located).
   - Ensure Entity Framework tools are installed: `dotnet tool install --global dotnet-ef`
   - Create the database by running: `dotnet ef database update`
3. **Execution:**
   - Run the API with: `dotnet run`
   - Navigate to the **Swagger UI** (found at `http://localhost:<port>/swagger` or via your browser launch settings) to interact with the API endpoints.

## Technologies Used

- **ASP.NET Core Web API:** The framework used to create the RESTful HTTP services.
- **Entity Framework Core (EF Core):** The Object-Relational Mapper (ORM) used for database access and migrations.
- **PostgreSQL (Npgsql):** The relational database used to store entity data.
- **ASP.NET Core Identity:** The membership system for managing user logins, passwords, and role-based access.
- **JWT (JSON Web Tokens):** For stateless authentication and role-based endpoint protection.

## Security: HTTP-Only Cookies vs Headers

**Why are HTTP-only cookies commonly used as an industry standard for authentication security?**

While this API provides the JWT token string directly in the response body (allowing clients to store it in `localStorage` and send it via the `Authorization` header), it is often considered much safer to use **HTTP-only Cookies**.

When a token is stored in browser `localStorage`, it is accessible by any JavaScript running on the page. This makes the application highly vulnerable to **Cross-Site Scripting (XSS)** attacks, where a malicious script can effortlessly steal the token and impersonate the user. 

By contrast, an **HTTP-only cookie** explicitly instructs the browser that the cookie cannot be accessed via JavaScript (`document.cookie`). When the browser makes a request to the server, it automatically attaches the cookie, securing the session from XSS attacks entirely. This is why HTTP-only cookies are the gold standard for secure, web-based authentication sessions.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to obtain a JWT token

### Gym Classes
- `GET /classes` - Retrieve all gym classes
- `GET /classes/{id}` - Retrieve a specific gym class
- `POST /classes` - Add a new gym class (Admin, Trainer)
- `PUT /classes/{id}` - Update a gym class (Admin, Trainer)
- `DELETE /classes/{id}` - Delete a gym class (Admin, Trainer)
- `GET /classes/trainer/{trainerId}` - Retrieve gym classes for a specific trainer

### Trainers
- `GET /trainers` - Retrieve all trainers
- `GET /trainers/{id}` - Retrieve a specific trainer
- `POST /trainers` - Add a new trainer (Admin)
- `PUT /trainers/{id}` - Update a trainer (Admin)
- `DELETE /trainers/{id}` - Delete a trainer (Admin)

### Enrollments
- `POST /enrollments/{gymClassId}` - Enroll the authenticated user in a gym class
- `GET /enrollments/my-classes` - Retrieve enrollments for the authenticated user
