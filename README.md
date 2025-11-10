# Clean Water Reporter

A comprehensive water issue tracking system that enables community members to report water-related problems and allows water authority officials to manage and track these reports efficiently.

## 🌊 Project Overview

This application consists of:
- **Frontend**: React + Vite (Modern, responsive UI)
- **Backend**: Spring Boot 3.2.0 (RESTful API)
- **Database**: MySQL 8.0.x

## 📋 Features

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
- Map view (placeholder for future integration)

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Java JDK 17** or higher - [Download](https://www.oracle.com/java/technologies/downloads/)
3. **MySQL 8.0.x** - [Download](https://dev.mysql.com/downloads/mysql/)
   - **Recommended: MySQL 8.0.35** or latest 8.0.x version
4. **Maven 3.6+** (usually comes with IDE or download separately)

### MySQL Installation

#### Windows:
1. Download MySQL Installer from official website
2. Choose "Developer Default" setup
3. Set root password during installation
4. Complete the wizard

#### macOS:
```bash
brew install mysql@8.0
brew services start mysql@8.0
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Database Setup

1. Login to MySQL:
```bash
mysql -u root -p
```

2. The database will be auto-created by Spring Boot, but you can create it manually:
```sql
CREATE DATABASE clean_water_db;
```

3. (Optional) Create a dedicated user:
```sql
CREATE USER 'cleanwater_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON clean_water_db.* TO 'cleanwater_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔧 Installation & Setup

### Backend Setup (Spring Boot)

1. Navigate to the backend folder:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

4. Verify backend is running:
   - Open browser: `http://localhost:8080/api/reports`
   - You should see JSON data with demo reports

### Frontend Setup (React + Vite)

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

4. Open browser and navigate to `http://localhost:5173`

## 👥 Demo Accounts

Login with these credentials:

**Citizen Account:**
- Email: `john@citizen.com`
- Password: `demo123`

**Official Account:**
- Email: `sarah@waterauthority.gov`
- Password: `demo123`

## 📡 API Endpoints

### User Endpoints
- `POST /api/users/login` - User authentication
- `POST /api/users/register` - Register new user
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Report Endpoints
- `GET /api/reports` - Get all reports
- `GET /api/reports/{id}` - Get report by ID
- `GET /api/reports/reporter/{name}` - Get reports by reporter
- `GET /api/reports/status/{status}` - Filter by status
- `GET /api/reports/severity/{severity}` - Filter by severity
- `GET /api/reports/stats` - Get statistics
- `POST /api/reports` - Create new report
- `PUT /api/reports/{id}` - Update report
- `PATCH /api/reports/{id}/status` - Update status only
- `DELETE /api/reports/{id}` - Delete report

## 📁 Project Structure

```
clean-water-reporter/
├── backend/                      # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cleanwater/
│   │   │   │   ├── config/      # Configuration classes
│   │   │   │   ├── controller/  # REST Controllers
│   │   │   │   ├── dto/         # Data Transfer Objects
│   │   │   │   ├── model/       # Entity classes
│   │   │   │   ├── repository/  # JPA Repositories
│   │   │   │   └── service/     # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── main.jsx             # Entry point
│   │   ├── assets/
│   │   └── services/            # API integration
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── start-backend.bat            # Windows backend launcher
├── start-frontend.bat           # Windows frontend launcher
└── README.md                    # This file
```

## 🛠️ Technologies Used

### Frontend
- React 19.1.1
- Vite 7.1.7
- Lucide React (Icons)
- TailwindCSS (via utility classes)

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Connector
- Lombok
- Maven

### Database
- MySQL 8.0.x

## 🔍 Troubleshooting

### Backend won't start:
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `application.properties`
3. Check Java version: `java -version` (should be 17+)
4. Check if port 8080 is available

### Frontend won't connect to backend:
1. Verify backend is running on port 8080
2. Check browser console for CORS errors
3. Ensure CORS is configured correctly in backend

### Database connection issues:
```bash
# Check MySQL status
# Windows: Check services
# Mac/Linux:
sudo systemctl status mysql  # Linux
brew services list          # Mac
```

## 🎯 Next Steps to Connect Frontend to Backend

Currently, the frontend uses mock data. To connect it to the backend:

1. Install axios in frontend:
```bash
npm install axios
```

2. Create an API service file (`src/services/api.js`)
3. Replace mock data with API calls
4. Update state management to use backend data
5. Implement proper authentication flow

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or issues:
1. Check the backend README for detailed API documentation
2. Review troubleshooting sections
3. Verify all prerequisites are properly installed
