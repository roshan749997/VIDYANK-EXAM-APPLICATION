import React from 'react';
import { useWindowDimensions } from 'react-native';
import DashboardDesktop from './DashboardDesktop';
import DashboardMobile from './DashboardMobile';
import UserDashboardLayout from './UserDashboardLayout';

const NewDashboard = () => {
  const { width } = useWindowDimensions();
  return (
    <UserDashboardLayout title="Dashboard" activeLabel="Dashboard">
      {width < 480 ? <DashboardMobile /> : <DashboardDesktop />}
    </UserDashboardLayout>
  );
};

export default NewDashboard; 