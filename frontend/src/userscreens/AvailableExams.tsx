import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Dimensions, RefreshControl, useWindowDimensions, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from './DashboardHeader';
import BlankHeader from './BlankHeader';
import UserDashboardLayout from './UserDashboardLayout';
import { getUserSidebarItems } from './userSidebarItems';
import api from '../services/api';

const AvailableExams = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 768;
  const isMobile = windowWidth < 640;

  // Initial width estimation to prevent layout flash
  // Desktop has sidebar (~260px) + layout padding (~40px)
  const initialWidth = isDesktop ? windowWidth - 300 : windowWidth;
  const [containerWidth, setContainerWidth] = useState(initialWidth);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigation = useNavigation<any>();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get number of columns based on CONTAINER width (not window)
  const getNumColumns = () => {
    if (containerWidth >= 900) return 3;
    if (containerWidth >= 550) return 2;
    return 1;
  };

  const numColumns = getNumColumns();

  // Get card width based on screen size and columns
  const getCardWidth = () => {
    const horizontalPadding = isDesktop ? 48 : 32; // listContainer padding
    const gap = 20;
    const totalGap = (numColumns - 1) * gap;
    const availableWidth = containerWidth - horizontalPadding - totalGap;
    return Math.floor(availableWidth / numColumns); // Floor to avoid sub-pixel overflow
  };

  const cardWidth = getCardWidth();

  const closeSidebar = () => {
    setSidebarCollapsed(true);
  };

  const sidebarItems = getUserSidebarItems(navigation, closeSidebar, 'Available Exams');

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const fetchExams = async () => {
    try {
      const { data } = await api.get('/exams');
      const activeExams = data
        .filter((exam: any) => exam.status === 'Active')
        .map((exam: any) => ({ ...exam, id: exam._id || exam.id }));
      setExams(activeExams);
    } catch (e) {
      console.error('Error fetching exams:', e);
      setExams([]);
    }
  };

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      await fetchExams();
      setLoading(false);
    };
    loadExams();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExams();
    setRefreshing(false);
  };

  const handleStartTest = (exam: any) => {
    navigation.navigate('TakeExam', { examId: exam.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your exams...</Text>
      </View>
    );
  }

  const renderExamCard = ({ item, index }: any) => {
    const variations = [
      { bg: '#FFFCF2', sectionBg: '#FFF3CD', icon: 'school', iconColor: '#FFB300' },
      { bg: '#F0FDFF', sectionBg: '#E0F2FE', icon: 'flask', iconColor: '#0EA5E9' },
      { bg: '#FFF5F7', sectionBg: '#FFE4E6', icon: 'medkit', iconColor: '#E11D48' },
      { bg: '#F5F5FF', sectionBg: '#E0E7FF', icon: 'briefcase', iconColor: '#4F46E5' },
      { bg: '#F0FDF4', sectionBg: '#DCFCE7', icon: 'leaf', iconColor: '#16A34A' },
      { bg: '#FAFAFA', sectionBg: '#E4E4E7', icon: 'grid', iconColor: '#52525B' },
    ];

    const styleVar = variations[index % variations.length];
    const isSmallMobile = windowWidth < 400;

    return (
      <TouchableOpacity
        style={[styles.examCard, { width: cardWidth, height: 200 }]}
        onPress={() => handleStartTest(item)}
        activeOpacity={0.9}
      >
        <View style={[styles.cardLeftContent, isMobile && { padding: 16, marginRight: 80 }]}>
          <Text style={[styles.cardTitle, isSmallMobile && { fontSize: 18 }]} numberOfLines={2}>{item.title}</Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>{item.subject || 'Exams'}</Text></View>
            {item.difficulty && !isSmallMobile && <View style={styles.tag}><Text style={styles.tagText}>{item.difficulty}</Text></View>}
            <View style={styles.tag}><Text style={[styles.tagText, isMobile && { fontSize: 10 }]}>{item.duration}m</Text></View>
          </View>

          <View style={styles.exploreButton}>
            <Text style={[styles.exploreText, isSmallMobile && { fontSize: 12 }]}>{isSmallMobile ? 'Explore' : 'Explore Category'}</Text>
            <View style={[styles.arrowContainer, isMobile && { width: 24, height: 24 }]}>
              <Ionicons name="arrow-forward" size={14} color="#334155" />
            </View>
          </View>
        </View>

        <View style={[
          styles.cardRightDecoration,
          { backgroundColor: styleVar.sectionBg },
          isMobile && { width: 90, borderTopLeftRadius: 60, borderBottomLeftRadius: 60 }
        ]}>
          <Ionicons name={styleVar.icon as any} size={isMobile ? 32 : 42} color={styleVar.iconColor} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <UserDashboardLayout title="Available Exams" activeLabel="Available Exams">
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <FlatList
          key={`${numColumns}-${containerWidth}`} // Force re-render on size change
          data={exams}
          keyExtractor={item => item.id}
          renderItem={renderExamCard}
          contentContainerStyle={[
            styles.listContainer,
            { paddingHorizontal: isDesktop ? 24 : 16 }
          ]}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyText}>
                No active exams found. Pull down to refresh.
              </Text>
            </View>
          }
        />
      </View>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 24,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 20,
  },
  examCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardLeftContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    zIndex: 10,
    marginRight: 60,
  },
  cardRightDecoration: {
    width: 140,
    height: '150%',
    top: '-25%',
    right: 0,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  tagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9', // Light gray circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default AvailableExams;