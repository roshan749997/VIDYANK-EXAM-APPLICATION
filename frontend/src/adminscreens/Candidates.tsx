import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  BackHandler,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import AdminLayout from './AdminLayout';
import AddCandidateModal from './AddCandidateModal';
import api from '../services/api';

// Utility function for formatting date
function formatDate(dateString: string) {
  if (!dateString || dateString === 'Never') return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const Candidates = () => {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 900;
  const isDesktop = windowWidth >= 900;
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modern search bar UI
  const renderSearchBar = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
      marginVertical: 16,
      paddingHorizontal: 12,
      marginHorizontal: isMobile ? 8 : 0,
    }}>
      <Ionicons name="search-outline" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Search candidates..."
        style={{ flex: 1, paddingVertical: 10, fontSize: 14, color: '#1f2937' }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const { data } = await api.get('/users');
        const mapped = data.map((u: any) => ({
          id: u._id || u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.phone || 'N/A',
          status: 'Active',
          lastLogin: u.updatedAt,
          registeredDate: u.createdAt,
          examsAttempted: 0
        }));
        setCandidates(mapped);
      } catch (e) {
        console.error('Error loading candidates', e);
      }
    };
    loadCandidates();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      (navigation as any).navigate('AdminDashboard');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);

  const filteredCandidates = candidates.filter(candidate => {
    const nameMatch = candidate.name ? candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const emailMatch = candidate.email ? candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = nameMatch || emailMatch;
    const matchesFilter = filterStatus === 'All' || candidate.status === filterStatus;
    return matchesSearch && matchesFilter;
  });


  // ...

  const handleDeleteCandidate = async (id: any) => {
    try {
      await api.delete(`/users/${id}`);
      const updated = candidates.filter(c => c.id !== id);
      setCandidates(updated);
      Alert.alert('Deleted', 'Candidate deleted successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to delete candidate.');
    }
  };

  const toggleCandidateStatus = async (id: any) => {
    // Logic to toggle status on backend or mock locally if backend doesn't support status toggle
    // For now, we update local state
    setCandidates(candidates.map(candidate =>
      candidate.id === id
        ? { ...candidate, status: candidate.status === 'Active' ? 'Inactive' : 'Active' }
        : candidate
    ));
  };



  const CandidateCard = ({ item }: { item: any }) => (
    <View style={styles.candidateCard}>
      <View style={styles.candidateHeader}>
        <View style={styles.candidateInfo}>
          <Text style={styles.candidateName}>{item.name}</Text>
          <Text style={styles.candidateEmail}>{item.email}</Text>
          <Text style={styles.candidatePhone}>{item.phone}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Active' ? '#10B981' : '#EF4444' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.candidateStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.examsAttempted} Exams</Text>
          <Text style={styles.statLabel}>Exams</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDate(item.lastLogin)}</Text>
          <Text style={styles.statLabel}>Last Login</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDate(item.registeredDate)}</Text>
          <Text style={styles.statLabel}>Registered</Text>
        </View>
      </View>
      <View style={styles.candidateActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleCandidateStatus(item.id)}
        >
          <Ionicons
            name={item.status === 'Active' ? 'pause-circle' : 'play-circle'}
            size={20}
            color="#6366F1"
          />
          <Text style={styles.actionText}>
            {item.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteCandidate(item.id)}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AdminLayout title="Candidates">
      <View style={styles.container}>
        {renderSearchBar()}
        {/* Search and Filter */}
        <View style={styles.filterContainer}>
          {['All', 'Active', 'Inactive'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, filterStatus === filter && styles.activeFilterButton]}
              onPress={() => setFilterStatus(filter)}
            >
              <Text style={[styles.filterText, filterStatus === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.addButton, { marginTop: 12, backgroundColor: '#282FFB' }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Candidate</Text>
        </TouchableOpacity>

        {/* Candidates List with ScrollView */}
        <ScrollView
          style={styles.candidatesContainer}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.candidatesContentContainer}
        >
          {filteredCandidates.map((item) => (
            <CandidateCard key={item.id.toString()} item={item} />
          ))}
        </ScrollView>
      </View>
      {/* Add Candidate Modal */}
      <AddCandidateModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCandidateAdded={(candidate) => {
          setCandidates([...candidates, candidate]);
        }}
      />

    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#282FFB',
    paddingHorizontal: 8, // कमी केले
    paddingVertical: 6,   // कमी केले
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start', // हे जोडा
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14, // लहान
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeFilterButton: {
    backgroundColor: '#282FFB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  candidateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  candidateEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  candidatePhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  candidateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  candidateActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  candidatesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  candidatesContentContainer: {
    paddingBottom: 20,
  },
});

export default Candidates; 