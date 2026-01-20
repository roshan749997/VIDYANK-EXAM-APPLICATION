import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, useWindowDimensions, Platform } from 'react-native';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from '../components/DashboardHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BlankHeader from '../components/BlankHeader';
import { getUserSidebarItems } from '../components/userSidebarItems';
import UserDashboardLayout from '../components/UserDashboardLayout';
import { useUser } from '../context/UserContext';
import api from '../services/api';

interface LeaderboardUser {
  _id: string;
  rank: number;
  name: string;
  city?: string;
  averageScore: number;
  totalExams: number;
  bestScore: number;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 900;
  const isDesktop = windowWidth >= 1024;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useUser();

  // State for leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exam-results/leaderboard?period=${period}`);

        // Mark current user
        const leaderboardData = response.data.map((entry: any) => ({
          ...entry,
          isCurrentUser: user?._id === entry._id.toString(),
        }));

        setLeaderboard(leaderboardData);
        setError('');
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.response?.data?.message || 'Failed to load leaderboard');
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user, period]);

  useFocusEffect(
    React.useCallback(() => {
      setSidebarCollapsed(isMobile);
    }, [isMobile])
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const sidebarItems = getUserSidebarItems(navigation, () => setSidebarCollapsed(true), 'Leaderboard');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#4f46e5';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'trending-up';
    if (change < 0) return 'trending-down';
    return 'remove';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#16a34a';
    if (change < 0) return '#dc2626';
    return '#6b7280';
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardUser; index: number }) => (
    <TouchableOpacity
      style={[
        styles.leaderboardRow,
        item.isCurrentUser && styles.currentUserRow,
        index === 0 && styles.firstPlace,
        index === 1 && styles.secondPlace,
        index === 2 && styles.thirdPlace,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.rankContainer}>
        <View style={[
          styles.rankBadge,
          { backgroundColor: getRankColor(item.rank) },
          item.rank <= 3 && styles.topRankBadge,
          isMobile && { width: 28, height: 28, borderRadius: 14 }
        ]}>
          {item.rank <= 3 ? (
            <Text style={styles.rankEmoji}>{getRankIcon(item.rank)}</Text>
          ) : (
            <Text style={[styles.rankText, item.rank <= 3 && styles.topRankText]}>
              {item.rank}
            </Text>
          )}
        </View>
        {item.change !== undefined && (
          <View style={styles.changeIndicator}>
            <Ionicons
              name={getChangeIcon(item.change)}
              size={12}
              color={getChangeColor(item.change)}
            />
            {item.change !== 0 && (
              <Text style={[styles.changeText, { color: getChangeColor(item.change) }]}>
                {Math.abs(item.change)}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <View style={[styles.avatarContainer, isMobile && { width: 28, height: 28, borderRadius: 14 }]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, item.isCurrentUser && styles.currentUserName, isMobile && { fontSize: 13 }]}>
            {item.name}
          </Text>
          {item.isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>You</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, item.isCurrentUser && styles.currentUserScore, isMobile && { fontSize: 15 }]}>
          {Math.round(item.averageScore)}
        </Text>
        <Text style={styles.scoreLabel}>avg score</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );

  const currentUser = leaderboard.find(user => user.isCurrentUser);

  if (loading) {
    return (
      <UserDashboardLayout title="Leaderboard" activeLabel="Leaderboard">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Loading leaderboard...</Text>
        </View>
      </UserDashboardLayout>
    );
  }

  if (error) {
    return (
      <UserDashboardLayout title="Leaderboard" activeLabel="Leaderboard">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={{ fontSize: 16, color: '#ef4444', marginTop: 12 }}>{error}</Text>
          <TouchableOpacity
            style={{ marginTop: 16, backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
            onPress={() => setPeriod('all')}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </UserDashboardLayout>
    );
  }

  // Helper to chunk leaderboard users into pairs for desktop
  const chunkedLeaderboard = [];
  for (let i = 0; i < leaderboard.length; i += 2) {
    chunkedLeaderboard.push(leaderboard.slice(i, i + 2));
  }

  if (isDesktop) {
    return (
      <UserDashboardLayout title="Leaderboard" activeLabel="Leaderboard">
        {/* Stats Card at the top */}
        <GlassCard style={{
          padding: 24,
          marginTop: 32,
          marginBottom: 32,
          width: '100%',
          maxWidth: '100%',
          alignSelf: 'stretch'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1f2937' }}>Leaderboard Overview</Text>
            <Ionicons name="analytics-outline" size={24} color="#4f46e5" />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', marginBottom: 4 }}>{leaderboard.length}</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: '500' }}>Total Participants</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#16a34a', marginBottom: 4 }}>{leaderboard.length > 0 ? Math.round(leaderboard[0].averageScore) : 'N/A'}</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: '500' }}>Top Score</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', marginBottom: 4 }}>#{currentUser?.rank || 'N/A'}</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: '500' }}>Your Rank</Text>
            </View>
          </View>
        </GlassCard>
        {/* Two-column leaderboard cards */}
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 80, alignItems: 'center', flexGrow: 1 }}>
          <View style={{ width: '100%', maxWidth: '100%', alignSelf: 'stretch' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>All Participants</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: '500' }}>{leaderboard.length} users</Text>
            </View>
            {chunkedLeaderboard.map((pair, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: rowIdx === 0 ? 24 : 16, gap: 24 }}>
                {pair.map((item: LeaderboardUser, colIdx: number) => (
                  <GlassCard
                    key={item._id}
                    style={{
                      flex: 1,
                      minHeight: 120,
                      minWidth: 0,
                      maxWidth: '49%',
                      marginBottom: 0,
                      alignSelf: 'center',
                      padding: 0,
                      backgroundColor: '#f9fafb',
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 16,
                      transition: 'box-shadow 0.2s',
                      ...(Platform.OS === 'android' ? {
                        elevation: 0,
                        shadowColor: 'transparent',
                        borderWidth: 0,
                      } : {}),
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 28,
                        paddingHorizontal: 32,
                        width: '100%',
                        gap: 0,
                      }}
                      activeOpacity={0.85}
                    >
                      {/* Rank section */}
                      <View style={{ alignItems: 'center', marginRight: 32, minWidth: 56 }}>
                        <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }, item.rank <= 3 && styles.topRankBadge]}>
                          {item.rank <= 3 ? (
                            <Text style={styles.rankEmoji}>{getRankIcon(item.rank)}</Text>
                          ) : (
                            <Text style={[styles.rankText, item.rank <= 3 && styles.topRankText]}>{item.rank}</Text>
                          )}
                        </View>
                        {item.change !== undefined && (
                          <View style={styles.changeIndicator}>
                            <Ionicons
                              name={getChangeIcon(item.change)}
                              size={16}
                              color={getChangeColor(item.change)}
                            />
                            {item.change !== 0 && (
                              <Text style={[styles.changeText, { color: getChangeColor(item.change) }]}> {Math.abs(item.change)} </Text>
                            )}
                          </View>
                        )}
                      </View>
                      {/* Avatar and Name section */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <View style={{
                          width: 54,
                          height: 54,
                          borderRadius: 27,
                          backgroundColor: '#e5e7eb',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 20,
                        }}>
                          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#4f46e5' }}>{item.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={styles.nameContainer}>
                          <Text style={{ fontSize: 20, fontWeight: '700', color: item.isCurrentUser ? '#4f46e5' : '#1f2937', maxWidth: 180 }} numberOfLines={1}>{item.name}</Text>
                          {item.isCurrentUser && (
                            <View style={styles.youBadge}>
                              <Text style={styles.youBadgeText}>You</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {/* Score section */}
                      <View style={{ alignItems: 'flex-end', minWidth: 90, marginLeft: 24 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: item.isCurrentUser ? '#4f46e5' : '#16a34a' }}>{Math.round(item.averageScore)}</Text>
                        <Text style={styles.scoreLabel}>points</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={22} color="#9ca3af" style={{ marginLeft: 18 }} />
                    </TouchableOpacity>
                  </GlassCard>
                ))}
                {/* If only one card in last row, add a spacer for alignment */}
                {pair.length === 1 && <View style={{ flex: 1, minWidth: 0, maxWidth: '49%' }} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout title="Leaderboard" activeLabel="Leaderboard">
      <View style={[styles.mainContent, isMobile && { paddingHorizontal: 6, paddingTop: 4 }, isDesktop && { width: '90vw', maxWidth: 1200, alignSelf: 'center' }]}>
        {/* Your Position Card */}
        {currentUser && (
          <GlassCard style={[styles.yourPositionCard, isMobile && { marginBottom: 10, padding: 10 }, isDesktop && { width: '100%', alignSelf: 'center' }]}>
            <View style={styles.yourPositionHeader}>
              <Ionicons name="person" size={isMobile ? 16 : 20} color="#4f46e5" />
              <Text style={[styles.yourPositionTitle, isMobile && { fontSize: 15 }]}>Your Position</Text>
            </View>
            <View style={styles.yourPositionDetails}>
              <Text style={styles.yourPositionName}>{currentUser.name}</Text>
              <Text style={styles.yourPositionScore}>{Math.round(currentUser.averageScore)} points</Text>
              <Text style={styles.yourPositionRank}>Rank: #{currentUser.rank}</Text>
            </View>
          </GlassCard>
        )}
        {/* Leaderboard List */}
        <GlassCard style={[styles.leaderboardCard, isMobile && { padding: 10 }, isDesktop && { width: '100%', alignSelf: 'center' }]}>
          <View style={styles.leaderboardHeader}>
            <View style={styles.titleContainer}>
              <Ionicons name="trophy" size={isMobile ? 18 : 24} color="#ffd700" />
              <Text style={[styles.title, isMobile && { fontSize: 15 }]}>Top Performers</Text>
            </View>
            <Text style={[styles.totalUsers, isMobile && { fontSize: 11 }]}>{leaderboard.length} participants</Text>
          </View>
          {/* Add scrollable area for web/desktop */}
          <View style={[styles.scrollableArea, isDesktop && { maxHeight: 350, minHeight: 200, overflow: 'auto' }]}>
            <FlatList
              data={leaderboard}
              keyExtractor={item => item._id}
              renderItem={renderLeaderboardItem}
              showsVerticalScrollIndicator={true}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={[styles.listContainer, isMobile && { paddingBottom: 10 }]}
              style={isMobile ? { minWidth: 0 } : {}}
            />
          </View>
        </GlassCard>
      </View>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  yourPositionCard: {
    marginBottom: 10,
    padding: 10,
  },
  yourPositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  yourPositionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  yourPositionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yourPositionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  yourPositionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  yourPositionRank: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  leaderboardCard: {
    flex: 1,
    padding: 10,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  totalUsers: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginVertical: 2,
  },
  currentUserRow: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  firstPlace: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  secondPlace: {
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.3)',
  },
  thirdPlace: {
    backgroundColor: 'rgba(205, 127, 50, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(205, 127, 50, 0.3)',
  },
  separator: {
    height: 4,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topRankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  topRankText: {
    fontSize: 18,
    color: '#fff',
  },
  rankEmoji: {
    fontSize: 20,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  currentUserName: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  youBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  youBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  currentUserScore: {
    color: '#4f46e5',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  invisibleScroller: {
    // Hide scrollbar for web/desktop (not supported in RN styles, so left empty)
  },
  scrollableArea: {
    width: '100%',
    // For web/desktop, set a maxHeight and show scrollbar
    // For mobile, this will have no effect
  },
});

export default Leaderboard;