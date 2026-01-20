import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // blue
  labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.6,
};

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [20, 35, 40, 60, 80, 55],
      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // blue for bars
    },
  ],
};

const AdminDashboardChart2 = () => {
  const { width } = useWindowDimensions();
  const chartWidth = width > 700 ? 600 : width - 32;
  const chartHeight = width > 700 ? 280 : 220;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Registrations</Text>
      <BarChart
        data={data}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix=""
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
    shadowColor: '#4f46e5', // blue shadow
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

export default AdminDashboardChart2; 