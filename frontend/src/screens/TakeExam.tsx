import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

type QuestionStatus = 'answered' | 'marked' | 'answeredMarked' | 'visited' | 'notVisited';

const TakeExam = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const isDesktop = windowWidth >= 768;
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { examId } = route.params || {};

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>({});
  const [submitted, setSubmitted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  
  // Set start time when test starts
  useEffect(() => {
    if (testStarted && !startTime) {
      setStartTime(new Date());
    }
  }, [testStarted]);

  // New state for UI consistency with MPSCMockTest
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/exams/${examId}`);
        // Backend returns exam with populated questions if defined so in model/controller?
        // Actually, Exam model has questions array.
        // And getExamById returns the document.
        const examData = { ...data, id: data._id || data.id };
        setExam(examData);
        const examQuestions = examData.questions || [];
        setQuestions(examQuestions);

        // Initialize arrays based on questions length
        const questionCount = examQuestions.length;
        setVisitedQuestions(new Array(questionCount).fill(false));
        setAnsweredQuestions(new Array(questionCount).fill(false));
        setMarkedForReview(new Array(questionCount).fill(false));
      } catch (error) {
        console.error('Error fetching exam:', error);
        setExam(null);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const markVisited = (questionIndex: number) => {
    const newVisited = [...visitedQuestions];
    newVisited[questionIndex] = true;
    setVisitedQuestions(newVisited);
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));

    // Update answered questions
    const newAnswered = [...answeredQuestions];
    newAnswered[qIdx] = true;
    setAnsweredQuestions(newAnswered);
  };

  const navigateToQuestion = (questionIndex: number) => {
    markVisited(current);
    setCurrent(questionIndex);
    markVisited(questionIndex);
  };

  const handlePrev = () => {
    if (current > 0) {
      markVisited(current);
      setCurrent(current - 1);
      markVisited(current - 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      markVisited(current);
      setCurrent(current + 1);
      markVisited(current + 1);
    }
  };

  const toggleMarkForReview = () => {
    const newMarked = [...markedForReview];
    newMarked[current] = !newMarked[current];
    setMarkedForReview(newMarked);
  };

  const clearAnswer = () => {
    setAnswers(a => ({ ...a, [current]: null }));

    const newAnswered = [...answeredQuestions];
    newAnswered[current] = false;
    setAnsweredQuestions(newAnswered);
  };

  const getQuestionStatus = (index: number): QuestionStatus => {
    if (answeredQuestions[index] && markedForReview[index]) {
      return 'answeredMarked';
    } else if (answeredQuestions[index]) {
      return 'answered';
    } else if (markedForReview[index]) {
      return 'marked';
    } else if (visitedQuestions[index]) {
      return 'visited';
    } else {
      return 'notVisited';
    }
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': return '#28a745';
      case 'marked': return '#ffc107';
      case 'answeredMarked': return '#17a2b8';
      case 'visited': return '#dc3545';
      case 'notVisited': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getCounts = () => {
    const notVisited = visitedQuestions.filter(v => !v).length;
    const notAnswered = answeredQuestions.filter(a => !a).length;
    const answered = answeredQuestions.filter(a => a).length;
    const marked = markedForReview.filter(m => m).length;
    const answeredMarked = answeredQuestions.filter((a, i) => a && markedForReview[i]).length;
    return { notVisited, notAnswered, answered, marked, answeredMarked };
  };

  const counts = getCounts();

  const handleSubmit = async () => {
    if (!exam || !user) {
      setSubmitted(true);
      return;
    }

    try {
      // Calculate score
      let correct = 0;
      const answerArray: any[] = [];
      
      questions.forEach((q, idx) => {
        const selectedAnswer = answers[idx];
        const isCorrect = selectedAnswer === q.answer;
        if (isCorrect) correct++;
        
        answerArray.push({
          questionId: q._id || `q-${idx}`,
          selectedAnswer: selectedAnswer !== null && selectedAnswer !== undefined ? selectedAnswer : -1,
          isCorrect,
        });
      });

      const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
      const totalAnswered = answeredQuestions.filter(Boolean).length;
      
      // Calculate time taken
      const endTime = new Date();
      const duration = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) : 0;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const timeTaken = `${hours}h ${minutes}m`;

      // Save to backend
      await api.post('/exam-results', {
        examId: exam._id || exam.id,
        examTitle: exam.title,
        category: exam.subject || 'General',
        score,
        totalQuestions: questions.length,
        correctAnswers: correct,
        timeTaken,
        duration,
        status: totalAnswered === questions.length ? 'completed' : 'incomplete',
        answers: answerArray,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error saving exam result:', error);
      // Still show submitted screen even if save fails
      setSubmitted(true);
    }
  };

  const renderQuestionNumbers = () => (
    <View style={styles.questionNumbersContainer}>
      {questions.map((_, index) => {
        const status = getQuestionStatus(index);
        const isSelected = index === current;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.questionNumber,
              { backgroundColor: getStatusColor(status) },
              isSelected && styles.selectedQuestion
            ]}
            onPress={() => navigateToQuestion(index)}
          >
            <Text style={styles.questionNumberText}>{index + 1}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStatusLegend = () => (
    <View style={styles.statusLegend}>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#6c757d' }]} />
        <Text style={styles.statusText}>Not Visited: {counts.notVisited}</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#dc3545' }]} />
        <Text style={styles.statusText}>Not Answered: {counts.notAnswered}</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#28a745' }]} />
        <Text style={styles.statusText}>Answered: {counts.answered}</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#ffc107' }]} />
        <Text style={styles.statusText}>Marked: {counts.marked}</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#17a2b8' }]} />
        <Text style={styles.statusText}>Answered & Marked: {counts.answeredMarked}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.startContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.startSubtitle}>Loading exam...</Text>
      </View>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <View style={styles.startContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.startSubtitle}>Exam or questions not found.</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.goBack()}>
          <Text style={styles.startButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={{ marginTop: 20, backgroundColor: '#4f46e5', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!testStarted) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.startTitle}>{exam.title}</Text>
        <Text style={styles.startSubtitle}>Welcome! Press the button below to begin your exam.</Text>
        <Text style={styles.startSubtitle}>Total Questions: {questions.length}</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => {
          setTestStarted(true);
          markVisited(0); // Mark first question as visited
        }}>
          <Text style={styles.startButtonText}>Start Exam</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (submitted) {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    const totalAnswered = answeredQuestions.filter(Boolean).length;
    const totalMarked = markedForReview.filter(Boolean).length;

    return (
      <View style={styles.scoreContainer}>
        <Ionicons name="checkmark-circle-outline" size={48} color="#10b981" style={{ marginBottom: 12 }} />
        <Text style={styles.scoreTitle}>Exam Completed!</Text>
        <Text style={styles.scoreText}>Score: {correct} / {questions.length}</Text>
        <Text style={styles.scoreText}>Answered: {totalAnswered}</Text>
        <Text style={styles.scoreText}>Marked for Review: {totalMarked}</Text>
        <TouchableOpacity style={styles.scoreButton} onPress={() => navigation.goBack()}>
          <Text style={styles.scoreButtonText}>Back to Exams</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[current];
  const selected = answers[current];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#282FFB1A" />
      {/* Header */}
      <View style={styles.header}>
        {isMobile ? (
          <View style={styles.headerMobileContent}>
            <Text style={styles.headerTitleMobile}>{exam.title}</Text>
            <Text style={styles.timerTextMobile}>Question {current + 1} of {questions.length}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>{exam.title}</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Question {current + 1} of {questions.length}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.mainContent}>
        {/* Left Panel (collapsible) */}
        {leftPanelVisible && (
          <View style={styles.leftPanel}>
            {/* Camera at the top of the left panel */}
            {permission && permission.granted && (
              <View
                style={[
                  styles.leftPanelCameraContainer,
                  isDesktop
                    ? { width: 120, height: 120, minWidth: 120, minHeight: 120, maxWidth: 120, maxHeight: 120 }
                    : { width: '100%', height: 100 }
                ]}
              >
                <CameraView
                  style={[
                    styles.camera,
                    isDesktop
                      ? { width: 120, height: 120, minWidth: 120, minHeight: 120, maxWidth: 120, maxHeight: 120 }
                      : { width: '100%', height: '100%' }
                  ]}
                  facing={"front"}
                />
              </View>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderStatusLegend()}
              {renderQuestionNumbers()}
              <TouchableOpacity style={styles.endTestButton} onPress={handleSubmit}>
                <Text style={styles.endTestButtonText}>Submit Exam</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Question Area */}
        <View style={styles.questionArea}>
          {/* Minimize/Maximize Button */}
          <TouchableOpacity
            style={[
              styles.togglePanelBtn,
              leftPanelVisible ? styles.togglePanelBtnOpen : styles.togglePanelBtnClosed
            ]}
            onPress={() => setLeftPanelVisible(v => !v)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={leftPanelVisible ? 'fullscreen-exit' : 'fullscreen'}
              size={28}
              color="#6366f1"
            />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.questionNumberTextMain}>Question {current + 1}:</Text>
            <Text style={styles.questionText}>{q.text}</Text>
            <View style={styles.optionsContainer}>
              {q.options.map((opt: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionButton,
                    selected === idx && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(current, idx)}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.radioButton,
                      selected === idx && styles.radioButtonSelected
                    ]} />
                    <Text style={styles.optionText}>({String.fromCharCode(65 + idx)}) {opt}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <View style={styles.navigationRow}>
                <TouchableOpacity
                  style={[styles.navButton, current === 0 && styles.disabledButton]}
                  onPress={handlePrev}
                  disabled={current === 0}
                >
                  <Text style={styles.navButtonText}>« Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, current === questions.length - 1 && styles.disabledButton]}
                  onPress={handleNext}
                  disabled={current === questions.length - 1}
                >
                  <Text style={styles.navButtonText}>Next »</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.navigationRow}>
                <TouchableOpacity style={styles.actionButton} onPress={clearAnswer}>
                  <Text style={styles.actionButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, markedForReview[current] && styles.markedButton]}
                  onPress={toggleMarkForReview}
                >
                  <Text style={styles.actionButtonText}>
                    {markedForReview[current] ? 'Unmark' : 'Mark for Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  startSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 18, // Add white space at the top for status bar
  },
  header: {
    backgroundColor: '#282FFB1A',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  leftPanel: {
    width: width * 0.35,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
  },
  statusLegend: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  questionNumbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  questionNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  selectedQuestion: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  questionNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  endTestButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  endTestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionArea: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#0044ff',
  },
  questionNumberTextMain: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  navigationContainer: {
    marginTop: 20,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  markedButton: {
    backgroundColor: '#ffc107',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scoreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scoreText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  scoreButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  scoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerMobileContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerTitleMobile: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  timerTextMobile: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leftPanelCameraContainer: {
    width: '100%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  togglePanelBtn: {
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  togglePanelBtnOpen: {
    // When panel is open, button is at right edge of question area
  },
  togglePanelBtnClosed: {
    // When panel is closed, button is at right edge of question area
    right: 18,
  },
});

export default TakeExam;