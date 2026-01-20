import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, StyleSheet, useWindowDimensions, Platform, Image, Dimensions } from 'react-native';
import GlassCard from '../components/GlassCard';
import UserDashboardLayout from '../components/UserDashboardLayout';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function StudyPlanner() {
  const [activeTab, setActiveTab] = useState('To Do');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      subject: 'Maths',
      date: '30 July 8:00 Am',
      status: 'To Do',
      goals: [
        { id: 1, text: '35% less downtime', completed: true },
        { id: 2, text: '350+ technicians trained', completed: true },
        { id: 3, text: 'Zero safety issues post-training', completed: true },
        { id: 4, text: '50+ technicians trained', completed: true }
      ]
    },
    {
      id: 2,
      subject: 'Maths',
      date: '30 July 8:00 Am',
      status: 'To Do',
      goals: [
        { id: 1, text: '35% less downtime', completed: false },
        { id: 2, text: '350+ technicians trained', completed: false },
        { id: 3, text: 'Zero safety issues post-training', completed: false },
        { id: 4, text: '50+ technicians trained', completed: false }
      ]
    }
  ]);
  const [notes, setNotes] = useState([
    "Revise previous day's topic (15 mins)",
    'Solve 2-3 word problems / real-life application',
    "Revise previous day's topic (15 mins)",
    "Revise previous day's topic (15 mins)",
    'Solve 2-3 word problems / real-life application',
    "Revise previous day's topic (15 mins)"
  ]);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({
    subject: '',
    date: '',
    goals: ['', '', '', '']
  });
  const tabs = ['To Do', 'Ongoing', 'Completed'];
  const filteredTasks = tasks.filter(task => task.status === activeTab);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTaskId, setPickerTaskId] = useState<number | null>(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [webEditingTaskId, setWebEditingTaskId] = useState<number | null>(null);
  const [modalPickerVisible, setModalPickerVisible] = useState(false);
  const [modalTempDate, setModalTempDate] = useState<Date>(new Date());
  const [modalWebEditing, setModalWebEditing] = useState(false);
  const [addTaskError, setAddTaskError] = useState('');
  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };
  const toggleGoal = (taskId: number, goalId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          goals: task.goals.map(goal => 
            goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
          )
        };
      }
      return task;
    }));
  };
  const addTask = () => {
    if (!newTask.subject || !newTask.date) {
      setAddTaskError('Please enter subject and select date/time.');
      return;
    }
    setAddTaskError('');
    const task = {
      id: Date.now(),
      subject: newTask.subject,
      date: newTask.date,
      status: activeTab,
      goals: newTask.goals
        .filter(goal => goal.trim())
        .map((goal, index) => ({ id: index + 1, text: goal, completed: false }))
    };
    setTasks([...tasks, task]);
    setNewTask({ subject: '', date: '', goals: ['', '', '', ''] });
    setShowAddTaskModal(false);
  };
  const getCardColor = (status: string) => {
    switch (status) {
      case 'To Do': return styles.cardBlue;
      case 'Ongoing': return styles.cardRed;
      case 'Completed': return styles.cardGreen;
      default: return styles.cardBlue;
    }
  };
  const { width: windowWidth } = useWindowDimensions();
  const windowHeight = Dimensions.get('window').height;
  const isMobile = windowWidth < 480;
  const isDesktop = windowWidth >= 1024;
  // Helper to open picker for a task
  const openPicker = (taskId: number, mode: 'date' | 'time') => {
    setPickerTaskId(taskId);
    setPickerMode(mode);
    setPickerVisible(true);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Try to parse date string, fallback to now
      const parsed = Date.parse(task.date);
      setTempDate(isNaN(parsed) ? new Date() : new Date(parsed));
    }
  };
  // Handle picker confirm
  const handlePickerConfirm = (date: Date) => {
    if (pickerTaskId !== null) {
      setTasks(tasks.map(task =>
        task.id === pickerTaskId
          ? { ...task, date: date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) }
          : task
      ));
    }
    setPickerVisible(false);
    setPickerTaskId(null);
  };
  const handleModalPickerConfirm = (date: Date) => {
    setNewTask({ ...newTask, date: date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) });
    setModalPickerVisible(false);
    setModalWebEditing(false);
  };
  return (
    <UserDashboardLayout title="Study Planner" activeLabel="Study Planner">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, padding: isMobile ? 8 : 40, alignItems: 'stretch', minHeight: isDesktop ? windowHeight : undefined, width: '100%' }}>
        <View style={[isDesktop ? { flexDirection: 'column', width: '100%', alignItems: 'stretch', position: 'relative', minHeight: windowHeight } : {}]}> 
          {/* Top Row: Tabs and Add Task Button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', gap: isMobile ? 4 : 12, flexShrink: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              {tabs.map((tab, idx) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: idx === 0 ? '#282FFB' : idx === 1 ? '#f59e42' : '#10b981',
                    borderRadius: isMobile ? 10 : 999,
                    paddingHorizontal: isMobile ? 8 : 24,
                    paddingVertical: isMobile ? 4 : 8,
                    marginRight: idx < tabs.length - 1 ? (isMobile ? 4 : 12) : 0,
                    opacity: activeTab === tab ? 1 : 0.7,
                    borderWidth: activeTab === tab ? 2 : 0,
                    borderColor: activeTab === tab ? '#2563eb' : 'transparent',
                    minWidth: isMobile ? 55 : undefined,
                    zIndex: isMobile ? 10 : undefined,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? 11 : 16 }}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setShowAddTaskModal(true)}
              style={{
                backgroundColor: '#2563eb',
                borderRadius: isMobile ? 12 : 999,
                paddingHorizontal: isMobile ? 14 : 32,
                paddingVertical: isMobile ? 7 : 12,
                minWidth: isMobile ? 75 : 120,
                marginRight: 0,
                zIndex: isMobile ? 10 : undefined,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? 13 : 17, textAlign: 'center' }}>Add New Task</Text>
            </TouchableOpacity>
          </View>
          {/* Cards and Notes Row */}
          <View style={[isDesktop ? { flexDirection: 'column', width: '100%', alignItems: 'flex-start', gap: 0 } : {}]}> 
            {/* Task Cards Row */}
            {isDesktop ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ gap: 40, paddingBottom: 8 }}>
                {filteredTasks.map((task, idx) => (
                  <GlassCard key={task.id} style={[styles.taskCard, { backgroundColor: idx % 2 === 0 ? '#282FFB' : '#E0115E', minWidth: 380, maxWidth: 420, flex: 1, marginBottom: 0, padding: 0 }]}> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingBottom: 12 }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22 }}>{task.subject}</Text>
                      {Platform.OS === 'web' ? (
                        webEditingTaskId === task.id ? (
                          <input
                            type="datetime-local"
                            value={(() => {
                              const d = new Date(Date.parse(task.date));
                              if (isNaN(d.getTime())) return '';
                              const pad = (n: number) => n.toString().padStart(2, '0');
                              return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                            })()}
                            onChange={e => {
                              const val = e.target.value;
                              if (val) {
                                const newDate = new Date(val);
                                setTasks(tasks.map(t => t.id === task.id ? { ...t, date: newDate.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) } : t));
                              }
                              setWebEditingTaskId(null);
                            }}
                            onBlur={() => setWebEditingTaskId(null)}
                            autoFocus
                            style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, marginLeft: 8 }}
                          />
                        ) : (
                          <span onClick={() => setWebEditingTaskId(task.id)} style={{ cursor: 'pointer', color: '#fff', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ marginRight: 4 }}>🕒</span>
                            <span style={{ fontWeight: 500, fontSize: 15 }}>{task.date}</span>
                          </span>
                        )
                      ) : (
                        <TouchableOpacity onPress={() => openPicker(task.id, 'date')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ color: '#fff', marginRight: 4 }}>🕒</Text>
                          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15, textDecorationLine: 'underline' }}>{task.date}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                      {task.goals.map(goal => (
                        <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                          <Image
                            source={require('../../assets/icons/check-verified-03.png')}
                            style={{ width: 22, height: 22, marginRight: 10 }}
                            resizeMode="contain"
                          />
                          <Text style={{ color: '#fff', fontSize: 15 }}>{goal.text}</Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                ))}
              </ScrollView>
            ) : (
              <View style={{ flexDirection: 'column', width: '100%' }}>
                {filteredTasks.map((task, idx) => (
                  <GlassCard key={task.id} style={[styles.taskCard, { backgroundColor: idx % 2 === 0 ? '#282FFB' : '#E0115E', marginBottom: 12, padding: isMobile ? 8 : 0, width: '100%', maxWidth: '100%', minWidth: '100%', alignSelf: 'stretch', overflow: 'visible' }]}> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? 8 : 24, paddingBottom: isMobile ? 4 : 12, width: '100%', overflow: 'visible' }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22 }}>{task.subject}</Text>
                      {Platform.OS === 'web' ? (
                        webEditingTaskId === task.id ? (
                          <input
                            type="datetime-local"
                            value={(() => {
                              const d = new Date(Date.parse(task.date));
                              if (isNaN(d.getTime())) return '';
                              const pad = (n: number) => n.toString().padStart(2, '0');
                              return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                            })()}
                            onChange={e => {
                              const val = e.target.value;
                              if (val) {
                                const newDate = new Date(val);
                                setTasks(tasks.map(t => t.id === task.id ? { ...t, date: newDate.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) } : t));
                              }
                              setWebEditingTaskId(null);
                            }}
                            onBlur={() => setWebEditingTaskId(null)}
                            autoFocus
                            style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, marginLeft: 8 }}
                          />
                        ) : (
                          <span onClick={() => setWebEditingTaskId(task.id)} style={{ cursor: 'pointer', color: '#fff', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ marginRight: 4 }}>🕒</span>
                            <span style={{ fontWeight: 500, fontSize: 15 }}>{task.date}</span>
                          </span>
                        )
                      ) : (
                        <TouchableOpacity onPress={() => openPicker(task.id, 'date')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ color: '#fff', marginRight: 4 }}>🕒</Text>
                          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15, textDecorationLine: 'underline' }}>{task.date}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{ paddingHorizontal: isMobile ? 8 : 24, paddingBottom: isMobile ? 8 : 24, width: '100%', overflow: 'visible' }}>
                      {task.goals.map(goal => (
                        <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                          <Image
                            source={require('../../assets/icons/check-verified-03.png')}
                            style={{ width: 22, height: 22, marginRight: 10 }}
                            resizeMode="contain"
                          />
                          <Text style={{ color: '#fff', fontSize: 15 }}>{goal.text}</Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}
            {/* Notes Section at bottom left */}
            <View style={isDesktop ? { width: '100%', marginTop: 40, flexDirection: 'row', alignItems: 'flex-start', gap: 32 } : { width: '100%', marginTop: 40, flexDirection: 'column' }}>
              {/* Notes Section */}
              <View style={{ flex: 1, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', marginLeft: isMobile ? 24 : 0 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#22223b', marginBottom: 12 }}>Add Notes</Text>
                {/* Simplified Add Note input and notes list for all devices */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <TextInput
                    value={newNote}
                    onChangeText={setNewNote}
                    placeholder="Type your note here..."
                    style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, backgroundColor: '#fff', marginRight: 8 }}
                    onSubmitEditing={addNote}
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={addNote} style={{ backgroundColor: '#2563eb', borderRadius: isMobile ? 10 : 8, paddingHorizontal: isMobile ? 10 : 18, paddingVertical: isMobile ? 7 : 10 }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? 13 : 15 }}>Add</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {notes.map((note, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: '#2563eb', fontSize: 18, marginRight: 8 }}>•</Text>
                      <Text style={{ color: '#22223b', fontSize: 15 }}>{note}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* Illustration */}
              {isDesktop && (
                <View style={{ flexShrink: 0, alignItems: 'flex-end' }}>
                  <Image source={require('../../assets/studyplanner.png')} style={{ width: 480, height: 320, resizeMode: 'contain' }} />
                </View>
              )}
            </View>
          </View>
        </View>
        {/* Add Task Modal */}
        <Modal
          visible={showAddTaskModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddTaskModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              {addTaskError ? <Text style={{ color: 'red', marginBottom: 8 }}>{addTaskError}</Text> : null}
              <TextInput
                  value={newTask.subject}
                onChangeText={text => setNewTask({ ...newTask, subject: text })}
                placeholder="Subject"
                style={styles.modalInput}
                />
              {Platform.OS === 'web' ? (
                modalWebEditing ? (
                  <input
                    type="datetime-local"
                    value={(() => {
                      const d = new Date(Date.parse(newTask.date));
                      if (isNaN(d.getTime())) return '';
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    })()}
                    onChange={e => {
                      const val = e.target.value;
                      if (val) {
                        const newDate = new Date(val);
                        setNewTask({ ...newTask, date: newDate.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) });
                      }
                      setModalWebEditing(false);
                    }}
                    onBlur={() => setModalWebEditing(false)}
                    autoFocus
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 10, width: '100%' }}
                  />
                ) : (
                  <TouchableOpacity onPress={() => setModalWebEditing(true)} style={[styles.modalInput, { justifyContent: 'center', minHeight: 40, backgroundColor: '#f9fafb' }]}> 
                    <Text style={{ color: newTask.date ? '#22223b' : '#9ca3af', fontSize: 14 }}>
                      {newTask.date || 'Select Date & Time'}
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity onPress={() => setModalPickerVisible(true)} style={[styles.modalInput, { justifyContent: 'center', minHeight: 40, backgroundColor: '#f9fafb' }]}> 
                  <Text style={{ color: newTask.date ? '#22223b' : '#9ca3af', fontSize: 14 }}>
                    {newTask.date || 'Select Date & Time'}
                  </Text>
                </TouchableOpacity>
              )}
              {newTask.goals.map((goal, idx) => (
                <TextInput
                  key={idx}
                    value={goal}
                  onChangeText={text => {
                      const updatedGoals = [...newTask.goals];
                    updatedGoals[idx] = text;
                    setNewTask({ ...newTask, goals: updatedGoals });
                    }}
                  placeholder={`Goal ${idx + 1}`}
                  style={styles.modalInput}
                  />
                ))}
              <View style={styles.modalButtonRow}>
                <TouchableOpacity onPress={() => setShowAddTaskModal(false)} style={[styles.modalCancelButton, isMobile && { paddingVertical: 7, borderRadius: 10 }]}>
                  <Text style={[styles.modalCancelButtonText, isMobile && { fontSize: 13 }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addTask} style={[styles.modalAddButton, isMobile && { paddingVertical: 7, borderRadius: 10 }]}>
                  <Text style={[styles.modalAddButtonText, isMobile && { fontSize: 13 }]}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {Platform.OS !== 'web' && (
          <DateTimePickerModal
            isVisible={pickerVisible}
            mode={pickerMode}
            date={tempDate}
            onConfirm={handlePickerConfirm}
            onCancel={() => setPickerVisible(false)}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            pickerContainerStyleIOS={{ minWidth: '100%', backgroundColor: '#22223b' }}
          />
        )}
        {Platform.OS !== 'web' && (
          <DateTimePickerModal
            isVisible={modalPickerVisible}
            mode="datetime"
            date={modalTempDate}
            onConfirm={handleModalPickerConfirm}
            onCancel={() => setModalPickerVisible(false)}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            pickerContainerStyleIOS={{ minWidth: '100%', backgroundColor: '#22223b' }}
          />
        )}
      </ScrollView>
    </UserDashboardLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  addTaskButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addTaskButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  taskCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
  },
  cardBlue: {
    backgroundColor: '#282FFB',
  },
  cardRed: {
    backgroundColor: '#E0115E',
  },
  cardGreen: {
    backgroundColor: '#10b981',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 16,
  },
  taskSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  taskDate: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  goalsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  goalChecked: {
    backgroundColor: '#fff',
  },
  goalText: {
    color: '#fff',
    fontSize: 14,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  noteRow: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  noteText: {
    color: '#374151',
    fontSize: 13,
  },
  addNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  addNoteButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addNoteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 14,
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});