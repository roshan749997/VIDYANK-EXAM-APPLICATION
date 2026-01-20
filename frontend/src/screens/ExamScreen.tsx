import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, TextInput, useWindowDimensions, Animated, Platform, ViewStyle } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlankHeader from '../components/BlankHeader';
import GlassSidebar from '../components/GlassSidebar'; // Added import for GlassSidebar

// Minimal sidebarItems for demo
const sidebarItems = [
  { label: 'Dashboard', icon: null, onPress: () => {} },
  { label: 'Settings', icon: null, onPress: () => {} },
];

// Sample questions for demo (with multiple types)
const UPSC_QUESTIONS = [
  {
    id: '1',
    type: 'single',
    question: 'Who is known as the Father of the Indian Constitution?',
    options: ['Mahatma Gandhi', 'B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
    answer: 1,
  },
  {
    id: '2',
    type: 'multi',
    question: 'Which of the following are fundamental rights? (Select all that apply)',
    options: ['Right to Equality', 'Right to Vote', 'Right to Freedom', 'Right to Property'],
    answer: [0, 2],
  },
  {
    id: '3',
    type: 'tf',
    question: 'The President of India is elected for a term of 5 years.',
    answer: true,
  },
  {
    id: '4',
    type: 'short',
    question: 'Name the river that is the longest in India.',
    answer: 'Ganga',
  },
];

const MPSC_QUESTIONS = [
  {
    id: '1',
    type: 'single',
    question: 'Who was the first Chief Minister of Maharashtra?',
    options: ['Vasantrao Naik', 'Yashwantrao Chavan', 'Sharad Pawar', 'Shivajirao Patil'],
    answer: 1,
  },
  {
    id: '2',
    type: 'multi',
    question: 'Which of the following are districts in Maharashtra? (Select all that apply)',
    options: ['Aurangabad', 'Nagpur', 'Bhopal', 'Nashik'],
    answer: [0, 1, 3],
  },
  {
    id: '3',
    type: 'tf',
    question: 'Ajanta Caves are located in Aurangabad district.',
    answer: true,
  },
  {
    id: '4',
    type: 'short',
    question: 'Which is the largest district in Maharashtra by area?',
    answer: 'Ahmednagar',
  },
];

// Negative marking: UPSC (1/3), MPSC (1/4)
const NEGATIVE_MARKING = {
  UPSC: 1 / 3,
  MPSC: 1 / 4,
  NEET: 0.25, // or whatever is appropriate for NEET
};

// Each question: 2 marks (for demo)
const MARKS_PER_QUESTION = 2;

// 2 hours in seconds (for demo, use 5 min = 300s)
const EXAM_DURATION = 300;

// Props

type Props = NativeStackScreenProps<RootStackParamList, 'ExamScreen'>;

type Attempt = {
  examType: 'UPSC' | 'MPSC' | 'NEET';
  date: string;
  score: number;
  correct: number;
  wrong: number;
  answers: any[];
  questions: any[];
};

const ExamScreen: React.FC<Props> = ({ route, navigation }) => {
  const { examType, questions } = route.params || {};
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>(questions.map(q => q.type === 'multi' ? [] : q.type === 'tf' ? null : null));
  const [visited, setVisited] = useState<boolean[]>(Array(questions.length).fill(false));
  const [marked, setMarked] = useState<boolean[]>(Array(questions.length).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(EXAM_DURATION);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [reviewAttempt, setReviewAttempt] = useState<Attempt | null>(null);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [questionAnim] = useState(new Animated.Value(1));
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Added state for sidebar collapsed

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    if (timer === 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [timer, submitted]);

  // Stop timer on submit
  useEffect(() => {
    if (submitted && intervalId) clearInterval(intervalId);
  }, [submitted, intervalId]);

  // Save attempt to AsyncStorage
  const saveAttempt = async (attempt: Attempt) => {
    try {
      const prev = await AsyncStorage.getItem('examAttempts');
      const arr = prev ? JSON.parse(prev) : [];
      arr.unshift(attempt);
      await AsyncStorage.setItem('examAttempts', JSON.stringify(arr));
    } catch (e) { /* ignore */ }
  };

  // Load attempts
  const loadHistory = async () => {
    try {
      const prev = await AsyncStorage.getItem('examAttempts');
      setHistory(prev ? JSON.parse(prev) : []);
    } catch (e) { setHistory([]); }
  };

  // Scoring logic for all types
  const getScore = (customAnswers = answers, customQuestions = questions) => {
    let score = 0, correct = 0, wrong = 0;
    customQuestions.forEach((q, i) => {
      const a = customAnswers[i];
      if (q.type === 'single') {
        if (a === null) return;
        if (a === q.answer) { score += MARKS_PER_QUESTION; correct++; }
        else { score -= MARKS_PER_QUESTION * NEGATIVE_MARKING[examType]; wrong++; }
      } else if (q.type === 'multi') {
        if (!Array.isArray(a) || a.length === 0) return;
        const correctSet = new Set(q.answer);
        const ansSet = new Set(a);
        if (ansSet.size === correctSet.size && [...ansSet].every(x => correctSet.has(x))) {
          score += MARKS_PER_QUESTION; correct++;
        } else {
          score -= MARKS_PER_QUESTION * NEGATIVE_MARKING[examType]; wrong++;
        }
      } else if (q.type === 'tf') {
        if (a === null) return;
        if (a === q.answer) { score += MARKS_PER_QUESTION; correct++; }
        else { score -= MARKS_PER_QUESTION * NEGATIVE_MARKING[examType]; wrong++; }
      } else if (q.type === 'short') {
        if (!a) return;
        if (typeof a === 'string' && a.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
          score += MARKS_PER_QUESTION; correct++;
        } else {
          score -= MARKS_PER_QUESTION * NEGATIVE_MARKING[examType]; wrong++;
        }
      }
    });
    return { score, correct, wrong };
  };

  const handleSelect = (idx: number) => {
    if (submitted) return;
    const q = questions[current];
    if (q.type === 'single' || q.type === 'tf') {
      setAnswers(a => {
        const copy = [...a];
        copy[current] = idx;
        return copy;
      });
    } else if (q.type === 'multi') {
      setAnswers(a => {
        const copy = [...a];
        const arr = Array.isArray(copy[current]) ? [...copy[current]] : [];
        if (arr.includes(idx)) arr.splice(arr.indexOf(idx), 1);
        else arr.push(idx);
        copy[current] = arr;
        return copy;
      });
    }
  };

  const handleTF = (val: boolean) => {
    if (submitted) return;
    setAnswers(a => {
      const copy = [...a];
      copy[current] = val;
      return copy;
    });
  };

  const handleShort = (val: string) => {
    if (submitted) return;
    setAnswers(a => {
      const copy = [...a];
      copy[current] = val;
      return copy;
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const { score, correct, wrong } = getScore();
    const attempt: Attempt = {
      examType,
      date: new Date().toISOString(),
      score,
      correct,
      wrong,
      answers,
      questions,
    };
    await saveAttempt(attempt);
  };

  // Animate question change
  const animateQuestion = (nextIdx: number) => {
    Animated.sequence([
      Animated.timing(questionAnim, { toValue: 0, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(questionAnim, { toValue: 1, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => setCurrent(nextIdx));
  };

  const handleJump = (idx: number) => {
    setVisited(v => { const copy = [...v]; copy[idx] = true; return copy; });
    animateQuestion(idx);
  };

  const handleMark = () => {
    setMarked(m => { const copy = [...m]; copy[current] = !copy[current]; return copy; });
  };

  const handleClear = () => {
    setAnswers(a => { const copy = [...a];
      if (questions[current].type === 'multi') copy[current] = [];
      else copy[current] = null;
      return copy;
    });
  };

  const handleNext = () => {
    setVisited(v => { const copy = [...v]; copy[current + 1] = true; return copy; });
    if (current < questions.length - 1) animateQuestion(current + 1);
  };

  const handlePrev = () => {
    setVisited(v => { const copy = [...v]; copy[current - 1] = true; return copy; });
    if (current > 0) animateQuestion(current - 1);
  };

  const handleEndTest = () => setShowConfirmEnd(true);
  const confirmEndTest = () => { setShowConfirmEnd(false); handleSubmit(); };

  // Format timer
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Instructions
  const instructions = examType === 'UPSC'
    ? 'UPSC Prelims Paper I: 100 questions, 2 hours, 1/3 negative marking per wrong answer.'
    : 'MPSC Prelims Paper I: 100 questions, 2 hours, 1/4 negative marking per wrong answer.';

  // Timer color animation
  const timerColor = timer > 300 ? '#16a34a' : timer > 60 ? '#f59e0b' : '#dc2626';

  // Camera proctoring (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const video = document.getElementById('liveCamera') as HTMLVideoElement | null;
      if (video) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            video.srcObject = stream;
            setCameraActive(true);
          })
          .catch(() => setCameraError('Camera access failed.'));
      }
    }
  }, []);

  // Question metadata
  const questionMeta = (
    <View style={styles.metaRow}>
      <Text style={styles.metaText}>Subject: {examType}</Text>
      <Text style={styles.metaText}>Marks: 2</Text>
      <Text style={styles.metaText}>Neg: {examType === 'UPSC' ? '1/3' : examType === 'MPSC' ? '1/4' : '0.25'}</Text>
    </View>
  );

  // Exam info modal
  const examInfo = (
    <Modal visible={showInfo} animationType="slide" onRequestClose={() => setShowInfo(false)}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Exam Info</Text>
        <Text style={{ marginBottom: 8 }}>Syllabus: General Studies (Demo)</Text>
        <Text style={{ marginBottom: 8 }}>Total Questions: {questions.length}</Text>
        <Text style={{ marginBottom: 8 }}>Duration: {EXAM_DURATION / 60} min</Text>
        <Text style={{ marginBottom: 8 }}>Marking: +2 per correct, -{examType === 'UPSC' ? '0.66' : examType === 'MPSC' ? '0.5' : '0.25'} per wrong</Text>
        <Text style={{ marginBottom: 8 }}>Instructions: Attempt all questions. Mark for review if unsure. Time will auto-submit.</Text>
        <TouchableOpacity style={styles.submitBtn} onPress={() => setShowInfo(false)}><Text style={styles.submitBtnText}>Close</Text></TouchableOpacity>
      </View>
    </Modal>
  );

  // Render question by type
  const renderQuestion = (q: any, i: number, review: boolean = false, reviewAnswers: any[] | null = null) => {
    const a = review ? (reviewAnswers ? reviewAnswers[i] : undefined) : answers[i];
    if (q.type === 'single') {
      return (
        <View style={styles.optionsList}>
          {(q.options as string[]).map((opt: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={[styles.optionBtn, a === idx && styles.selectedOption, review && idx === q.answer && styles.correctOpt, review && a === idx && a !== q.answer && styles.wrongOpt]}
              onPress={() => handleSelect(idx)}
              disabled={submitted || review}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (q.type === 'multi') {
      return (
        <View style={styles.optionsList}>
          {(q.options as string[]).map((opt: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={[styles.optionBtn, Array.isArray(a) && a.includes(idx) && styles.selectedOption, review && q.answer.includes(idx) && styles.correctOpt, review && Array.isArray(a) && a.includes(idx) && !q.answer.includes(idx) && styles.wrongOpt]}
              onPress={() => handleSelect(idx)}
              disabled={submitted || review}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (q.type === 'tf') {
      return (
        <View style={styles.optionsList}>
          <TouchableOpacity style={[styles.optionBtn, a === true && styles.selectedOption, review && q.answer === true && styles.correctOpt, review && a === true && a !== q.answer && styles.wrongOpt]} onPress={() => handleTF(true)} disabled={submitted || review}><Text style={styles.optionText}>True</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, a === false && styles.selectedOption, review && q.answer === false && styles.correctOpt, review && a === false && a !== q.answer && styles.wrongOpt]} onPress={() => handleTF(false)} disabled={submitted || review}><Text style={styles.optionText}>False</Text></TouchableOpacity>
        </View>
      );
    } else if (q.type === 'short') {
      return (
        <View style={styles.optionsList}>
          <TextInput
            style={[styles.optionBtn, { textAlign: 'left' }, review && (typeof a === 'string' && a.trim().toLowerCase() === q.answer.trim().toLowerCase()) && styles.correctOpt, review && typeof a === 'string' && a && a.trim().toLowerCase() !== q.answer.trim().toLowerCase() && styles.wrongOpt]}
            value={a || ''}
            onChangeText={handleShort}
            editable={!submitted && !review}
            placeholder="Type your answer"
          />
          {review && <Text style={{ marginTop: 4, color: '#64748b' }}>Correct: {q.answer}</Text>}
        </View>
      );
    }
    return null;
  };

  // Status counts
  const getStatusCounts = () => {
    let notVisited = 0, notAnswered = 0, answered = 0, markedForReview = 0, answeredAndMarked = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!visited[i]) notVisited++;
      else if (marked[i] && (answers[i] === null || (Array.isArray(answers[i]) && answers[i].length === 0))) markedForReview++;
      else if (marked[i] && (answers[i] !== null && (!Array.isArray(answers[i]) || answers[i].length > 0))) answeredAndMarked++;
      else if (answers[i] === null || (Array.isArray(answers[i]) && answers[i].length === 0)) notAnswered++;
      else answered++;
    }
    return { notVisited, notAnswered, answered, markedForReview, answeredAndMarked };
  };

  // Render navigation panel
  const renderNavPanel = () => (
    <View style={styles.navPanel}>
      <Text style={styles.statusLegendTitle}>Questions</Text>
      <View style={styles.questionNumbers}>
        {questions.map((_, idx) => {
          let status = 'default';
          if (!visited[idx]) status = 'notVisited';
          else if (marked[idx] && (answers[idx] === null || (Array.isArray(answers[idx]) && answers[idx].length === 0))) status = 'marked';
          else if (marked[idx] && (answers[idx] !== null && (!Array.isArray(answers[idx]) || answers[idx].length > 0))) status = 'answeredMarked';
          else if (answers[idx] === null || (Array.isArray(answers[idx]) && answers[idx].length === 0)) status = 'notAnswered';
          else status = 'answered';
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.questionNumber, styles[status as keyof typeof styles] as ViewStyle, idx === current && styles.selectedQ]}
              onPress={() => handleJump(idx)}
            >
              <Text style={styles.questionNumberText}>{idx + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Status legend */}
      <View style={styles.statusLegend}>
        {Object.entries({
          notVisited: 'Not Visited',
          notAnswered: 'Not Answered',
          answered: 'Answered',
          marked: 'Marked for Review',
          answeredMarked: 'Answered & Marked for Review',
        }).map(([key, label]) => (
          <View key={key} style={styles.statusRow}>
            <View style={[styles.statusBox, styles[key as keyof typeof styles] as ViewStyle]} />
            <Text style={styles.statusLabel}>{label}: {getStatusCounts()[key as keyof ReturnType<typeof getStatusCounts>]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // For demo, use 4 questions
  return (
    <View style={[styles.container, isMobile && { flexDirection: 'column' }]}>
      <BlankHeader />
      {isMobile && !sidebarCollapsed ? (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSidebarCollapsed(true)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={() => setSidebarCollapsed(true)} />
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, zIndex: 100 }}>
            <GlassSidebar items={sidebarItems} collapsed={false} onClose={() => setSidebarCollapsed(true)} />
          </View>
        </Modal>
      ) : (
        <GlassSidebar items={sidebarItems} collapsed={sidebarCollapsed} onClose={() => setSidebarCollapsed(true)} />
      )}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* Place your header here, e.g., custom header or animated header */}
        {/* ...rest of the main content... */}
        <GlassCard style={styles.examCard}>
          {/* Header with info, attempted count, timer */}
          <View style={styles.examHeader}>
            <TouchableOpacity onPress={() => setShowInfo(true)} style={styles.infoBtn}><Ionicons name="information-circle-outline" size={22} color="#4f46e5" /></TouchableOpacity>
            <Text style={styles.examTitle}>{examType} Mock Exam</Text>
            <View style={styles.headerRight}>
              <Text style={styles.attemptedCount}>Attempted: {getStatusCounts().answered + getStatusCounts().answeredAndMarked} / {questions.length}</Text>
              <Text style={[styles.timer, { backgroundColor: timerColor }]}><Ionicons name="time-outline" size={18} /> {formatTime(timer)}</Text>
            </View>
          </View>
          {examInfo}
          {!submitted ? (
            <>
              {renderNavPanel()}
              <Animated.View style={{ opacity: questionAnim, transform: [{ scale: questionAnim }] }}>
                {questionMeta}
                <Text style={styles.qNo}>Q{current + 1} of {questions.length}</Text>
                <Text style={styles.question}>{questions[current].question}</Text>
                {renderQuestion(questions[current], current)}
                <View style={styles.navBtns}>
                  <TouchableOpacity onPress={handlePrev} disabled={current === 0} style={[styles.navBtn, current === 0 && styles.disabledBtn]}><Ionicons name="chevron-back" size={20} /></TouchableOpacity>
                  <TouchableOpacity onPress={handleNext} disabled={current === questions.length - 1} style={[styles.navBtn, current === questions.length - 1 && styles.disabledBtn]}><Ionicons name="chevron-forward" size={20} /></TouchableOpacity>
                </View>
                <View style={styles.markBtns}>
                  <TouchableOpacity style={[styles.markBtn]} onPress={handleMark}><Text style={styles.markBtnText}>{marked[current] ? 'Unmark' : 'Mark for Review'}</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.clearBtn} onPress={handleClear}><Text style={styles.clearBtnText}>Clear Answer</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.submitBtn} onPress={handleEndTest}><Text style={styles.submitBtnText}>End Test</Text></TouchableOpacity>
              </Animated.View>
              {/* Camera proctoring (web only) */}
              {Platform.OS === 'web' && (
                <View style={styles.cameraBox}>
                  <video id="liveCamera" autoPlay muted playsInline style={{ width: 120, height: 90, borderRadius: 8, border: '2px solid #4f46e5' }} />
                  <Text style={styles.cameraStatus}>{cameraActive ? 'Camera Active' : cameraError || 'Camera Initializing...'}</Text>
                </View>
              )}
            </>
          ) : (
            <ScrollView style={{ marginTop: 16 }}>
              <Text style={styles.resultTitle}>Result</Text>
              <Text style={styles.resultScore}>Score: {getScore().score} / {questions.length * MARKS_PER_QUESTION}</Text>
              <Text style={styles.resultDetail}>Correct: {getScore().correct} | Wrong: {getScore().wrong}</Text>
              <Text style={styles.resultDetail}>Negative Marking: {NEGATIVE_MARKING[examType] * MARKS_PER_QUESTION} per wrong</Text>
              <Text style={styles.reviewTitle}>Review Answers:</Text>
              {questions.map((q, i) => (
                <View key={q.id} style={styles.reviewQ}>
                  <Text style={styles.reviewQText}>Q{i + 1}: {q.question}</Text>
                  {renderQuestion(q, i, true)}
                </View>
              ))}
              <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}><Text style={styles.submitBtnText}>Back to Test Series</Text></TouchableOpacity>
            </ScrollView>
          )}
        </GlassCard>
      </View>
      {/* Past Attempts Modal */}
      <Modal visible={showHistory} animationType="slide" onRequestClose={() => setShowHistory(false)}>
        <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Past Attempts</Text>
          <FlatList
            data={history}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.attemptCard} onPress={() => { setReviewAttempt(item); setShowHistory(false); }}>
                <Text style={{ fontWeight: 'bold' }}>{item.examType} - {new Date(item.date).toLocaleString()}</Text>
                <Text>Score: {item.score} | Correct: {item.correct} | Wrong: {item.wrong}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No attempts yet.</Text>}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={() => setShowHistory(false)}><Text style={styles.submitBtnText}>Close</Text></TouchableOpacity>
        </View>
      </Modal>
      {/* Review Attempt Modal */}
      <Modal visible={!!reviewAttempt} animationType="slide" onRequestClose={() => setReviewAttempt(null)}>
        <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Review Attempt</Text>
          <Text style={{ marginBottom: 8 }}>Score: {reviewAttempt?.score} | Correct: {reviewAttempt?.correct} | Wrong: {reviewAttempt?.wrong}</Text>
          <ScrollView>
            {reviewAttempt?.questions.map((q, i) => (
              <View key={q.id} style={styles.reviewQ}>
                <Text style={styles.reviewQText}>Q{i + 1}: {q.question}</Text>
                {renderQuestion(q, i, true, reviewAttempt.answers)}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.submitBtn} onPress={() => setReviewAttempt(null)}><Text style={styles.submitBtnText}>Close</Text></TouchableOpacity>
        </View>
      </Modal>
      {/* Confirm End Modal */}
      <Modal visible={showConfirmEnd} animationType="slide" onRequestClose={() => setShowConfirmEnd(false)}>
        <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Confirm End</Text>
          <Text style={{ marginBottom: 8 }}>Are you sure you want to end the test?</Text>
          <View style={styles.confirmBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirmEnd(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmEndTest}><Text style={styles.confirmBtnText}>Confirm</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  examCard: { width: '100%', maxWidth: 600, alignSelf: 'center', padding: 24, marginTop: 24 },
  examTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  instructions: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
  timer: { fontSize: 16, color: '#4f46e5', fontWeight: 'bold', marginBottom: 12 },
  qNo: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  question: { fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 12 },
  optionsList: { marginBottom: 16 },
  optionBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 8 },
  selectedOption: { backgroundColor: '#c7d2fe' },
  optionText: { fontSize: 15, color: '#1e293b' },
  navBtns: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { padding: 8, backgroundColor: '#e0e7ff', borderRadius: 8 },
  submitBtn: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 10, marginTop: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginBottom: 8 },
  resultScore: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  resultDetail: { fontSize: 14, color: '#64748b', marginBottom: 2 },
  reviewTitle: { fontSize: 16, fontWeight: 'bold', color: '#4f46e5', marginTop: 16, marginBottom: 8 },
  reviewQ: { marginBottom: 12 },
  reviewQText: { fontWeight: '600', color: '#374151', marginBottom: 2 },
  reviewOpt: { fontSize: 14, color: '#374151', marginLeft: 8 },
  correctOpt: { fontSize: 14, color: '#16a34a', marginLeft: 8, fontWeight: 'bold' },
  wrongOpt: { fontSize: 14, color: '#dc2626', marginLeft: 8, fontWeight: 'bold' },
  historyBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 8, gap: 4 },
  historyBtnText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
  attemptCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  navPanel: { marginBottom: 16 },
  statusLegendTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  questionNumbers: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  questionNumber: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 8 },
  selectedQ: { backgroundColor: '#c7d2fe' },
  questionNumberText: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  statusLegend: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBox: { width: 20, height: 20, borderRadius: 4 },
  statusLabel: { fontSize: 14, color: '#64748b' },
  markBtns: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  markBtn: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 10, flex: 1 },
  clearBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 10, flex: 1 },
  markBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  clearBtnText: { color: '#1f2937', fontWeight: 'bold', fontSize: 16 },
  confirmBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 10, flex: 1 },
  cancelBtnText: { color: '#1f2937', fontWeight: 'bold', fontSize: 16 },
  confirmBtn: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 10, flex: 1 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  examHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoBtn: { padding: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attemptedCount: { fontSize: 14, color: '#64748b', fontWeight: 'bold' },
  cameraBox: { alignItems: 'center', marginTop: 16 },
  cameraStatus: { fontSize: 14, color: '#64748b', marginTop: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaText: { fontSize: 14, color: '#64748b' },
  disabledBtn: { opacity: 0.5 },
});

export default ExamScreen; 