
# Ali Nasir — Dynamic Developer Portfolio

A modern, responsive, database-driven developer portfolio built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL.

## Overview

This project demonstrates a full-stack web application where portfolio projects are managed dynamically through a PostgreSQL database.

Users can add, view, edit, and delete projects through a responsive web interface. All changes are stored in NeonDB and persist after page refresh.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Next.js API Route Handlers
- Vercel

## Features

- Professional responsive portfolio design
- Dynamic project listing
- Add new projects
- Edit existing projects
- Delete projects
- PostgreSQL database integration
- Persistent data storage
- REST API endpoints
- Live deployment on Vercel

## Database Setup

Create a Neon PostgreSQL database and run:

```sql
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL
);
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
DATABASE_URL="your_neon_postgresql_connection_string"
```

Never commit `.env.local` or database credentials to GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/Dralinasir/ali-nasir-neon-portfolio.git
```

Navigate to the project:

```bash
cd ali-nasir-neon-portfolio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Retrieve all projects |
| POST | /api/projects | Add a project |
| PUT | /api/projects/:id | Update a project |
| DELETE | /api/projects/:id | Delete a project |

## Live Website

https://ali-nasir-neon-portfolio.vercel.app/

## GitHub Repository

https://github.com/Dralinasir/ali-nasir-neon-portfolio

## Assignment Demonstration

The application demonstrates database operations using Next.js API route handlers and Neon PostgreSQL.

Project records are fetched dynamically rather than hardcoded.

Changes made through the interface remain stored in the database after refreshing the website.

## Author

Ali Nasir

## Note

This application is an educational CRUD demonstration. Its project-management endpoints are publicly accessible and should be protected before use as a production portfolio.
