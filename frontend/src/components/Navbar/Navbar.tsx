import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

//Styling
import "./Navbar.css";

const Navbar = (): React.JSX.Element => {
	const {currentUser, logout} = useContext(UserContext);

	return currentUser !== null ? (
		<div className='Navbar'>
			<div className='Navbar-header'>
				<div className='NavIcon'>
					<span className='NavContent'></span>
					<span className='NavContent'></span>
					<span className='NavContent'></span>
				</div>
				<Link className="Navbar-link" to='/'>Nest Egg</Link>
				<div>
					<Link className="Navbar-link" to='/account'>{currentUser.username}</Link>
					<Link className="Navbar-link" to='/' onClick={logout}>Logout</Link>
				</div>
			</div>
		</div>
	) : (
		<div className='Navbar'>
			<div className='Navbar-header'>
				<Link className="Navbar-link" to='/'>Nest Egg</Link>
				<div>
					<Link className="Navbar-link" to='/'>Login</Link>
					<Link className="Navbar-link" to='/register'>Signup</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
