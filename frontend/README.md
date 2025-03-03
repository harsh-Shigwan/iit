# 🗣️ Speech Assessment System - Frontend

## 📌 Project Overview

This is the **frontend** of the Speech Assessment System, providing a user-friendly interface for teachers to **manage students, upload speech recordings, view assessments, and generate reports**. The webpage is designed for smooth navigation, interactive data visualization, and optimized performance.

## 🌍 Live Demo

🔗 **Frontend Hosted Link:** [iit-bombay-project-frontend.onrender.com](https://iit-bombay-project-frontend.onrender.com)

## 🚀 Tech Stack

- **React.js (Vite)** - Frontend framework
- **Tailwind CSS, Styled Components** - Styling
- **MUI** - UI components
- **Chart.js & react-chartjs-2** - Data visualization
- **TanStack React Query** - API data fetching & caching
- **react-router-dom** - Routing
- **axios** - API requests
- **html2canvas, react-to-pdf, react-to-print** - Report exporting
- **framer-motion** - Animations

## 📂 Folder Structure

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

## 🔑 Features

- **Authentication**: Secure login & signup using JWT.
- **Student Management**: Add, edit, delete students with pagination.
- **Speech Recording Upload**: Submit recordings for analysis.
- **Data Visualization**: View assessment results with interactive charts.
- **Report Exporting**: Download reports as **PDF** or **print** them.
- **Optimized Performance**:
  - **TanStack React Query** for caching API responses.
  - **Pagination** for student lists.

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/harsh-Shigwan/iit.git
cd frontend
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Start the Development Server**

```bash
npm run dev
```

## 🚀 Deployment

### **Deploy on Render**

1. **Create a Render Account** at [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Create a new Static Site**
4. **Set Build Command:** `npm run build`
5. **Set Publish Directory:** `dist`
6. **Deploy & Test!** 🎉


