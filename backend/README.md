# 🗣️ Speech Assessment System - Backend

## 📌 Project Overview
This is the **backend** of the Speech Assessment System, responsible for **user authentication, student management, speech recording uploads, and speech assessment processing**. It integrates with **AWS S3** for file storage and the **SAS API** for speech analysis. The backend ensures secure access with **JWT authentication** and efficiently handles data storage using **MongoDB**.

## 🌍 Hosted API
🔗 **Backend Hosted Link:** [iit-bombay-project-ejgl.onrender.com](https://iit-bombay-project-ejgl.onrender.com)

## 🚀 Tech Stack
- **Node.js & Express.js** - Backend framework
- **MongoDB (Mongoose)** - Database
- **JWT Authentication** - Secure API access
- **AWS S3** - Audio file storage
- **SAS API** - Speech analysis
- **Multer** - File upload handling
- **Axios** - API communication
- **Cors** - Cross-Origin Resource Sharing

## 📂 Folder Structure
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
- **User Authentication**: Secure login & signup with JWT.
- **Student Management**: CRUD operations for students.
- **Audio Upload & Analysis**: Store recordings in AWS S3 and analyze via SAS API.
- **Speech Assessment Reports**: Store and retrieve analysis results.
- **Optimized API Calls**: Efficient error handling and response caching.

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/harsh-Shigwan/iit.git
cd backend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the backend root folder and add:
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

### **4️⃣ Start the Backend Server**
```bash
npm start
```

## 🚀 Deployment
### **Deploy on Render**
1. **Create a Render Account** at [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Set Environment Variables** from `.env` file
5. **Set Start Command:** `npm start`
6. **Deploy & Test!** 🎉

