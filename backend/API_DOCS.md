# Vidyank Backend API Documentation

Base URL: `http://localhost:5000`

## Authentication

### Register User
- **URL**: `/api/users`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "city": "Mumbai",
    "phone": "9876543210",
    "category": "General",
    "referralSource": "Social Media",
    "instituteName": "IIT Bombay",
    "termsAccepted": true
  }
  ```
- **Response**: User object + Token

### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + Token

### Get User Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

## Exams

### Get All Exams
- **URL**: `/api/exams`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of exams

### Get Exam by ID
- **URL**: `/api/exams/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Single exam object

### Create Exam (Admin Only)
- **URL**: `/api/exams`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "NEET Mock Test 1",
    "subject": "Biology",
    "difficulty": "Medium",
    "duration": 180,
    "status": "Active"
  }
  ```

### Update Exam (Admin Only)
- **URL**: `/api/exams/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Fields to update

### Delete Exam (Admin Only)
- **URL**: `/api/exams/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

## Setup & Running

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
2. **Setup Environment**:
   Ensure `.env` file has `MONGODB_URI` and `JWT_SECRET`.
3. **Run Server**:
   ```bash
   npm run dev
   ```
