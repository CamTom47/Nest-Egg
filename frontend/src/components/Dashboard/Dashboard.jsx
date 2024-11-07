import React from 'react';

//Components
import DashboardCard from '../DashboardCard/DashboardCard';
import DashboardSummary from '../DashboardSummary/DashboardSummary';

//Styling
import './Dashboard.css';

const Dashboard = (): React.JSX.Element => {
  return (
    <div className="Dashboard">
      <div className="Dashboard-cards">
      <DashboardCard/>
      <DashboardCard/>
      <DashboardCard/>
      </div>
      <div className='Dashboard-Summary'>
        <DashboardSummary/>
      </div>
      
      
    </div>
  );
}

export default Dashboard;
