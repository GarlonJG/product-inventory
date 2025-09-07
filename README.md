# Product Inventory Management System

A full-stack web application for managing product inventory with a modern React frontend and Node.js backend.

<WIP as of 9/7/2025>

## Features

- **Product Management**: Add, view, edit, and delete products
- **Responsive UI**: Built with Material-UI for a clean, modern interface
- **Data Grid**: Interactive data table with sorting, filtering, and pagination
- **Real-time Updates**: View changes immediately as they happen

## Tech Stack

### Frontend
- React 19
- Vite (Build Tool)
- Material-UI (MUI) v7
- React Hook Form
- Emotion (for styling)

### Backend
- Node.js
- Prisma
- SQLite
- NestJS
  
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
   cd ../inventory_server
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Create `.env` files in both `client` and `inventory_server` directories as needed
   - Refer to `.env.example` files for required variables

### Running the Application

Start both frontend and backend servers with a single command:
```bash
npm run start
```

This will start:
- Frontend development server at `http://localhost:3000`
- Backend server at `http://localhost:5000`

## Available Scripts

- `npm start`: Start both frontend and backend in development mode
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint for code quality checks

## Project Structure

```
product-inventory/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # Reusable UI components
│       ├── containers/    # Page components
│       ├── App.jsx        # Main App component
│       └── main.jsx       # Entry point
├── inventory_server/      # Backend server
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
