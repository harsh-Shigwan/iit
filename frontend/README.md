# 🗣️ Speech Assessment System

## 📌 Project Overview

This is a **Full-Stack Speech Assessment System** built using **React (Vite) & Node.js**. It allows teachers to:

- Manage students
- Upload and analyze speech recordings
- View & export assessment reports with **interactive charts**

## 🚀 Tech Stack

### **Frontend:**

- **React.js (Vite)** - Framework
- **Tailwind CSS, Styled Components** - Styling
- **MUI** - UI components
- **Chart.js & react-chartjs-2** - Data visualization
- **TanStack React Query** - API data fetching & caching
- **react-router-dom** - Routing
- **axios** - API requests
- **html2canvas, react-to-pdf, react-to-print** - Report exporting
- **framer-motion** - Animations

### **Backend:**

- **Node.js & Express.js** - Backend framework
- **MongoDB (Mongoose)** - Database
- **JWT Authentication** - Secure API access
- **AWS S3** - Audio file storage
- **SAS API** - Speech analysis

## 🌍 Live Demo

🔗 **Frontend:** [iit-bombay-project-frontend.onrender.com](https://iit-bombay-project-frontend.onrender.com)

## 📂 Folder Structure

### **Frontend**

```
frontend/
├── assets/          # Static assets (images, API URLs)
├── components/      # Reusable UI components
│   ├── graphs/      # Chart components (BarChart, Doughnut)
│   ├── Header.jsx   # Navigation bar
│   ├── LoadingScreen.jsx  # Loader animation
│   ├── NotFound.jsx  # 404 error page
│   ├── ProtectedRoute.jsx  # Route protection
├── context/         # Global authentication state
│   ├── AuthContext.jsx
├── pages/           # Main application pages
│   ├── students/    # Student-related pages
│   │   ├── Add_Recordings.jsx
│   │   ├── Add_Students.jsx
│   │   ├── All_Students.jsx (Pagination)
│   │   ├── Assessment.jsx (Data caching)
│   │   ├── Edit_Student.jsx
│   │   ├── Reports.jsx (Print & Export functionality)
│   ├── Home.jsx      # Dashboard overview
│   ├── Profile.jsx   # Teacher profile
│   ├── SignIn.jsx    # Login
│   ├── SignUp.jsx    # Register
├── main.jsx         # Entry point
```

### **Backend**

```
backend/
├── models/          # Mongoose schemas
│   ├── Teacher.js   # Teacher model
│   ├── Student.js   # Student model
│   ├── Recording.js # Audio recordings
│   ├── Report.js    # Speech assessment reports
├── routes/          # API endpoints
│   ├── auth.js      # Authentication routes
│   ├── students.js  # Student management
│   ├── upload.js    # AWS S3 upload & SAS API analysis
├── middleware/      # JWT authentication
├── config/          # Configuration files
├── services/        # External integrations (AWS, SAS API)
├── server.js        # Entry point
```

## 🔑 Features

- **Authentication**: Secure login & signup using JWT.
- **Student Management**: Add, edit, delete students with pagination.
- **Audio Upload & Analysis**: Upload recordings to AWS S3 & analyze using SAS API.
- **Data Visualization**: View speech assessment reports with **interactive charts**.
- **Report Exporting**: Download reports as **PDF** or **print** them.
- **Optimized Performance**:
  - **TanStack React Query** for caching API responses.
  - **Pagination** for student lists.

## 🛠️ Setup & Installation

### **Backend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/harsh-Shigwan/iit.git
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket
   AWS_REGION=your_region
   SAS_API_URL=your_sas_api_url
   SAS_API_KEY=your_sas_api_key
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### **Frontend Setup**

1. Navigate to frontend folder:
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

## 🚀 Deployment

- **Backend & Frontend**: Deploy on **Render**
- **Example Deployment Steps**:
  1. **Create a Render Account** at [Render](https://render.com)
  2. **Connect your GitHub repository**
  3. **Deploy Backend**:
     - Create a new **Web Service**
     - Select **Node.js environment**
     - Add your **environment variables** from `.env`
     - Set **Start Command** to `npm start`
  4. **Deploy Frontend**:
     - Create a new **Static Site**
     - Set **Build Command** to `npm run build`
     - Set **Publish Directory** to `dist`
  5. **Deploy & Test!** 🎉





