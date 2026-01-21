import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboardLayout from './UserDashboardLayout';
import { colors } from '../theme';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user: contextUser } = useUser();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, [contextUser]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            // Try context user first, then AsyncStorage
            if (contextUser) {
                setUser(contextUser);
            } else {
                const userRaw = await AsyncStorage.getItem('currentUser');
                if (userRaw) {
                    setUser(JSON.parse(userRaw));
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('authToken');
                            await AsyncStorage.removeItem('currentUser');
                            await AsyncStorage.removeItem('userInfo');
                            await AsyncStorage.removeItem('sessionData');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Index' }],
                            });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out');
                        }
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        navigation.navigate('Settings');
    };

    if (loading) {
        return (
            <UserDashboardLayout title="Profile" activeLabel="Profile">
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </UserDashboardLayout>
        );
    }

    return (
        <UserDashboardLayout title="My Profile" activeLabel="Profile">
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={60} color="#fff" />
                        </View>
                    </View>

                    <Text style={styles.userName}>
                        {user?.firstName || user?.name || 'User'} {user?.lastName || ''}
                    </Text>

                    {user?.email && (
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={18} color="#6b7280" />
                            <Text style={styles.infoText}>{user.email}</Text>
                        </View>
                    )}

                    {user?.phone && (
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={18} color="#6b7280" />
                            <Text style={styles.infoText}>{user.phone}</Text>
                        </View>
                    )}
                </View>

                {/* Additional Info Card */}
                {(user?.city || user?.category || user?.instituteName) && (
                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Additional Information</Text>

                        {user?.city && (
                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={20} color="#4f46e5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>City</Text>
                                    <Text style={styles.infoValue}>{user.city}</Text>
                                </View>
                            </View>
                        )}

                        {user?.category && (
                            <View style={styles.infoItem}>
                                <Ionicons name="pricetag-outline" size={20} color="#4f46e5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Category</Text>
                                    <Text style={styles.infoValue}>{user.category}</Text>
                                </View>
                            </View>
                        )}

                        {user?.instituteName && (
                            <View style={styles.infoItem}>
                                <Ionicons name="school-outline" size={20} color="#4f46e5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Institute</Text>
                                    <Text style={styles.infoValue}>{user.instituteName}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsCard}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleEditProfile}
                        activeOpacity={0.7}
                    >
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="create-outline" size={24} color="#4f46e5" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Edit Profile</Text>
                            <Text style={styles.actionSubtitle}>Update your personal information</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Settings')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="settings-outline" size={24} color="#4f46e5" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Settings</Text>
                            <Text style={styles.actionSubtitle}>Manage app preferences</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('RateUsScreen')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="star-outline" size={24} color="#f59e0b" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Rate Us</Text>
                            <Text style={styles.actionSubtitle}>Share your feedback</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </UserDashboardLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#eef2ff',
    },
    userName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 15,
        color: '#6b7280',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        gap: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#9ca3af',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    actionsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        minHeight: 72,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    logoutButton: {
        backgroundColor: '#dc2626',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        minHeight: 60,
        elevation: 3,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        gap: 12,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#9ca3af',
        marginTop: 8,
    },
});

export default Profile;
