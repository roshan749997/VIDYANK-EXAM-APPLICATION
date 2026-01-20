import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Exam {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  questions: number;
  status: 'Draft' | 'Active' | 'Archived';
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  plan: string;
  lastLogin: string;
  examAttempts: number;
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'ExamManager';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  password: string;
  role: 'SuperAdmin' | 'ExamManager';
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  examId: string;
  question: string;
  type: 'single' | 'multi' | 'tf' | 'short';
  options?: string[];
  answer: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  createdAt: string;
}

// Exam Management
export const getAllExams = async (): Promise<Exam[]> => {
  try {
    const stored = await AsyncStorage.getItem('exams');
    if (stored) {
      return JSON.parse(stored);
    }
    // Return mock data if no exams exist
    return [];
  } catch (error) {
    console.error('Failed to get exams:', error);
    return [];
  }
};

export const addExam = async (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam> => {
  try {
    const exams = await getAllExams();
    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    exams.push(newExam);
    await AsyncStorage.setItem('exams', JSON.stringify(exams));
    return newExam;
  } catch (error) {
    console.error('Failed to add exam:', error);
    throw error;
  }
};

export const updateExam = async (examId: string, updates: Partial<Exam>): Promise<Exam | null> => {
  try {
    const exams = await getAllExams();
    const examIndex = exams.findIndex(e => e.id === examId);
    if (examIndex === -1) return null;
    
    const updatedExam = {
      ...exams[examIndex],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    exams[examIndex] = updatedExam;
    await AsyncStorage.setItem('exams', JSON.stringify(exams));
    return updatedExam;
  } catch (error) {
    console.error('Failed to update exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId: string): Promise<boolean> => {
  try {
    const exams = await getAllExams();
    const filteredExams = exams.filter(e => e.id !== examId);
    await AsyncStorage.setItem('exams', JSON.stringify(filteredExams));
    return true;
  } catch (error) {
    console.error('Failed to delete exam:', error);
    return false;
  }
};

// Candidate Management
export const getAllCandidates = async (): Promise<Candidate[]> => {
  try {
    const stored = await AsyncStorage.getItem('candidates');
    if (stored) {
      return JSON.parse(stored);
    }
    // Return mock data if no candidates exist
    return [];
  } catch (error) {
    console.error('Failed to get candidates:', error);
    return [];
  }
};

export const addCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate> => {
  try {
    const candidates = await getAllCandidates();
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    candidates.push(newCandidate);
    await AsyncStorage.setItem('candidates', JSON.stringify(candidates));
    return newCandidate;
  } catch (error) {
    console.error('Failed to add candidate:', error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId: string): Promise<boolean> => {
  try {
    const candidates = await getAllCandidates();
    const filteredCandidates = candidates.filter(c => c.id !== candidateId);
    await AsyncStorage.setItem('candidates', JSON.stringify(filteredCandidates));
    return true;
  } catch (error) {
    console.error('Failed to delete candidate:', error);
    return false;
  }
};

// Admin Management
export const getAdminByEmail = async (email: string): Promise<AdminUser | null> => {
  try {
    const stored = await AsyncStorage.getItem('adminUsers');
    if (stored) {
      const adminUsers: AdminUser[] = JSON.parse(stored);
      return adminUsers.find(admin => admin.email === email) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to get admin:', error);
    return null;
  }
};

export const updateAdminLastLogin = async (adminId: string): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem('admins');
    if (stored) {
      const admins: Admin[] = JSON.parse(stored);
      const updatedAdmins = admins.map(admin => 
        admin.id === adminId 
          ? { ...admin, lastLogin: new Date().toISOString() }
          : admin
      );
      await AsyncStorage.setItem('admins', JSON.stringify(updatedAdmins));
    }
  } catch (error) {
    console.error('Failed to update admin last login:', error);
  }
};

// Admin User Management (for multi-tenant)
export const getAdminsByCompany = async (companyId: string): Promise<AdminUser[]> => {
  try {
    const stored = await AsyncStorage.getItem('adminUsers');
    if (stored) {
      const adminUsers: AdminUser[] = JSON.parse(stored);
      return adminUsers.filter(admin => admin.companyId === companyId);
    }
    return [];
  } catch (error) {
    console.error('Failed to get admin users:', error);
    return [];
  }
};

export const addAdminUser = async (adminUser: AdminUser): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem('adminUsers');
    const adminUsers: AdminUser[] = stored ? JSON.parse(stored) : [];
    adminUsers.push(adminUser);
    await AsyncStorage.setItem('adminUsers', JSON.stringify(adminUsers));
  } catch (error) {
    console.error('Failed to add admin user:', error);
    throw error;
  }
};

export const updateAdminUser = async (adminUser: AdminUser): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem('adminUsers');
    if (!stored) return;
    
    const adminUsers: AdminUser[] = JSON.parse(stored);
    const adminIndex = adminUsers.findIndex(admin => admin.id === adminUser.id);
    if (adminIndex === -1) return;
    
    adminUsers[adminIndex] = adminUser;
    await AsyncStorage.setItem('adminUsers', JSON.stringify(adminUsers));
  } catch (error) {
    console.error('Failed to update admin user:', error);
    throw error;
  }
};

export const deactivateAdmin = async (adminId: string): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem('adminUsers');
    if (!stored) return;
    
    const adminUsers: AdminUser[] = JSON.parse(stored);
    const updatedAdminUsers = adminUsers.map(admin => 
      admin.id === adminId ? { ...admin, isActive: false } : admin
    );
    await AsyncStorage.setItem('adminUsers', JSON.stringify(updatedAdminUsers));
  } catch (error) {
    console.error('Failed to deactivate admin:', error);
    throw error;
  }
};

// Question Management
export const getQuestionsByExamId = async (examId: string): Promise<Question[]> => {
  try {
    const stored = await AsyncStorage.getItem('questions');
    if (stored) {
      const questions: Question[] = JSON.parse(stored);
      return questions.filter(q => q.examId === examId);
    }
    return [];
  } catch (error) {
    console.error('Failed to get questions:', error);
    return [];
  }
};

export const addQuestion = async (question: Omit<Question, 'id' | 'createdAt'>): Promise<Question> => {
  try {
    const stored = await AsyncStorage.getItem('questions');
    const questions: Question[] = stored ? JSON.parse(stored) : [];
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    questions.push(newQuestion);
    await AsyncStorage.setItem('questions', JSON.stringify(questions));
    return newQuestion;
  } catch (error) {
    console.error('Failed to add question:', error);
    throw error;
  }
};

export const updateQuestion = async (questionId: string, updates: Partial<Question>): Promise<Question | null> => {
  try {
    const stored = await AsyncStorage.getItem('questions');
    if (!stored) return null;
    
    const questions: Question[] = JSON.parse(stored);
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return null;
    
    const updatedQuestion = {
      ...questions[questionIndex],
      ...updates,
    };
    questions[questionIndex] = updatedQuestion;
    await AsyncStorage.setItem('questions', JSON.stringify(questions));
    return updatedQuestion;
  } catch (error) {
    console.error('Failed to update question:', error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: string): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem('questions');
    if (!stored) return false;
    
    const questions: Question[] = JSON.parse(stored);
    const filteredQuestions = questions.filter(q => q.id !== questionId);
    await AsyncStorage.setItem('questions', JSON.stringify(filteredQuestions));
    return true;
  } catch (error) {
    console.error('Failed to delete question:', error);
    return false;
  }
};

// Demo Data Initialization
export const initializeDemoData = async (): Promise<void> => {
  try {
    // Initialize demo admins
    const demoAdmins: Admin[] = [
      {
        id: '1',
        name: 'Super Admin',
        email: 'admin@vidyank.com',
        role: 'SuperAdmin',
        status: 'Active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'Exam Manager',
        email: 'manager@vidyank.com',
        role: 'ExamManager',
        status: 'Active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-02',
      },
    ];
    await AsyncStorage.setItem('admins', JSON.stringify(demoAdmins));

    // Initialize demo admin users for multi-tenant
    const demoAdminUsers: AdminUser[] = [
      {
        id: '1',
        companyId: 'company1',
        name: 'Super Admin',
        email: 'admin@vidyank.com',
        password: 'admin123',
        role: 'SuperAdmin',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        companyId: 'company1',
        name: 'Exam Manager',
        email: 'manager@vidyank.com',
        password: 'manager123',
        role: 'ExamManager',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
    await AsyncStorage.setItem('adminUsers', JSON.stringify(demoAdminUsers));

    // Initialize demo exams
    const demoExams: Exam[] = [
      {
        id: '1',
        title: 'UPSC Prelims Mock Test 2024',
        subject: 'General Studies',
        difficulty: 'Hard',
        duration: 120,
        questions: 100,
        status: 'Active',
        isPublic: true,
        createdBy: '1',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'MPSC State Services Practice',
        subject: 'Maharashtra GK',
        difficulty: 'Medium',
        duration: 90,
        questions: 75,
        status: 'Active',
        isPublic: true,
        createdBy: '1',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
      },
    ];
    await AsyncStorage.setItem('exams', JSON.stringify(demoExams));

    // Initialize demo candidates
    const demoCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Rahul Singh',
        email: 'rahul.singh@example.com',
        phone: '+919876543210',
        status: 'Active',
        plan: 'Premium',
        lastLogin: new Date().toISOString(),
        examAttempts: 5,
        createdAt: '2024-01-10',
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+919876543211',
        status: 'Active',
        plan: 'Basic',
        lastLogin: new Date().toISOString(),
        examAttempts: 3,
        createdAt: '2024-01-12',
      },
    ];
    await AsyncStorage.setItem('candidates', JSON.stringify(demoCandidates));

    // Initialize demo questions
    const demoQuestions: Question[] = [
      {
        id: '1',
        examId: '1',
        question: 'Who is known as the Father of the Indian Constitution?',
        type: 'single',
        options: ['Mahatma Gandhi', 'B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
        answer: 1,
        difficulty: 'Medium',
        subject: 'Polity',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        examId: '1',
        question: 'Which of the following are fundamental rights?',
        type: 'multi',
        options: ['Right to Equality', 'Right to Vote', 'Right to Freedom', 'Right to Property'],
        answer: [0, 2],
        difficulty: 'Hard',
        subject: 'Polity',
        createdAt: '2024-01-15',
      },
    ];
    await AsyncStorage.setItem('questions', JSON.stringify(demoQuestions));

    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize demo data:', error);
    throw error;
  }
};

// Statistics and Analytics
export const getExamStatistics = async (): Promise<any> => {
  try {
    const exams = await getAllExams();
    const candidates = await getAllCandidates();
    
    return {
      totalExams: exams.length,
      activeExams: exams.filter(e => e.status === 'Active').length,
      totalCandidates: candidates.length,
      activeCandidates: candidates.filter(c => c.status === 'Active').length,
      totalAttempts: candidates.reduce((sum, c) => sum + c.examAttempts, 0),
    };
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return {
      totalExams: 0,
      activeExams: 0,
      totalCandidates: 0,
      activeCandidates: 0,
      totalAttempts: 0,
    };
  }
}; 