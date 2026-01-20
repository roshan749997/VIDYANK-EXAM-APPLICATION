import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import AdminLayout from '../components/AdminLayout';
import AdminFeatureCards from '../components/AdminFeatureCards';
import AdminDashboardChart from '../components/AdminDashboardChart';
import AdminDashboardChart2 from '../components/AdminDashboardChart2';
import AdminStudentPerformanceMetrics from '../components/AdminStudentPerformanceMetrics';
import AdminExamTestData from '../components/AdminExamTestData';

const AdminDashboard = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1200;

  return (
    <AdminLayout title="Admin Dashboard">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <AdminFeatureCards />
        {isDesktop ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 32, marginVertical: 16 }}>
            <AdminDashboardChart />
            <AdminDashboardChart2 />
          </View>
        ) : (
          <>
            <AdminDashboardChart />
            <AdminDashboardChart2 />
          </>
        )}
        {isDesktop ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 32, marginVertical: 16 }}>
            <AdminExamTestData />
            <AdminStudentPerformanceMetrics />
          </View>
        ) : (
          <>
            <AdminExamTestData />
            <AdminStudentPerformanceMetrics />
          </>
        )}
      </ScrollView>
    </AdminLayout>
  );
};

export default AdminDashboard;