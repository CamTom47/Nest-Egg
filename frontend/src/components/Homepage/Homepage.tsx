import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';


//Components
import LoginForm from '../Forms/LoginForm/LoginForm';

const Homepage = (): React.JSX.Element => {
  return (
    <div className="Homepage">

      <LoginForm/>
      <p>New to Nest Egg?</p>
      <p>Signup <Link to="/register">here</Link></p>
      
    </div>
  );
}

export default Homepage;
