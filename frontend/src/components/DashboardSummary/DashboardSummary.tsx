import React from 'react';

//Components

//Styling
import './DashboardSummary.css';

const DashboardSummary = (): React.JSX.Element => {
  return (
    <div className='DashboardSummary'>
      <div className='Dashboard-tabs'>
        <div className='Dashboard-tab active' id='tab1'>
          <p>Budgets</p>
        </div>
        <div className='Dashboard-tab'>
          <p>Allocations</p>
        </div>
        <div className='Dashboard-tab' id='tab3'>
          <p>Categories</p>
        </div>
      </div>
      <div className='Dashboard-body'>
        
      </div>
    </div>
  );
};

export default DashboardSummary;
