# Product Inventory Management System

A full-stack web application for managing product inventory with a modern React frontend and Node.js backend.

<WIP as of 9/8/2025 - Currently in active development. See 'Still to Come' section below for upcoming features and improvements.>

## Still to Come
- Additional Backend and FrontEnd validations
- Additional layout + Grid styling
- Additional options/settings for the inventory grid
- User authentication and authorization
- Role-based access control
- Data import/export functionality

## Features

- **Product Management**: Add, view, edit, and delete products
- **Responsive UI**: Built with Material-UI for a clean, modern interface
- **Data Grid**: Interactive data table with exporting, printing, sorting, filtering, and pagination
- **Database Management**: SQLite database with Prisma ORM for easy data management

## Tech Stack

### Frontend
- React 19
- Vite (Build Tool)
- Material-UI (MUI) v7
- React Hook Form
- Emotion (for styling)

### Backend
- Node.js
- Prisma (ORM)
- SQLite (Database)
- NestJS (Framework)
  
## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GarlonJG/product-inventory.git
   cd product-inventory
   ```

2. Install dependencies:
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
   - Create `.env` files in both `client` and `server` directories as needed
   - Refer to `.env.example` files for required variables
   - For the server, ensure you have a valid `DATABASE_URL` in your `.env` file

### Database Management

#### Recreating the Database
If you need to start with a fresh database:

```bash
# From the server directory
rm prisma/inventory.db
npx prisma migrate dev --name init
```

#### Running Migrations
When you make changes to your Prisma schema:

```bash
# Generate and apply migrations
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

#### Viewing the Database
Use Prisma Studio to explore and edit your database:
```bash
npx prisma studio
```

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
│       ├── components/    # Reusable UI components
│       ├── containers/    # Page components
│       ├── styles/        # Styles
│       ├── App.jsx        # Main App component
│       └── main.jsx       # Entry point
├── server/                # Backend server
│   ├── prisma/           # Prisma schema and migrations
│   │   └── migrations/   # Database migrations
│   ├── src/              # Server source code
│   └── package.json      # Server dependencies
├── .gitignore
└── package.json          # Root project configuration
```

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
