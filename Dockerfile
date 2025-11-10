# Use Maven with JDK 17 for building
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/pom.xml .
COPY backend/src ./src

# Build the application (skip tests for faster deployment)
RUN mvn clean package -DskipTests

# Use lightweight JRE for runtime
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
