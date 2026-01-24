# Vehicle Management System

A comprehensive web-based application designed to streamline vehicle operations, tracking, and management for organizations. The system features role-based access control, real-time mapping, and detailed analytics.

## 📂 Project Structure

The project is divided into two main components:

### 1. `backend/`
The server-side API built with **Node.js** and **Express**. It handles data persistence, business logic, authentication, and file storage.
- **`controllers/`**: Contains the logic for handling requests.
- **`models/`**: Defines MongoDB schemas using Mongoose.
- **`routes/`**: API endpoints for users, vehicles, fuel, and deployments.
- **`uploads/`**: Local storage for user profile and vehicle images.

### 2. `frontend/`
The client-side interface built with **React**. It provides a responsive and interactive user experience.
- **`pages/`**: Role-specific dashboards (Admin, Driver, Dean, Deployer).
- **`context/`**: Global state management for authentication.
- **`hooks/`**: Custom hooks for auth logic (login, signup, logout).
- **`assets/`**: Static files like images and styles.

---

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **JSON Web Token (JWT)**: Secure user authentication and session management.
- **Bcrypt**: Password hashing for security.
- **Multer**: Middleware for handling `multipart/form-data` (image uploads).
- **CORS**: Cross-Origin Resource Sharing enablement.

### Frontend
- **React**: Component-based UI library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: Client-side routing.
- **Axios**: HTTP client for API communication.
- **Chart.js**: Data visualization for fuel and vehicle reports.
- **Leaflet & React-Leaflet**: Interactive maps for vehicle/driver tracking.
- **React Icons**: Iconography.

---

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Distinct interfaces and permissions for Administrators, Deans, Drivers, and Vehicle Deployers.
- **Vehicle CRUD**: Full management of the vehicle fleet, including technical specifications and image uploads.
- **Deployment System**: Streamlined process for requesting and assigning vehicles to specific tasks.
- **Fuel Tracking**: Monitoring fuel consumption and costs with visual analytics.
- **Interactive Maps**: Real-time location visualization for drivers and vehicles.
- **Comprehensive Reporting**: Generation of system-wide reports for data-driven decision-making.

---

## 🔄 Application Flow

1.  **Authentication**: Users sign up or log in. The backend validates credentials and returns a JWT.
2.  **Authorization**: The frontend stores the user state in `AuthContext` and redirects users based on their role.
3.  **Management**: 
    - **Admins** manage users and the vehicle inventory.
    - **Deans/Deployers** process deployment requests.
    - **Drivers** view assignments and update trip statuses.
4.  **Data Processing**: The backend handles complex queries for reports and manages file uploads for profiles/vehicles.
5.  **Analytics**: Data is fetched from the API and rendered into charts and maps on the frontend for easy monitoring.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)

### Installation

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT and MONGO_URI
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
