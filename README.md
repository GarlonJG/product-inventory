# Product Inventory Management System

A full-stack web application for managing product inventory with a modern React frontend and Node.js backend.

<WIP as of 9/20/2025 - Currently in active development. See 'Still to Come' section below for upcoming features and improvements.>

## Still to Come
- Additional layout + Grid styling
- Additional options/settings for the inventory grid
- Role-based access control
- Data import functionality

## Features

- **User Authentication**: Secure login/logout with JWT token management
- **Product Management**: Add, view, edit, and delete products with full CRUD operations
- **Form Validation**: Comprehensive client and server-side validation using Zod
- **Responsive UI**: Built with Material-UI for a clean, modern interface
- **Data Grid**: Interactive data table with exporting, printing, sorting, filtering, and pagination
- **Database Management**: SQLite database with Prisma ORM for easy data management
- **Protected Routes**: Secure client-side routing with authentication checks
- **Testing**: Integrated Unit and Component testins with Jest and React Testing Library and Cypress
- **API Documentation**: Integrated API documentation with Swagger
- **Security**: Implemented security measures including rate limiting, input sanitization, and authentication

## Tech Stack

### Frontend
- React 19
- Vite (Build Tool)
- Material-UI (MUI) v7
- React Hook Form with Zod validation
- Emotion (for styling)
- Redux Toolkit RTK Query (data fetching and caching)
- React Router v6 (client-side routing)
- JWT Authentication

### Backend
- Node.js
- Prisma (ORM)
- SQLite (Database)
- NestJS (Framework)
- Zod for runtime validation
- JWT Authentication
- Middleware implemented for sanitization (DOMPurify) and security (helmet, rate-limit)

## Key Components

### Authentication
- JWT-based authentication system
- Protected routes with role-based access control
- Persistent login sessions
- Secure token storage

### User Interface
- Responsive layout with Material-UI
- Interactive user menu with profile and logout options
- Modern form handling with validation
- Intuitive data grid for product management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GarlonJG/product-inventory.git
   cd product-inventory
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up the database:
   ```bash
   # Navigate to server directory if not already there
   cd server
   
   # Create and seed the database
   npx prisma migrate dev --name init
   
   # (Optional) Start Prisma Studio to view/edit the database
   # npx prisma studio
   ```

4. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories
   - Refer to `.env.example` files for required variables
   - For the server, ensure you have a valid `DATABASE_URL` and `JWT_SECRET` in your `.env` file

### Running the Application

Start both frontend and backend servers with a single command from project root folder:
```bash
npm run start
```

This will start:
- Frontend development server at `http://localhost:3000`
- Backend server at `http://localhost:5000`

## Available Scripts

- `npm run start:dev`: Start both frontend and backend in development mode
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint for code quality checks
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Project Structure

```
product-inventory/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── assets/        # Assets
│       ├── features/      # Feature modules
│       ├── layouts/       # Layout components
│       ├── routes/        # Application routes
│       ├── styles/        # Styles
│       ├── App.jsx        # Main App component
│       └── main.jsx       # Entry point
├── server/                # Backend server
│   ├── prisma/           # Prisma schema and migrations
│   │   └── migrations/   # Database migrations
│   ├── src/              # Server source code
│   │   ├── modules/      # Feature modules
│   │   └── main.ts       # Application entry point
│   └── package.json      # Server dependencies
├── shared/                # Shared code between frontend and backend
│   └── validations/      # Shared validation schemas
├── .gitignore
└── package.json          # Root project configuration
```

## Available Scripts

- `npm run start:dev`: Start both frontend and backend in development mode
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint for code quality checks
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material-UI](https://mui.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Prisma](https://www.prisma.io/)
- [NestJS](https://nestjs.com/)
