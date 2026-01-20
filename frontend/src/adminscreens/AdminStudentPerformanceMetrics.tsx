import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const metrics = [
  { label: 'Top Performing Students', value: 15 },
  { label: 'Average Score per Subject', value: 75 },
  { label: 'Average Score per Subject', value: 75 },
];

const AdminStudentPerformanceMetrics = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Student Performance Metrics</Text>
    {metrics.map((item, idx) => (
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
    padding: 32,
    minWidth: 600,
    maxWidth: 600,
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
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    minWidth: 32,
    textAlign: 'right',
    fontFamily: 'Roboto',
  },
});

export default AdminStudentPerformanceMetrics; 