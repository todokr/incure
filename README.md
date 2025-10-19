# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Project Structure

```
.
├── app/                    # Main application code
│   ├── consumer/          # Event consumer setup
│   │   └── index.ts       # Event subscriber initialization → feature/automation
│   ├── routes/            # React Router routes
│   │   └── home.tsx       # Home page route
│   ├── entry.client.tsx   # Client-side entry point
│   ├── entry.server.tsx   # Server-side entry point
│   ├── root.tsx           # Root component
│   ├── routes.ts          # Route configuration
│   ├── app.css           # Global styles
│   └── slackApi.tsx       # Slack API integration
├── feature/               # Feature modules
│   ├── general/           # General types and utilities
│   │   ├── color.type.ts
│   │   └── user.type.ts
│   └── incident/          # Incident management
│       ├── incident.repository.ts
│       ├── incident.service.ts
│       ├── incident.type.ts
│       └── index.ts
├── gen/                   # Generated files
│   └── dbTypes.ts         # Database type definitions
├── lib/                   # Shared libraries
│   ├── db.server.ts       # Database connection
│   └── event.server.ts    # Event publishing/subscribing
├── db/                    # Database related files
│   ├── schema.sql         # Database schema
│   ├── seed.sql           # Sample data
│   └── trigger.sql        # Database triggers for events
├── public/                # Static assets
│   └── favicon.ico
├── compose.yml            # Docker Compose configuration
├── Dockerfile             # Docker build configuration
├── mise.toml              # Development environment setup
├── package.json           # Node.js dependencies
├── pnpm-lock.yaml         # Package lock file
├── pnpm-workspace.yaml    # Workspace configuration
├── react-router.config.ts # React Router configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## Architecture

This application uses:
- **React Router** for routing and SSR
- **PostgreSQL** with event-driven architecture using NOTIFY/LISTEN
- **TypeScript** for type safety
- **Event-driven communication** between components
- **Docker** for containerization

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
