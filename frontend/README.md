# Clean Water Reporter - Frontend

React + Vite frontend for the Clean Water Reporter application.

## Technologies Used

- **React 19.1.1**
- **Vite 7.1.7**
- **Lucide React** (Icons)
- **TailwindCSS** (Utility-first CSS)

## Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js)

## Installation

```bash
cd frontend
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── assets/              # Static assets
│   └── services/
│       └── api-example.js   # API integration example
├── public/                  # Public static files
├── index.html               # HTML template
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Features

### For Citizens:
- Report water quality issues, infrastructure problems, drought conditions, etc.
- Track status of submitted reports
- View personal report history
- Dashboard with statistics

### For Water Officials:
- View all community reports
- Update report status (Pending Review, In Progress, Resolved)
- Filter reports by type, severity, status
- Interactive search functionality
- Statistical overview and analytics

## Demo Accounts

**Citizen:**
- Email: `john@citizen.com`
- Password: `demo123`

**Official:**
- Email: `sarah@waterauthority.gov`
- Password: `demo123`

## Connecting to Backend

Currently, the frontend uses mock data. To connect to the Spring Boot backend:

1. Ensure backend is running on `http://localhost:8080`
2. Review `src/services/api-example.js` for API integration examples
3. See `../API_INTEGRATION.md` for complete integration guide

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Configuration

The app expects the backend API to be available at:
- Development: `http://localhost:8080/api`

To change this, update the API_BASE_URL in your API service file.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 5173 is already in use
```bash
# Find the process using port 5173
netstat -ano | findstr :5173
# Kill the process
taskkill /PID <process_id> /F
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

## Next Steps

1. Start the backend server (see `../backend/README.md`)
2. Start the frontend development server
3. Open `http://localhost:5173` in your browser
4. Login with demo accounts
5. Explore the application features

For API integration, refer to `../API_INTEGRATION.md`
