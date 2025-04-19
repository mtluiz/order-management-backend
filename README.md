# Order Management Backend

A simple, clean REST API for managing projects and service orders with user authentication.

## What This Project Does

This app helps you manage projects and their related service orders. You can:

- Create and manage projects
- Track service orders associated with projects
- Control user access with simple authentication
- Set different permissions for regular users and admins

## Tech We're Using

- NestJS and TypeScript
- MySQL database with Prisma
- JWT for user authentication
- Docker for containerization

## Quick Start Guide

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/order-management-backend.git
   cd order-management-backend
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   Your API will be running at http://localhost:3000

### Manual Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/order-management-backend.git
   cd order-management-backend
   pnpm install
   ```

2. **Set up your environment**
   
   Create a `.env` file with:
   ```
   API_HOST=0.0.0.0
   API_PORT=3000
   DATABASE_URL="mysql://username:password@localhost:3306/order_management"
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

3. **Set up the database**
   ```bash
   # Create your database
   mysql -u root -p -e "CREATE DATABASE order_management;"
   
   # Generate Prisma client and run migrations
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

4. **Start the app**
   ```bash
   pnpm start:dev
   ```

   Your API will be running at http://localhost:3000

### Using the API

Once running, you can:

1. **Create a user account**
   ```bash
   curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{
     "email": "you@example.com", 
     "password": "yourpassword", 
     "name": "Your Name"
   }'
   ```

2. **Log in to get your access token**
   ```bash
   curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{
     "email": "you@example.com", 
     "password": "yourpassword"
   }'
   ```

3. **Use your token for other requests**
   ```bash
   curl http://localhost:3000/projects -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Main Features

- **Projects**: Create, view, edit, and delete projects
- **Service Orders**: Manage service orders attached to projects
- **User Accounts**: Register, login, update profile
- **Role-based Access**: Admin users get extra permissions

### API Documentation

Browse the full API at http://localhost:3000/api when the app is running.

## Project Structure

The code follows clean architecture principles with these main folders:

- `src/domain`: Core business models
- `src/application`: Business logic
- `src/interfaces`: Data transfer objects
- `src/infrastructure`: External concerns like database and web

## License

MIT License
