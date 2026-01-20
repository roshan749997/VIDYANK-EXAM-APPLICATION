import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utility for authentication
 * Use this to check registered users and add test users
 */

export const debugAuth = {
  /**
   * Get all registered users from AsyncStorage
   */
  async getAllUsers() {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      console.log('📋 Registered Users:', users);
      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return [];
    }
  },

  /**
   * Add a test user for development
   */
  async addTestUser() {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      // Check if test user already exists
      const testUserExists = users.find((u: any) => u.email === 'test@example.com');
      if (testUserExists) {
        console.log('✅ Test user already exists');
        return testUserExists;
      }

      // Add test user
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test123',
        city: 'Test City',
        phone: '1234567890',
        category: 'General',
        referralSource: 'Social Media',
        otp: '123456',
        instituteName: 'Test Institute',
        termsAccepted: true,
      };

      users.push(testUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('✅ Test user added successfully!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: test123');
      return testUser;
    } catch (error) {
      console.error('❌ Error adding test user:', error);
      return null;
    }
  },

  /**
   * Clear all users (use with caution!)
   */
  async clearAllUsers() {
    try {
      await AsyncStorage.removeItem('users');
      console.log('🗑️ All users cleared');
    } catch (error) {
      console.error('❌ Error clearing users:', error);
    }
  },

  /**
   * Get current logged-in user
   */
  async getCurrentUser() {
    try {
      const currentUserRaw = await AsyncStorage.getItem('currentUser');
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      console.log('👤 Current User:', currentUser);
      return currentUser;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  },
};

// Make it available globally in development mode
if (__DEV__) {
  // @ts-ignore
  global.debugAuth = debugAuth;
  console.log('🔧 Debug Auth available: Use debugAuth.getAllUsers(), debugAuth.addTestUser(), etc.');
}

export default debugAuth;
