import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // #4f46e5
  labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
  strokeWidth: 2,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4f46e5',
  },
  paddingLeft: 28, // Increased for Y-axis label visibility
};

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [30, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const AdminDashboardChart = () => {
  const { width } = useWindowDimensions();
  const chartWidth = width > 700 ? 600 : width - 32;
  const chartHeight = width > 700 ? 280 : 220;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Activity (Last 6 Months)</Text>
      <LineChart
        data={data}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        yLabelsOffset={12}
        style={{ ...styles.chart, marginLeft: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 16,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 12,
  },
  chart: {
    // borderRadius: 12, // removed
  },
});

export default AdminDashboardChart; 