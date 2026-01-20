import React from 'react';
import { useWindowDimensions } from 'react-native';
import DashboardDesktop from '../components/DashboardDesktop';
import DashboardMobile from '../components/DashboardMobile';
import UserDashboardLayout from '../components/UserDashboardLayout';

const NewDashboard = () => {
  const { width } = useWindowDimensions();
  return (
    <UserDashboardLayout title="Dashboard" activeLabel="Dashboard">
      {width < 480 ? <DashboardMobile /> : <DashboardDesktop />}
    </UserDashboardLayout>
  );
};

export default NewDashboard; 