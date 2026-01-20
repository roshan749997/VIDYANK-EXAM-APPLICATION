import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

// UPSC-relevant questions
const questions = [
  {
    question: "Who was the first President of independent India?",
    options: ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Jawaharlal Nehru", "Vallabhbhai Patel"],
    correctAnswer: 0
  },
  {
    question: "Which Article of the Indian Constitution deals with the amendment procedure?",
    options: ["Article 352", "Article 368", "Article 370", "Article 356"],
    correctAnswer: 1
  },
  {
    question: "The Directive Principles of State Policy are borrowed from the constitution of which country?",
    options: ["USA", "Ireland", "UK", "Australia"],
    correctAnswer: 1
  },
  {
    question: "Which river is known as the 'Sorrow of Bengal'?",
    options: ["Ganga", "Damodar", "Kosi", "Brahmaputra"],
    correctAnswer: 1
  },
  {
    question: "Who is regarded as the architect of the Indian Constitution?",
    options: ["B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel", "Rajendra Prasad"],
    correctAnswer: 0
  },
  {
    question: "Which Mughal emperor built the Red Fort in Delhi?",
    options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
    correctAnswer: 2
  },
  {
    question: "Which is the largest desert in India?",
    options: ["Thar", "Rann of Kutch", "Ladakh", "Deccan"],
    correctAnswer: 0
  },
  {
    question: "The 'Chipko Movement' is related to?",
    options: ["Wildlife Protection", "Forest Conservation", "Water Conservation", "Soil Conservation"],
    correctAnswer: 1
  },
  {
    question: "Which Five-Year Plan was called the 'Gadgil Yojana'?",
    options: ["First", "Second", "Third", "Fourth"],
    correctAnswer: 2
  },
  {
    question: "Who is the current Chief Election Commissioner of India (as of 2024)?",
    options: ["Rajiv Kumar", "Sunil Arora", "Sushil Chandra", "Om Prakash Rawat"],
    correctAnswer: 0
  }
];

type QuestionStatus = 'answered' | 'marked' | 'answeredMarked' | 'visited' | 'notVisited';

type Props = NativeStackScreenProps<RootStackParamList, 'UPSCMockTest'>;

const UPSCMockTest: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!testStarted || testEnded) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTestEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, testEnded]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const markVisited = (questionIndex: number) => {
    const newVisited = [...visitedQuestions];
    newVisited[questionIndex] = true;
    setVisitedQuestions(newVisited);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const navigateToQuestion = (questionIndex: number) => {
    markVisited(currentQuestion);
    setCurrentQuestion(questionIndex);
    markVisited(questionIndex);
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      markVisited(currentQuestion);
      setCurrentQuestion(currentQuestion + 1);
      markVisited(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      markVisited(currentQuestion);
      setCurrentQuestion(currentQuestion - 1);
      markVisited(currentQuestion - 1);
    }
  };

  const toggleMarkForReview = () => {
    const newMarked = [...markedForReview];
    newMarked[currentQuestion] = !newMarked[currentQuestion];
    setMarkedForReview(newMarked);
  };

  const clearAnswer = () => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = null;
    setSelectedAnswers(newAnswers);

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = false;
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
      case 'answered': return '#22c55e';
      case 'marked': return '#f59e0b';
      case 'answeredMarked': return '#06b6d4';
      case 'visited': return '#ef4444';
      case 'notVisited': return '#6b7280';
      default: return '#6b7280';
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

  const handleEndTest = () => {
    Alert.alert(
      "End Test",
      "Are you sure you want to end the test?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Test", onPress: () => setTestEnded(true) }
      ]
    );
  };

  const renderQuestionNumbers = () => (
    <View style={styles.questionNumbersContainer}>
      {questions.map((_, index) => {
        const status = getQuestionStatus(index);
        const isSelected = index === currentQuestion;
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
      <Text style={styles.statusTitle}>Question Status</Text>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#6b7280' }]} />
        <Text style={styles.statusText}>Not Visited ({counts.notVisited})</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#ef4444' }]} />
        <Text style={styles.statusText}>Not Answered ({counts.notAnswered})</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#22c55e' }]} />
        <Text style={styles.statusText}>Answered ({counts.answered})</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#f59e0b' }]} />
        <Text style={styles.statusText}>Marked ({counts.marked})</Text>
      </View>
      <View style={styles.statusItem}>
        <View style={[styles.statusBox, { backgroundColor: '#06b6d4' }]} />
        <Text style={styles.statusText}>Answered & Marked ({counts.answeredMarked})</Text>
      </View>
    </View>
  );

  if (!testStarted) {
    return (
      <SafeAreaView style={styles.startContainer}>
        <View style={styles.startContent}>
          <Text style={styles.startTitle}>UPSC Mock Test</Text>
          <Text style={styles.startSubtitle}>
            Welcome to the UPSC Mock Test! This test contains 10 questions and you have 60 minutes to complete it.
          </Text>
          <View style={styles.startInstructions}>
            <Text style={styles.instructionTitle}>Instructions:</Text>
            <Text style={styles.instructionText}>• Read each question carefully</Text>
            <Text style={styles.instructionText}>• Select the best answer from the given options</Text>
            <Text style={styles.instructionText}>• You can mark questions for review</Text>
            <Text style={styles.instructionText}>• Camera monitoring is enabled for proctoring</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={() => setTestStarted(true)}>
            <Text style={styles.startButtonText}>Start Test</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (testEnded) {
    // Calculate score
    const totalAnswered = answeredQuestions.filter(Boolean).length;
    const totalMarked = markedForReview.filter(Boolean).length;
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++;
    });
    const percentage = Math.round((correct / questions.length) * 100);
    
    return (
      <SafeAreaView style={styles.scoreContainer}>
        <View style={styles.scoreContent}>
          <Text style={styles.scoreTitle}>Test Completed!</Text>
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Your Score:</Text>
              <Text style={styles.scoreValue}>{correct} / {questions.length}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Percentage:</Text>
              <Text style={styles.scoreValue}>{percentage}%</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Questions Answered:</Text>
              <Text style={styles.scoreValue}>{totalAnswered}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Marked for Review:</Text>
              <Text style={styles.scoreValue}>{totalMarked}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.scoreButton} onPress={() => navigation.navigate('VidyankaTestSeries')}>
            <Text style={styles.scoreButtonText}>Return to Test Series</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to access the camera for proctoring purposes during the test.
          </Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="#282FFB1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>UPSC Mock Test</Text>
          <Text style={styles.headerSubtitle}>Question {currentQuestion + 1} of {questions.length}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
          <TouchableOpacity
            style={styles.cameraToggle}
            onPress={() => setShowCamera(!showCamera)}
          >
            <Text style={styles.cameraToggleText}>{showCamera ? 'Hide Cam' : 'Show Cam'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Left Panel */}
        <View style={styles.leftPanel}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.leftPanelScroll}
          >
            {renderStatusLegend()}
            {renderQuestionNumbers()}
          </ScrollView>
          <TouchableOpacity style={styles.endTestButton} onPress={handleEndTest}>
            <Text style={styles.endTestButtonText}>End Test</Text>
          </TouchableOpacity>
        </View>

        {/* Question Area */}
        <View style={styles.questionArea}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.questionScroll}
            contentContainerStyle={styles.questionScrollContent}
          >
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumberTextMain}>Question {currentQuestion + 1}</Text>
              <View style={styles.questionMeta}>
                <Text style={styles.questionType}>Multiple Choice</Text>
                <Text style={styles.questionMarks}>1 Mark</Text>
              </View>
            </View>
            
            <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
            
            <View style={styles.optionsContainer}>
              {questions[currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswers[currentQuestion] === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.radioButton,
                      selectedAnswers[currentQuestion] === index && styles.radioButtonSelected
                    ]}>
                      {selectedAnswers[currentQuestion] === index && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedAnswers[currentQuestion] === index && styles.selectedOptionText
                    ]}>
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <View style={styles.navigationRow}>
                <TouchableOpacity
                  style={[styles.navButton, styles.previousButton, currentQuestion === 0 && styles.disabledButton]}
                  onPress={goToPrevious}
                  disabled={currentQuestion === 0}
                >
                  <Text style={styles.navButtonText}>← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton, currentQuestion === questions.length - 1 && styles.disabledButton]}
                  onPress={goToNext}
                  disabled={currentQuestion === questions.length - 1}
                >
                  <Text style={styles.navButtonText}>Next →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.navigationRow}>
                <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearAnswer}>
                  <Text style={styles.actionButtonText}>Clear Answer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.markButton,
                    markedForReview[currentQuestion] && styles.markedButton
                  ]}
                  onPress={toggleMarkForReview}
                >
                  <Text style={styles.actionButtonText}>
                    {markedForReview[currentQuestion] ? 'Unmark' : 'Mark for Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Camera View */}
        {showCamera && (
          <View style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Monitoring</Text>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            <CameraView style={styles.camera} facing="front" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Start Screen Styles
  startContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  startContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e40af',
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 26,
  },
  startInstructions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Permission Screen Styles
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Main Container Styles
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#282FFB1A',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  timerLabel: {
    color: '#93c5fd',
    fontSize: 12,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cameraToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },

  // Main Content Styles
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },

  // Left Panel Styles
  leftPanel: {
    width: width * 0.28,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftPanelScroll: {
    flex: 1,
  },
  statusLegend: {
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 10,
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  questionNumbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  questionNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedQuestion: {
    borderWidth: 3,
    borderColor: '#1e40af',
  },
  questionNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  endTestButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  endTestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Question Area Styles
  questionArea: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionScroll: {
    flex: 1,
  },
  questionScrollContent: {
    padding: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumberTextMain: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  questionMeta: {
    alignItems: 'flex-end',
  },
  questionType: {
    fontSize: 12,
    color: '#64748b',
  },
  questionMarks: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 24,
    color: '#1f2937',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#1e40af',
    fontWeight: '500',
  },

  // Navigation Styles
  navigationContainer: {
    gap: 16,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previousButton: {
    backgroundColor: '#6b7280',
  },
  nextButton: {
    backgroundColor: '#1e40af',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    backgroundColor: '#ef4444',
  },
  markButton: {
    backgroundColor: '#f59e0b',
  },
  markedButton: {
    backgroundColor: '#06b6d4',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Camera Styles
  cameraContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 200,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  cameraHeader: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraCloseButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },

  // Score Screen Styles
  scoreContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scoreContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#1e40af',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 20,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  scoreButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UPSCMockTest;