import AsyncStorage from '@react-native-async-storage/async-storage';

export const getExams = async () => [];
export const addExam = async (exam: any) => {};
export const updateExam = async (exam: any) => {};
export const deleteExam = async (id: string) => {};
export const getNotifications = async () => [];
export const sendNotification = async (notification: any) => {};

// User type for admin and student
export type User = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  role?: 'admin' | 'student';
};

// Login user (mock: admin@vidyank.com / admin123, student@vidyank.com / student123)
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  if (
    (email === 'admin@vidyank.com' && password === 'admin123') ||
    (email === 'student@vidyank.com' && password === 'student123')
  ) {
    const user: User = {
      name: email === 'admin@vidyank.com' ? 'Admin User' : 'Student User',
      email,
      role: email === 'admin@vidyank.com' ? 'admin' : 'student',
    };
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  // Check registered users
  const usersRaw = await AsyncStorage.getItem('users');
  const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
  const found = users.find(u => u.email === email && u.password === password);
  if (found) {
    await AsyncStorage.setItem('currentUser', JSON.stringify(found));
    return found;
  }
  return null;
};

export const setCurrentUser = async (user: User) => {
  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userRaw = await AsyncStorage.getItem('currentUser');
  return userRaw ? JSON.parse(userRaw) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem('currentUser');
};

export const registerUser = async (user: User): Promise<boolean> => {
  const usersRaw = await AsyncStorage.getItem('users');
  const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
  if (users.find(u => u.email === user.email)) {
    return false; // Email already registered
  }
  users.push(user);
  await AsyncStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const updateUserProfile = async (email: string, updates: Partial<User>): Promise<boolean> => {
  const usersRaw = await AsyncStorage.getItem('users');
  let users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...updates };
  await AsyncStorage.setItem('users', JSON.stringify(users));
  // Also update currentUser if matches
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.email === email) {
    await setCurrentUser(users[idx]);
  }
  return true;
};

// Save exam result (mock)
export const saveExamResult = async (result: any) => {
  const resultsRaw = await AsyncStorage.getItem('examResults');
  const results = resultsRaw ? JSON.parse(resultsRaw) : [];
  results.push(result);
  await AsyncStorage.setItem('examResults', JSON.stringify(results));
}; 