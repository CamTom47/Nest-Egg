import React, { useCallback, useEffect, useContext, useState } from "react";

//Components
import DashboardCard from "../DashboardCard/DashboardCard";
import DashboardSummary from "../DashboardSummary/DashboardSummary";

//Context
import UserContext from "../../context/UserContext";

//Styling
import "./Dashboard.css";
import NestEggApi from "../../api/nesteggApi";
import { cursorTo } from "readline";
import { useNavigate } from "react-router";

const Dashboard = (): React.JSX.Element => {
	const [budgets, setBudgets] = useState<[] | undefined>([]);
	const [allocations, setAllocations] = useState<[]>([]);
	const [categories, setCategories] = useState<[]>([]);
	const [subcategories, setSubcategories] = useState<[]>([]);

	const {currentUser} = useContext(UserContext);

	const getBudgets = useCallback(async () => {
		try {
			let budgets: [] = await NestEggApi.findAllBudgets({userId: currentUser.id});
			setBudgets(budgets);
		} catch (err) {
			return err;
		}
	}, []);
	const getCategories = useCallback(async () => {
		try {
			let categories: [] = await NestEggApi.findAllCategories({userId: currentUser.id});
			setCategories(categories);
		} catch (err) {
			return err;
		}
	}, []);
	const getSubcategories = useCallback(async () => {
		try {
			let subcategories: [] = await NestEggApi.findAllSubcategories({userId: currentUser.id});
			setSubcategories(subcategories);
		} catch (err) {
			return err;
		}
	}, []);

	useEffect(() => {
		getBudgets();
	}, [getBudgets]);
	useEffect(() => {
		getCategories();
	}, [getCategories]);
	useEffect(() => {
		getSubcategories();
	}, [getSubcategories]);

	return (
		<div className='Dashboard'>
			<div className='Dashboard-cards'>
				<DashboardCard />
				<DashboardCard />
				<DashboardCard />
			</div>
			<div className='Dashboard-Summary'>
				<DashboardSummary categories={categories} subcategories={subcategories}/>
			</div>
		</div>
	);
};

export default Dashboard;
