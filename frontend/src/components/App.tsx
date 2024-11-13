import React, { useState, useContext, useCallback, useEffect } from "react";
import { Routes, Route } from "react-router";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router";

//Context
import UserContext from "../context/UserContext";

//Components
import Navbar from "./Navbar/Navbar";
import Account from "./Account/Account";
import Dashboard from "./Dashboard/Dashboard";
import Homepage from "./Homepage/Homepage";
import Budget from "./Budget/Budget";
import RegisterForm from "./Forms/RegisterForm/RegisterForm";

//Styling
import "./App.css";
import NestEggApi from "../api/nesteggApi";

interface UserType {
	id: number;
	username: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	isAdmin: boolean;
}

const App = (): React.JSX.Element => {
	const initialUserState = null;
	const [currentUser, setCurrentUser] = useState<{} | null>(initialUserState);
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const navigate = useNavigate();

	console.debug(currentUser, token);

	if(token) NestEggApi.token = token

	const checkLoggedIn = useCallback(async () => {
		if (token) {
			let user: UserType | null = await decodeToken(token);
			setCurrentUser(user);
		}
	}, [token]);

	useEffect(() => {
		checkLoggedIn();
	}, [checkLoggedIn]);

	const login = async (formData: { username: string; password: string }) => {
		let token: string = await NestEggApi.login(formData);
		if (token) {
			NestEggApi.token = token;
			setToken(token)
			localStorage.setItem("token", token);
			let user: UserType | null = await decodeToken(token);
			if (user) {
				user = await NestEggApi.findUser({ userId: user.id });
			}
			setCurrentUser(user);
		}
	};

	const register = async (formData: { username: string; password: string }) => {
		let token: string = await NestEggApi.register(formData);
		if (token) {
			NestEggApi.token = token;
			localStorage.setItem("token", token);
			let user: UserType | null = await decodeToken(token);
			setCurrentUser(user);
		}
	};

	const logout = async () => {
		// NestEggApi.token = "";
		localStorage.clear();
		setToken(null);
		setCurrentUser(initialUserState);
		navigate("/");
	};

	return (
		<div className='App'>
			<UserContext.Provider value={{ currentUser, login, register, logout }}>
				<Navbar />
				<Routes>
					<Route path='/register' element={<RegisterForm />} />
					<Route path='/account' element={<Account />} />
					<Route path='/budget/:budget_id' element={<Budget />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/' element={<Homepage />} />
					<Route path='*' element={<Homepage />} />
				</Routes>
			</UserContext.Provider>
		</div>
	);
};

export default App;
