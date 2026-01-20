import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const data = [
  { label: 'Total Exams Conducted', value: 15 },
  { label: 'Upcoming Scheduled Exams', value: 5 },
  { label: 'Ongoing Exams', value: 4 },
  { label: 'Students appeared', value: 48 },
];

const AdminExamTestData = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Exam & Test Data</Text>
    {data.map((item, idx) => (
      <View key={idx} style={styles.row}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 18,
    minWidth: 220,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginVertical: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    minWidth: 32,
    textAlign: 'right',
  },
});

export default AdminExamTestData; 