import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import UserDashboardLayout from '../components/UserDashboardLayout';
import api from '../services/api';
import theme from '../newTheme';

interface Exam {
    _id: string;
    title: string;
    subject: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: number;
    totalQuestions: number;
    description?: string;
    status: string;
}

const AvailableExamsNew: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<string>('All');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/exams');
            const activeExams = response.data
                .filter((exam: any) => exam.status === 'Active')
                .map((exam: any) => ({
                    _id: exam._id,
                    title: exam.title,
                    subject: exam.subject || 'General',
                    difficulty: exam.difficulty || 'Medium',
                    duration: exam.duration || 60,
                    totalQuestions: exam.totalQuestions || exam.questions?.length || 0,
                    description: exam.description,
                    status: exam.status,
                }));
            setExams(activeExams);
        } catch (err: any) {
            console.error('Error fetching exams:', err);
            setError('Failed to load exams. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchExams();
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return theme.colors.difficultyEasy;
            case 'Hard':
                return theme.colors.difficultyHard;
            default:
                return theme.colors.difficultyMedium;
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'trending-down';
            case 'Hard':
                return 'trending-up';
            default:
                return 'remove';
        }
    };

    const filteredExams = filter === 'All'
        ? exams
        : exams.filter(exam => exam.subject === filter);

    const subjects = ['All', ...Array.from(new Set(exams.map(e => e.subject)))];

    const renderExamCard = ({ item }: { item: Exam }) => (
        <TouchableOpacity
            style={[styles.examCard, isMobile && styles.examCardMobile]}
            onPress={() => navigation.navigate('TakeExam', { examId: item._id })}
            activeOpacity={0.7}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.examTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.examSubject}>{item.subject}</Text>
                </View>
            </View>

            {/* Description */}
            {item.description && (
                <Text style={styles.examDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Ionicons name="help-circle-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.statText}>{item.totalQuestions} Questions</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.statText}>{item.duration} mins</Text>
                </View>
            </View>

            {/* Difficulty Badge */}
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
                <Ionicons
                    name={getDifficultyIcon(item.difficulty)}
                    size={14}
                    color={getDifficultyColor(item.difficulty)}
                />
                <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
                    {item.difficulty}
                </Text>
            </View>

            {/* Start Button */}
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('TakeExam', { examId: item._id })}
            >
                <Text style={styles.startButtonText}>Start Exam</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Exams Available</Text>
            <Text style={styles.emptyText}>
                {filter === 'All'
                    ? 'Check back later for new exams!'
                    : `No exams found in ${filter} category.`}
            </Text>
            {filter !== 'All' && (
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => setFilter('All')}
                >
                    <Text style={styles.resetButtonText}>View All Exams</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.errorState}>
            <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchExams}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <UserDashboardLayout title="Available Exams" activeLabel="Available Exams">
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Choose Your Exam</Text>
                    <Text style={styles.pageSubtitle}>
                        {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'} available
                    </Text>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={subjects}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filter === item && styles.filterChipActive,
                                ]}
                                onPress={() => setFilter(item)}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        filter === item && styles.filterChipTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.filterList}
                    />
                </View>

                {/* Content */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading exams...</Text>
                    </View>
                ) : error ? (
                    renderErrorState()
                ) : (
                    <FlatList
                        data={filteredExams}
                        keyExtractor={(item) => item._id}
                        renderItem={renderExamCard}
                        ListEmptyComponent={renderEmptyState}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]}
                            />
                        }
                    />
                )}
            </View>
        </UserDashboardLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    pageTitle: {
        fontSize: theme.typography.h2,
        fontWeight: theme.typography.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    pageSubtitle: {
        fontSize: theme.typography.small,
        color: theme.colors.textSecondary,
    },
    filterContainer: {
        paddingBottom: theme.spacing.md,
    },
    filterList: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    filterChip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: theme.spacing.sm,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        fontSize: theme.typography.small,
        fontWeight: theme.typography.medium,
        color: theme.colors.textSecondary,
    },
    filterChipTextActive: {
        color: theme.colors.textInverse,
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    examCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    examCardMobile: {
        padding: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    headerText: {
        flex: 1,
    },
    examTitle: {
        fontSize: theme.typography.h4,
        fontWeight: theme.typography.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    examSubject: {
        fontSize: theme.typography.small,
        color: theme.colors.primary,
        fontWeight: theme.typography.medium,
    },
    examDescription: {
        fontSize: theme.typography.small,
        color: theme.colors.textSecondary,
        lineHeight: theme.typography.lineHeightNormal * theme.typography.small,
        marginBottom: theme.spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    statText: {
        fontSize: theme.typography.small,
        color: theme.colors.textSecondary,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    difficultyText: {
        fontSize: theme.typography.tiny,
        fontWeight: theme.typography.semibold,
    },
    startButton: {
        ...theme.commonStyles.primaryButton,
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    startButtonText: {
        ...theme.commonStyles.primaryButtonText,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xxl,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.body,
        color: theme.colors.textSecondary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xxl,
    },
    emptyTitle: {
        fontSize: theme.typography.h3,
        fontWeight: theme.typography.bold,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    emptyText: {
        fontSize: theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    resetButton: {
        ...theme.commonStyles.secondaryButton,
    },
    resetButtonText: {
        ...theme.commonStyles.secondaryButtonText,
    },
    errorState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xxl,
    },
    errorTitle: {
        fontSize: theme.typography.h3,
        fontWeight: theme.typography.bold,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    errorText: {
        fontSize: theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    retryButton: {
        ...theme.commonStyles.primaryButton,
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    retryButtonText: {
        ...theme.commonStyles.primaryButtonText,
    },
});

export default AvailableExamsNew;
