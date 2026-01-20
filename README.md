# Vidyank - Online Exam Conduct System

A comprehensive online examination platform built with React Native (Expo) and Node.js, designed for conducting UPSC, MPSC, NEET, and other competitive exams.

## 🚀 Features

### Student Features
- ✅ User Registration & Authentication
- ✅ Browse Available Exams
- ✅ Take Exams with Real-time Timer
- ✅ Camera Proctoring (Web Platform)
- ✅ Question Navigation & Marking
- ✅ Instant Results & Score Calculation
- ✅ Exam History & Performance Tracking
- ✅ Responsive Design (Mobile & Desktop)

### Admin Features
- ✅ Admin Dashboard with Analytics
- ✅ Create & Manage Exams
- ✅ Add/Edit/Delete Questions
- ✅ Activate/Archive Exams
- ✅ View All Candidates
- ✅ Performance Statistics
- ✅ Exam Status Management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Expo CLI (for mobile development)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Vidyank
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/vidyank
JWT_SECRET=your_secret_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Update `frontend/src/services/api.ts` with your local IP if testing on physical devices.

## 🎯 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm start
```

Choose your platform:
- Press `w` for web
- Press `a` for Android
- Press `i` for iOS

## 🗄️ Database Seeding

### Seed Sample Exams
```bash
cd backend
node seedExams.js
```

This creates 4 sample exams:
- UPSC Prelims Mock Test 2025
- MPSC Prelims Practice Test
- NEET Biology Mock Test
- General Knowledge Quiz

### Create Admin User
```bash
cd backend
node seedAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@vidyank.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change the admin password after first login!

## 🔐 Login Credentials

### Admin Access
1. Navigate to the home screen
2. Click "Admin" button (red)
3. Login with:
   - Email: `admin@vidyank.com`
   - Password: `Admin@123`

### Student Access
1. Click "Student Login" button (blue)
2. Register a new account or use existing credentials

## 📱 Admin Workflow

1. **Login** → Use admin credentials
2. **Create Exam** → Navigate to "Exams" → Click "New Exam"
3. **Add Questions** → Click "Manage Questions" on exam card
4. **Activate Exam** → Toggle status to "Active"
5. **Monitor** → View statistics and candidate performance

## 👨‍🎓 Student Workflow

1. **Register/Login** → Create account or sign in
2. **Browse Exams** → Navigate to "Available Exams"
3. **Start Exam** → Click "Start Exam" button
4. **Grant Camera Permission** → Required for proctoring
5. **Take Exam** → Answer questions, use navigation panel
6. **Submit** → Review results immediately
7. **View History** → Check past exam attempts

## 🏗️ Project Structure

```
Vidyank/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── seedExams.js     # Sample exam seeder
│   ├── seedAdmin.js     # Admin user seeder
│   └── server.js        # Express server
│
└── frontend/
    ├── src/
    │   ├── screens/         # Student screens
    │   ├── adminscreens/    # Admin screens
    │   ├── components/      # Reusable components
    │   ├── services/        # API service
    │   ├── context/         # React context
    │   └── utils/           # Utility functions
    └── App.tsx              # Main app component
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/login` - User/Admin login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (Admin)
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### Exam Results
- `POST /api/exam-results` - Submit exam result
- `GET /api/exam-results` - Get user's exam results
- `GET /api/exam-results/stats/performance` - Performance stats
- `GET /api/exam-results/stats/progress` - Progress tracking

## 🎨 Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- AsyncStorage
- Expo Camera (for proctoring)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (password hashing)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Admin role verification
- Secure token storage

## 📊 Database Models

### User
- firstName, lastName, email, password
- city, phone, category, instituteName
- role (student/admin)
- isAdmin flag

### Exam
- title, subject, difficulty, duration
- questions array (embedded)
- status (Active/Draft/Archived)
- totalQuestions (auto-calculated)

### ExamResult
- user reference
- exam reference
- score, correctAnswers, timeTaken
- answers array
- status (completed/incomplete)

## 🚧 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify port 5000 is not in use

### Frontend can't connect to backend
- Update `LOCAL_IP` in `frontend/src/services/api.ts`
- Ensure backend is running
- Check firewall settings

### Admin login fails
- Run `node seedAdmin.js` to create admin user
- Verify credentials: `admin@vidyank.com` / `Admin@123`
- Check backend logs for errors

## 📝 Future Enhancements

- [ ] Bulk question import (CSV/JSON)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] PDF report generation
- [ ] Exam scheduling
- [ ] Question bank/library
- [ ] Multi-language support
- [ ] Mobile app deployment (APK/IPA)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- MongoDB for the database solution
- All contributors and testers

## 📞 Support

For support, email support@vidyank.com or create an issue in the repository.

---

**Made with ❤️ for education**
