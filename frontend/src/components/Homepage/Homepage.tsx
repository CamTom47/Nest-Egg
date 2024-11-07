import React from 'react';
import './Homepage.css';


//Components
import LoginForm from '../Forms/LoginForm/LoginForm';

const Homepage = (): React.JSX.Element => {
  return (
    <div className="Homepage">

      <LoginForm/>
      
    </div>
  );
}

export default Homepage;
