import React from 'react';

//Components

//Styling
import './Budget.css';

const Budget = (): React.JSX.Element => {
  return (
    <div className='Budget'>
      <div className='Budget-incomeSection'>
        <h5>Incomes</h5>
      </div>
      <div className='Budget-expenseSection'>
        <h5>Expenses</h5>
      </div>
      <div className='Budget-breakdownSection'>
        <p>Breakdown</p>
      </div>
    </div>
  );
};

export default Budget;
