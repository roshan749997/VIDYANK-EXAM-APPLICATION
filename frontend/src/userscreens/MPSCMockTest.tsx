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

const questions = [
  {
    question: "Who was the first Chief Minister of Maharashtra?",
    options: ["Vasantrao Naik", "Yashwantrao Chavan", "Sharad Pawar", "Shivajirao Patil"],
    correctAnswer: 1
  },
  {
    question: "Ajanta Caves are located in which district?",
    options: ["Pune", "Aurangabad", "Nagpur", "Nashik"],
    correctAnswer: 1
  },
  {
    question: "Which is the largest district in Maharashtra by area?",
    options: ["Pune", "Nagpur", "Ahmednagar", "Nashik"],
    correctAnswer: 2
  },
  {
    question: "Which river flows through Pune city?",
    options: ["Godavari", "Krishna", "Mula-Mutha", "Tapti"],
    correctAnswer: 2
  },
  {
    question: "Who is known as the Iron Man of India?",
    options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "B. R. Ambedkar", "Bal Gangadhar Tilak"],
    correctAnswer: 1
  },
  {
    question: "Which fort is known as the 'Gibraltar of the East'?",
    options: ["Sinhagad", "Raigad", "Daulatabad", "Pratapgad"],
    correctAnswer: 2
  },
  {
    question: "Which city is known as the 'Wine Capital of India'?",
    options: ["Nashik", "Pune", "Nagpur", "Aurangabad"],
    correctAnswer: 0
  },
  {
    question: "Who wrote the book 'Geet Ramayan'?",
    options: ["V. D. Savarkar", "G. D. Madgulkar", "P. L. Deshpande", "V. S. Khandekar"],
    correctAnswer: 1
  },
  {
    question: "Which is the official language of Maharashtra?",
    options: ["Hindi", "English", "Marathi", "Gujarati"],
    correctAnswer: 2
  },
  {
    question: "Which festival is known as the festival of lights?",
    options: ["Holi", "Diwali", "Ganesh Chaturthi", "Makar Sankranti"],
    correctAnswer: 1
  }
];

type QuestionStatus = 'answered' | 'marked' | 'answeredMarked' | 'visited' | 'notVisited';

type Props = NativeStackScreenProps<RootStackParamList, 'MPSCMockTest'>;

const MPSCMockTest: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [permission, requestPermission] = useCameraPermissions();
  const [proctoringWarnings, setProctoringWarnings] = useState<string[]>([]);
  const [showProctoringModal, setShowProctoringModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const proctoringTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate proctoring checks (since we can't use face detection in Expo Go)
  useEffect(() => {
    if (!testStarted || testEnded) return;

    // Simulate random proctoring warnings every 30-60 seconds
    proctoringTimerRef.current = setInterval(() => {
      const warnings = [];
      const random = Math.random();

      if (random < 0.3) {
        warnings.push("Please ensure your face is clearly visible in the camera");
      }
      if (random < 0.2) {
        warnings.push("Multiple faces detected - please ensure you're alone");
      }
      if (random < 0.1) {
        warnings.push("Mobile phone usage detected - please keep your phone away");
      }

      if (warnings.length > 0) {
        setProctoringWarnings(warnings);
        setShowProctoringModal(true);

        // Hide warning after 5 seconds
        setTimeout(() => {
          setShowProctoringModal(false);
          setProctoringWarnings([]);
        }, 2000);
      }
    }, 30000 + Math.random() * 30000); // Random interval between 30-60 seconds

    return () => {
      if (proctoringTimerRef.current) clearInterval(proctoringTimerRef.current);
    };
  }, [testStarted, testEnded]);

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const handleEndTest = () => {
    setTestEnded(true);
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

  if (!testStarted) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.startTitle}>MPSC Mock Test</Text>
        <Text style={styles.startSubtitle}>Welcome! Press the button below to begin your test.</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => setTestStarted(true)}>
          <Text style={styles.startButtonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
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
    return (
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreTitle}>Test Completed!</Text>
        <Text style={styles.scoreText}>Score: {correct} / {questions.length}</Text>
        <Text style={styles.scoreText}>Answered: {totalAnswered}</Text>
        <Text style={styles.scoreText}>Marked for Review: {totalMarked}</Text>
        <TouchableOpacity style={styles.scoreButton} onPress={() => navigation.navigate('AvailableExams')}>
          <Text style={styles.scoreButtonText}>Return to Test Series</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#282FFB1A" />
      {/* Header */}
      <View style={styles.header}>
        {isMobile ? (
          <View style={styles.headerMobileContent}>
            <Text style={styles.headerTitleMobile}>MPSC Mock Test</Text>
            <View style={styles.timerContainerMobile}>
              <Text style={styles.timerTextMobile}>Time Remaining: {formatTime(timeRemaining)}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>MPSC Mock Test</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Time Remaining: {formatTime(timeRemaining)}</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.mainContent}>
        {/* Left Panel */}
        <View style={styles.leftPanel}>
          {/* Camera at the top of the left panel */}
          {permission && permission.granted && (
            <View style={styles.leftPanelCameraContainer}>
              <CameraView style={styles.camera} facing={"front"} />
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderStatusLegend()}
            {renderQuestionNumbers()}
            <TouchableOpacity style={styles.endTestButton} onPress={handleEndTest}>
              <Text style={styles.endTestButtonText}>End Test</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Question Area */}
        <View style={styles.questionArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.questionNumberTextMain}>Question {currentQuestion + 1}:</Text>
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
                    ]} />
                    <Text style={styles.optionText}>({index + 1}) {option}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <View style={styles.navigationRow}>
                <TouchableOpacity
                  style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
                  onPress={goToPrevious}
                  disabled={currentQuestion === 0}
                >
                  <Text style={styles.navButtonText}>« Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, currentQuestion === questions.length - 1 && styles.disabledButton]}
                  onPress={goToNext}
                  disabled={currentQuestion === questions.length - 1}
                >
                  <Text style={styles.navButtonText}>Next »</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.navigationRow}>
                <TouchableOpacity style={styles.actionButton} onPress={clearAnswer}>
                  <Text style={styles.actionButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, markedForReview[currentQuestion] && styles.markedButton]}
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
      </View>

      {/* Proctoring Warning Modal */}
      <Modal
        visible={showProctoringModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Proctoring Alert</Text>
            {proctoringWarnings.map((warning, index) => (
              <Text key={index} style={styles.modalWarning}>{warning}</Text>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowProctoringModal(false)}
            >
              <Text style={styles.modalButtonText}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  cameraContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 180,
    height: 130,
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
  cameraContainerMobile: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 120,
    height: 90,
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
  camera: {
    width: '100%',
    height: '100%',
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
  leftPanelCameraContainer: {
    width: '100%',
    height: 100, // or 120, or whatever fits best
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
  timerContainerMobile: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 2,
  },
  timerTextMobile: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  warningText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MPSCMockTest; 