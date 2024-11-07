import React from 'react';
import { Routes, Route } from 'react-router';

//Components
import Navbar from './Navbar/Navbar';
import Account from './Account/Account';
import Dashboard from './Dashboard/Dashboard';
import Homepage from './Homepage/Homepage';
import Budget from './Budget/Budget';

//Styling
import './App.css';

const App = (): React.JSX.Element =>{
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/budget/:budget_id" element={<Budget/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="*" element={<Homepage/>}/>
      </Routes>

      
    </div>
  );
}

export default App;
