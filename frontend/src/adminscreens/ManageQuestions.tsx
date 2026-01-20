import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import AdminLayout from '../components/AdminLayout';

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  questions: number;
  status: 'Active' | 'Draft' | 'Archived';
}

const ManageQuestions: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { examId } = route.params || {};
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [newQ, setNewQ] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    loadExamAndQuestions();
  }, [examId]);

  const loadExamAndQuestions = async () => {
    setLoading(true);
    try {
      // Load exam details directly from API
      const { data } = await api.get(`/exams/${examId}`);
      // Map _id to id if necessary, though backend returns _id
      const examData = { ...data, id: data._id || data.id };
      setExam(examData);
      setQuestions(examData.questions || []);
    } catch (error) {
      console.error('Error loading exam and questions:', error);
      setQuestions([]);
      setExam(null);
      Alert.alert('Error', 'Failed to load exam details.');
    } finally {
      setLoading(false);
    }
  };

  const saveQuestions = async (qs: Question[]) => {
    try {
      // Update the exam with new questions list
      // Note: Backend expects specific fields, we are sending partial update
      // But updateExam controller updates whatever is sent.
      // We also need to update total questions count/duration if we want, but controller sets totalQuestions length automatically in pre-save? 
      // Yes, Exam.js pre('save') sets totalQuestions.

      const { data } = await api.put(`/exams/${examId}`, { questions: qs });
      setQuestions(data.questions || qs);
      setExam({ ...data, id: data._id || data.id }); // update local exam state to match backend
      return true;
    } catch (error) {
      console.error('Error saving questions:', error);
      Alert.alert('Error', 'Failed to save questions.');
      return false;
    }
  };

  // We don't need updateExamQuestionCount anymore as backend handles it or we update it via saveQuestions
  const updateExamQuestionCount = async (count: number) => {
    // No-op or removed, as saveQuestions handles the update
  };

  const allFieldsFilled = Boolean(newQ.trim() && newOptions.every(opt => opt.trim()) && newAnswer !== '');

  const handleAddQuestion = async () => {
    if (!allFieldsFilled) {
      setShowError(true);
      return;
    }
    const q: Question = {
      id: Date.now().toString(),
      text: newQ,
      options: [...newOptions],
      answer: parseInt(newAnswer, 10),
    };
    const updated = [...questions, q];
    await saveQuestions(updated);
    setNewQ('');
    setNewOptions(['', '', '', '']);
    setNewAnswer('');
    setShowError(false);
    setSuccessMsg('Question added successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
    inputRef.current?.focus();
    await updateExamQuestionCount(updated.length);
  };

  const handleDelete = async (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    await saveQuestions(updated);
    await updateExamQuestionCount(updated.length);
    setQuestions(updated);
    setSuccessMsg('Question deleted successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Manage Questions">
        <SafeAreaView style={styles.loadingContainer}>
          <LinearGradient
            colors={['#282FFB', '#282FFB40']}
            style={styles.loadingGradient}
          >
            <View style={styles.loadingContent}>
              <Ionicons name="hourglass-outline" size={48} color="white" />
              <Text style={styles.loadingText}>Loading Questions...</Text>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </AdminLayout>
    );
  }

  if (!exam) {
    return (
      <AdminLayout title="Manage Questions">
        <SafeAreaView style={styles.errorContainer}>
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.errorGradient}
          >
            <View style={styles.errorContent}>
              <Ionicons name="warning-outline" size={64} color="white" />
              <Text style={styles.errorTitle}>Exam Not Found</Text>
              <Text style={styles.errorDescription}>
                The exam you're looking for doesn't exist or has been removed.
              </Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color="#f5576c" />
                <Text style={styles.errorButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Questions">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={questions}
          keyExtractor={q => q.id}
          renderItem={({ item, index }) => (
            <View style={styles.questionContainer}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.questionCard}
              >
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumberContainer}>
                    <LinearGradient
                      colors={['#282FFB', '#282FFB40']}
                      style={styles.questionNumberBadge}
                    >
                      <Text style={styles.questionNumber}>Q{index + 1}</Text>
                    </LinearGradient>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                  >
                    <LinearGradient
                      colors={['#ff6b6b', '#ee5a52']}
                      style={styles.deleteButtonGradient}
                    >
                      <Ionicons name="trash-outline" size={16} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <Text style={styles.questionText}>{item.text}</Text>

                <View style={styles.optionsContainer}>
                  {item.options.map((opt, idx) => (
                    <View key={idx} style={styles.optionItem}>
                      <View style={[
                        styles.optionBadge,
                        idx === item.answer ? styles.correctOptionBadge : styles.regularOptionBadge
                      ]}>
                        <Text style={[
                          styles.optionLabel,
                          idx === item.answer ? styles.correctOptionLabel : styles.regularOptionLabel
                        ]}>
                          {String.fromCharCode(65 + idx)}
                        </Text>
                      </View>
                      <Text style={[
                        styles.optionText,
                        idx === item.answer ? styles.correctOptionText : styles.regularOptionText
                      ]}>
                        {opt}
                      </Text>
                      {idx === item.answer && (
                        <View style={styles.correctIndicator}>
                          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={['#282FFB', '#282FFB40']}
                style={styles.emptyGradient}
              >
                <Ionicons name="library-outline" size={64} color="white" />
                <Text style={styles.emptyTitle}>No Questions Yet</Text>
                <Text style={styles.emptyDescription}>
                  Create your first question using the form above
                </Text>
              </LinearGradient>
            </View>
          }
          ListHeaderComponent={
            <>
              {/* Exam Header */}
              <View style={styles.examHeaderContainer}>
                <LinearGradient
                  colors={['#282FFB', '#282FFB40']}
                  style={styles.examHeaderGradient}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('QuestionsPage')}
                    style={styles.backButton}
                  >
                    <View style={styles.backButtonContent}>
                      <Ionicons name="arrow-back" size={24} color="white" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <View style={styles.examMeta}>
                      <View style={styles.examSubjectBadge}>
                        <Ionicons name="book-outline" size={14} color="white" />
                        <Text style={styles.examSubject}>{exam.subject}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}>
                        <Ionicons name="speedometer-outline" size={14} color="white" />
                        <Text style={styles.difficultyText}>{exam.difficulty}</Text>
                      </View>
                      <View style={styles.examMetaBadge}>
                        <Ionicons name="time-outline" size={14} color="white" />
                        <Text style={styles.examMetaText}>{exam.duration}m</Text>
                      </View>
                      <View style={styles.examMetaBadge}>
                        <Ionicons name="help-circle-outline" size={14} color="white" />
                        <Text style={styles.examMetaText}>{questions.length}</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Add Question Form */}
              <View style={styles.addQuestionContainer}>
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.addQuestionCard}
                >
                  <View style={styles.addQuestionHeader}>
                    <View style={styles.addQuestionIconContainer}>
                      <LinearGradient
                        colors={['#282FFB', '#282FFB40']}
                        style={styles.addQuestionIcon}
                      >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.addQuestionTitle}>Add New Question</Text>
                  </View>

                  {successMsg ? (
                    <View style={styles.successContainer}>
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      <Text style={styles.successMsg}>{successMsg}</Text>
                    </View>
                  ) : null}

                  <View style={styles.formContainer}>
                    <Text style={[styles.label, showError && !newQ.trim() && styles.errorLabel]}>
                      Question Text
                    </Text>
                    <TextInput
                      ref={inputRef}
                      style={[styles.input, showError && !newQ.trim() && styles.errorInput]}
                      value={newQ}
                      onChangeText={t => { setNewQ(t); setShowError(false); }}
                      placeholder="Enter your question here..."
                      multiline
                      numberOfLines={3}
                      placeholderTextColor="#9ca3af"
                    />

                    {newOptions.map((opt, idx) => (
                      <View key={idx} style={styles.optionInputContainer}>
                        <Text style={[styles.label, showError && !opt.trim() && styles.errorLabel]}>
                          Option {idx + 1}
                        </Text>
                        <View style={styles.optionInputRow}>
                          <TextInput
                            style={[styles.optionInput, showError && !opt.trim() && styles.errorInput]}
                            value={opt}
                            onChangeText={t => { setNewOptions(o => o.map((oo, i) => i === idx ? t : oo)); setShowError(false); }}
                            placeholder={`Enter option ${idx + 1}`}
                            placeholderTextColor="#9ca3af"
                          />
                          <TouchableOpacity
                            onPress={() => { setNewAnswer(idx.toString()); setShowError(false); }}
                            style={styles.radioContainer}
                          >
                            <View style={[
                              styles.radioButton,
                              newAnswer === idx.toString() && styles.radioButtonSelected
                            ]}>
                              {newAnswer === idx.toString() && (
                                <Ionicons name="checkmark" size={16} color="white" />
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    {showError && newAnswer === '' && (
                      <View style={styles.errorContainer}>
                        <Ionicons name="warning" size={16} color="#ef4444" />
                        <Text style={styles.errorLabel}>Please select the correct answer</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[styles.addButton, !allFieldsFilled && styles.addButtonDisabled]}
                      onPress={handleAddQuestion}
                      disabled={!allFieldsFilled}
                    >
                      <LinearGradient
                        colors={allFieldsFilled ? ['#10b981', '#059669'] : ['#d1d5db', '#9ca3af']}
                        style={styles.addButtonGradient}
                      >
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.addButtonText}>Add Question</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.questionsHeaderContainer}>
                <LinearGradient
                  colors={['#282FFB', '#282FFB40']}
                  style={styles.questionsHeaderGradient}
                >
                  <Ionicons name="list-outline" size={24} color="white" />
                  <Text style={styles.questionsHeaderTitle}>Questions ({questions.length})</Text>
                </LinearGradient>
              </View>
            </>
          }
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  errorDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorButtonText: {
    color: '#f5576c',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 20,
  },
  examHeaderContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  examHeaderGradient: {
    padding: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 1,
  },
  backButtonContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  examInfo: {
    marginTop: 20,
    marginLeft: 60,
  },
  examTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  examMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  examSubjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
  },
  examSubject: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  examMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
  },
  examMetaText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  addQuestionContainer: {
    marginBottom: 24,
  },
  addQuestionCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  addQuestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addQuestionIconContainer: {
    marginRight: 12,
  },
  addQuestionIcon: {
    borderRadius: 25,
    padding: 8,
  },
  addQuestionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  successMsg: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  errorLabel: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionInputContainer: {
    marginBottom: 12,
  },
  optionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  radioContainer: {
    padding: 4,
  },
  radioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#282FFB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioButtonSelected: {
    backgroundColor: '#282FFB',
  },
  addButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  questionsHeaderContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  questionsHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  questionsHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionNumberBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
    padding: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regularOptionBadge: {
    backgroundColor: '#f3f4f6',
  },
  correctOptionBadge: {
    backgroundColor: '#10b981',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  regularOptionLabel: {
    color: '#6b7280',
  },
  correctOptionLabel: {
    color: 'white',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  regularOptionText: {
    color: '#374151',
  },
  correctOptionText: {
    color: '#10b981',
    fontWeight: '600',
  },
  correctIndicator: {
    marginLeft: 'auto',
  },
  emptyContainer: {
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyGradient: {
    padding: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default ManageQuestions;