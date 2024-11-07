import React from 'react';


//Styling
import './Navbar.css'

const Navbar = (): React.JSX.Element => {
  return (
    <div id='Navbar'>
      <div className='Navbar-header'>
        <div className='NavIcon'>
          <span className='NavContent'></span>
          <span className='NavContent'></span>
          <span className='NavContent'></span>
        </div>
        <p>Nest Egg</p>
        <div>
            Login
            Signup
        </div>
      </div>
    </div>
  );
};

export default Navbar;
