# ===========================
# Stage 1 - Build
# ===========================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ===========================
# Stage 2 - Runtime
# ===========================
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p uploads/services
RUN mkdir -p uploads/gallery

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]