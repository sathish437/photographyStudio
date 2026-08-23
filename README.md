# Aravinth Photography Studio CMS

A full-stack photography studio portfolio and Content Management System (CMS) built based on real client requirements. The platform provides a responsive public portfolio website for clients and a secure admin panel for managing gallery photos, services, studio information, and dynamic content.

---

## Features

- **Responsive Photography Portfolio**: Modern, mobile-first design with smooth animations and categorized image browsing.
- **Secure Admin Authentication**: JWT-based authentication and authorization with BCrypt password encryption.
- **Gallery Management**: Admin dashboard to upload, update, categorize, and delete gallery images.
- **Cloudinary Image Storage**: Direct cloud-based image upload, CDN delivery, and asset management.
- **Service & Package Management**: Dynamic configuration of photography packages, features, and details.
- **Studio Information Management**: Centralized management of contact channels, multiple branch addresses, and social links.
- **RESTful API Architecture**: Clean separation of public and protected admin endpoints with robust error handling.
- **Modern UI & Micro-interactions**: Built with Tailwind CSS and Framer Motion for an interactive client experience.

---

## Tech Stack

### Frontend
- **React.js** (React 19)
- **Tailwind CSS** (v4)
- **Framer Motion**
- **Axios**
- **React Router** (v7)
- **Lucide React**

### Backend
- **Java** (Java 21)
- **Spring Boot** (4.1.0)
- **Spring Security**
- **Spring Data JPA**
- **REST APIs**
- **JWT** (io.jsonwebtoken JJWT)
- **Lombok**

### Database & Services
- **PostgreSQL**
- **Cloudinary** (Cloudinary Java SDK)

### Tools
- **Maven**
- **Docker**
- **Git & GitHub**

---

## Architecture

### System Data Flow

```text
React.js Frontend
       ↓
Spring Boot REST APIs
       ↓
Spring Security + JWT
       ↓
Service Layer
       ↓
Repository Layer
       ↓
PostgreSQL
```

### Media Asset Management

```text
Gallery Upload (Admin)
       ↓
Spring Boot Backend
       ↓
Cloudinary Cloud Storage
```

---

## Main Modules

### Public Website
- **Hero & Branding**: Visual landing experience with call-to-action navigation.
- **About & Highlights**: Studio introduction, photographer background, and portfolio statistics.
- **Interactive Gallery**: Filterable portfolio grid supporting categories (Wedding, Pre-Wedding, Birthday, Baby, Events, etc.).
- **Service Offerings**: Showcase of studio photography packages and descriptions.
- **Why Choose Us**: Studio key differentiators and equipment highlights.
- **Contact & Location**: Direct communication portals (Phone, WhatsApp, Email, Instagram, YouTube) and physical studio atelier addresses.

### Admin CMS
- **Admin Authentication**: Secure login portal with token-based session persistence.
- **Gallery Manager**: Upload new photographs, update captions and categories, and delete gallery items.
- **Services Manager**: Create, modify, and manage studio service packages.
- **Contact Manager**: Update studio telephone numbers, WhatsApp contact, email, social media links, and atelier addresses.
- **Feedback & Alerts**: Interactive toast notifications and deletion confirmation dialogs.

---

## Security

- **Stateless JWT Authentication**: Secure token generation and header validation for protected endpoints.
- **Spring Security Filter Chain**: Request filtering with custom `JwtAuthFilter`.
- **BCrypt Password Encryption**: Strong cryptographic password hashing for admin credentials.
- **Role-Based Authorization**: Protected `/api/admin/**` endpoints restricted to authorized administrators (`ROLE_ADMIN`).
- **Permit-All Public APIs**: Open `/api/public/**` endpoints for seamless client portfolio browsing.

---

## Project Structure

```text
client/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminShared.jsx
│   │   │   ├── ContactManager.jsx
│   │   │   ├── GalleryManager.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ServicesManager.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── DeleteConfirmationModal.jsx
│   │   ├── Footer.jsx
│   │   ├── Gallery.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Services.jsx
│   │   └── WhyChooseUs.jsx
│   ├── pages/
│   │   └── AdminPanel.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js

server/
├── src/main/java/com/example/photoStudio/
│   ├── config/
│   ├── controller/
│   │   ├── AdminAuthController.java
│   │   ├── AdminContactController.java
│   │   ├── AdminGalleryController.java
│   │   ├── AdminServicesController.java
│   │   └── PublicController.java
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── mapper/
│   ├── repository/
│   ├── security/
│   ├── service/
│   └── PhotoStudioApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── seed_data.sql
├── Dockerfile
└── pom.xml
```

---

## Setup

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL database
- Cloudinary account

### Backend Setup

```bash
cd server
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Required Environment Variables

Configure the following environment variables (or define them in a `server/.env` file):

```env
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## Project Highlights

- **Real-World Client Architecture**: Engineered to meet the operational and aesthetic requirements of a professional photography studio.
- **Full-Stack Decoupled Design**: React frontend integrated with a Spring Boot REST API.
- **Secure Admin CMS**: Protected management portal allowing complete studio content control without code deployments.
- **Cloudinary Media Management**: Integrated Cloudinary for cloud-based image storage and CDN delivery.
- **PostgreSQL Data Management**: Reliable relational schema for services, gallery metadata, and studio details.
- **Responsive Modern UI**: Polished modern aesthetic with smooth animations and responsive layout across all device sizes.

---

## License

This project is proprietary software developed for Aravinth Photography Studio. All rights reserved.
