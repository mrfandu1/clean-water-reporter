# Clean Water Reporter - Backend

Spring Boot backend for the Clean Water Reporter application.

## Technologies Used

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 8.0.x**
- **Maven**
- **Lombok**

## Prerequisites

Before running this application, make sure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Or use OpenJDK: https://openjdk.org/

2. **Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Or use IDE built-in Maven

3. **MySQL 8.0.x**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - **Recommended version: MySQL 8.0.35 or latest 8.0.x**
   - MySQL 8.0.x is recommended for best compatibility and performance

## MySQL Installation Guide

### Windows:
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and choose "Developer Default" or "Server only"
3. Follow the setup wizard
4. Set a root password (remember this for the configuration)
5. Complete the installation

### macOS:
```bash
# Using Homebrew
brew install mysql@8.0
brew services start mysql@8.0
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## Database Setup

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Create the database (Optional - auto-created by application):**
```sql
CREATE DATABASE clean_water_db;
```

3. **Create a user (Optional but recommended):**
```sql
CREATE USER 'cleanwater_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON clean_water_db.* TO 'cleanwater_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Configuration

1. **Update database credentials in `src/main/resources/application.properties`:**

```properties
# For root user:
spring.datasource.username=root
spring.datasource.password=your_mysql_root_password

# OR for custom user:
spring.datasource.username=cleanwater_user
spring.datasource.password=your_strong_password
```

2. **Other configurations (already set):**
   - Server runs on port: 8080
   - Database auto-creates tables on startup
   - CORS enabled for frontend (localhost:5173)

## Running the Application

### Method 1: Using Maven Command Line
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Method 2: Using IDE (IntelliJ IDEA / Eclipse)
1. Import the project as a Maven project
2. Wait for dependencies to download
3. Run `CleanWaterReporterApplication.java`

### Method 3: Using JAR file
```bash
cd backend
mvn clean package
java -jar target/clean-water-reporter-backend-1.0.0.jar
```

## Verify Installation

1. **Check if server is running:**
   - Open browser and go to: http://localhost:8080/api/reports
   - You should see a JSON response with demo reports

2. **Test API endpoints:**
```bash
# Get all reports
curl http://localhost:8080/api/reports

# Get all users
curl http://localhost:8080/api/users
```

## API Endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Report Endpoints
- `GET /api/reports` - Get all reports
- `GET /api/reports/{id}` - Get report by ID
- `GET /api/reports/reporter/{reporter}` - Get reports by reporter name
- `GET /api/reports/status/{status}` - Get reports by status
- `GET /api/reports/severity/{severity}` - Get reports by severity
- `GET /api/reports/type/{type}` - Get reports by type
- `GET /api/reports/stats` - Get report statistics
- `POST /api/reports` - Create new report
- `PUT /api/reports/{id}` - Update report
- `PATCH /api/reports/{id}/status` - Update report status
- `DELETE /api/reports/{id}` - Delete report

## Demo Accounts

The application comes with pre-loaded demo accounts:

1. **Citizen Account:**
   - Email: john@citizen.com
   - Password: demo123

2. **Official Account:**
   - Email: sarah@waterauthority.gov
   - Password: demo123

## Troubleshooting

### MySQL Connection Issues:
1. Ensure MySQL service is running
2. Verify database credentials in application.properties
3. Check if port 3306 is available
4. Try: `mysql -u root -p` to test MySQL access

### Port 8080 already in use:
```bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Linux/Mac - Find and kill process
lsof -i :8080
kill -9 <process_id>
```

### Maven build issues:
```bash
# Clean and rebuild
mvn clean install -U
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/cleanwater/
│   │   │   ├── CleanWaterReporterApplication.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── DataInitializer.java
│   │   │   ├── controller/
│   │   │   │   ├── ReportController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   ├── ReportRequest.java
│   │   │   │   └── StatusUpdateRequest.java
│   │   │   ├── model/
│   │   │   │   ├── Report.java
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── ReportRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   └── service/
│   │   │       ├── ReportService.java
│   │   │       └── UserService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Next Steps

1. Configure MySQL with your credentials
2. Run the backend server
3. Test API endpoints
4. Update frontend to connect to backend API
5. Start developing!

## Support

For issues or questions:
- Check MySQL connection and credentials
- Verify Java and Maven versions
- Review application logs in the console
- Ensure all dependencies are downloaded
