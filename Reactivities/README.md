# Reactivities

Reactivities is a full-stack social events application built with **ASP.NET Core (C#)** on the backend and **React + TypeScript** on the frontend.  
Users can create, join, and manage activities while interacting with others in real time.

## Features

- **Authentication & Authorization** with ASP.NET Identity + JWT
- **Email confirmation & password reset**
- **Create, edit, and join activities**
- **Live chat** via SignalR
- **Image upload** (Cloudinary integration)
- **User profiles & following system**
- **Secure API with role-based access**
- **SQL Server in Docker** for local development

## Authentication Flow

1. User registers → confirmation email sent  
2. User clicks the link → backend verifies token → email confirmed  
3. Login with JWT tokens stored in HTTP-only cookies  
4. Reset password flow supported (email with reset link + token)

## Tech Stack

- **Backend:** ASP.NET Core 9, Entity Framework Core, Identity
- **Frontend:** React 19, TypeScript, Vite, Material UI, React Query
- **Database:** SQL Server (Docker container)
- **Real-time:** SignalR
- **Cloud:** Cloudinary (image uploads)
- **Auth:** JWT + Identity
- **Email:** .NET IEmailSender

## Project Structure
``` 
Reactivities/
│── API/ # ASP.NET Core Web API
│── Application/ # Application layer (CQRS, business logic)
│── Domain/ # Entities and core domain models
│── Persistence/ # EF Core DbContext and migrations
│── client/ # React + TypeScript frontend
│── Infrastructure/ # External services (Email, Cloudinary)
│── docker-compose.yml
│── README.md
│── SETUP.md
│── LICENSE.md
```

## Installation

See [SETUP.md](SETUP.md) for more detail. Here is a short version:

```bash
# Clone repository
git clone https://github.com/fatihakb01/Reactivities.git
cd Reactivities

# Start SQL Server in Docker
docker-compose up -d

# Apply EF Core migrations
dotnet ef database update -p Persistence -s API

# Run backend
cd API
dotnet run

# Run frontend (seperate terminal)
cd client
npm install
npm run dev

```

## Security
- JWT tokens stored in secure HTTP-only cookies
- Identity for password hashing & user management
- Email confirmation required before login
- Rate-limiting & validation for requests
- EF Core prevents SQL injection

## Contributing

Contributions are welcome!
1. Fork the repository
2. Create a new feature branch (git checkout -b feature/my-feature)
3. Commit changes and push
4. Open a Pull Request

## License

This project is licensed under the MIT License. 
See [LICENSE.md](./LICENSE.md).
