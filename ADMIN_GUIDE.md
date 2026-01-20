# Admin Quick Start Guide

## 🔐 Admin Login Credentials

**Email:** `admin@vidyank.com`  
**Password:** `Admin@123`

⚠️ **Change this password after first login!**

---

## 📋 Quick Access

### From Home Screen
1. Click the **"Admin"** button (red button in header)
2. Enter credentials above
3. You'll be redirected to Admin Dashboard

### Direct URL (Web)
- Navigate to: `http://localhost:19006` → Click "Admin"

---

## 🎯 Common Admin Tasks

### 1. Create a New Exam

**Steps:**
1. Login to Admin Dashboard
2. Navigate to **"Exams"** from sidebar
3. Click **"New Exam"** button (top right)
4. Fill in the form:
   - **Title:** e.g., "UPSC Prelims 2025"
   - **Subject:** e.g., "General Studies"
   - **Difficulty:** Easy/Medium/Hard
   - **Duration:** Time in minutes (e.g., 120)
   - **Questions:** Number of questions (will be added next)
   - **Description:** Brief description
5. Click **"Create Exam"**

### 2. Add Questions to Exam

**Steps:**
1. Find your exam in the Exams list
2. Click **"Manage Questions (0)"** button on the exam card
3. Fill in the question form:
   - **Question Text:** Enter your question
   - **Option 1-4:** Enter all four options
   - **Select Correct Answer:** Click the radio button next to the correct option
4. Click **"Add Question"**
5. Repeat for all questions

**Tips:**
- Questions are saved immediately
- You can delete questions using the trash icon
- The question count updates automatically

### 3. Activate an Exam

**Steps:**
1. Go to **"Exams"** screen
2. Find your exam (it will be in "Draft" status)
3. Click the **checkmark icon** (green) in the action buttons
4. Exam status changes to "Active"
5. Students can now see and take this exam!

### 4. View Student Results

**Steps:**
1. Navigate to **"Candidates"** from sidebar
2. View list of all registered students
3. Click on a student to see their exam history
4. View scores, attempts, and performance

### 5. View Statistics

**Steps:**
1. Navigate to **"Statistics"** from sidebar
2. View overall performance metrics
3. See exam-wise analytics
4. Monitor student progress

---

## 🔄 Exam Status Workflow

```
Draft → Active → Archived
  ↓       ↓         ↓
Hidden  Visible  Hidden
        to       from
        Students Students
```

**Status Meanings:**
- **Draft:** Exam is being created, not visible to students
- **Active:** Exam is live and students can take it
- **Archived:** Exam is completed/closed, not visible to students

---

## 🎨 Exam Management Features

### Filter Exams
- Click **"All"**, **"Active"**, or **"Archived"** tabs
- Use search bar to find specific exams

### Edit Exam
- Click the **pencil icon** (blue) on any exam card
- Modify details and click "Update Exam"

### Delete Exam
- Click the **trash icon** (red) on any exam card
- Confirm deletion
- ⚠️ This action cannot be undone!

### Toggle Status
- Click the **archive icon** (gray) to archive an active exam
- Click the **checkmark icon** (green) to activate a draft/archived exam

---

## 📊 Dashboard Overview

### Key Metrics (Top Cards)
- **Total Exams:** Number of exams created
- **Active Exams:** Currently available to students
- **Total Students:** Registered users
- **Total Attempts:** Number of exam submissions

### Charts
- **Exam Performance:** Visual representation of scores
- **Student Progress:** Tracking over time

---

## 🛠️ Troubleshooting

### Can't Login?
- Verify credentials: `admin@vidyank.com` / `Admin@123`
- Check if backend server is running
- Clear browser cache and try again

### Exam Not Showing for Students?
- Ensure exam status is **"Active"**
- Verify exam has at least 1 question
- Check if "Public Exam" toggle is ON

### Questions Not Saving?
- Check internet connection
- Ensure all fields are filled
- Verify backend server is running
- Check browser console for errors

---

## 🔒 Security Best Practices

1. **Change Default Password:**
   - Go to Settings → Change Password
   - Use a strong password (min 8 characters)

2. **Logout After Use:**
   - Always logout from shared computers
   - Click your profile → Logout

3. **Regular Backups:**
   - Export exam data regularly
   - Keep backup of question banks

---

## 📞 Need Help?

### Quick Checks
1. Is backend server running? (`npm start` in backend folder)
2. Is frontend running? (`npm start` in frontend folder)
3. Is MongoDB connected? (Check backend console)

### Common Commands
```bash
# Start Backend
cd backend
npm start

# Start Frontend
cd frontend
npm start

# Create Admin (if needed)
cd backend
node seedAdmin.js

# Seed Sample Exams
cd backend
node seedExams.js
```

---

## 📝 Quick Reference

| Action | Location | Button/Icon |
|--------|----------|-------------|
| Create Exam | Exams Screen | "New Exam" (Blue) |
| Add Questions | Exam Card | "Manage Questions" |
| Activate Exam | Exam Card | ✓ (Green) |
| Edit Exam | Exam Card | ✏️ (Blue) |
| Delete Exam | Exam Card | 🗑️ (Red) |
| Archive Exam | Exam Card | 📦 (Gray) |
| View Students | Sidebar | "Candidates" |
| View Stats | Sidebar | "Statistics" |

---

**Last Updated:** January 2026  
**Version:** 1.0.0
