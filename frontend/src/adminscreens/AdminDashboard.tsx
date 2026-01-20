import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import AdminLayout from './AdminLayout';
import AdminFeatureCards from './AdminFeatureCards';
import AdminDashboardChart from './AdminDashboardChart';
import AdminDashboardChart2 from './AdminDashboardChart2';
import AdminStudentPerformanceMetrics from './AdminStudentPerformanceMetrics';
import AdminExamTestData from './AdminExamTestData';

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