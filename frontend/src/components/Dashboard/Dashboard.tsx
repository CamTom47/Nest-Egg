import React, { useCallback, useEffect, useMemo, useState } from "react";

//Components
import DashboardCard from "../DashboardCard/DashboardCard";
import DashboardSummary from "../DashboardSummary/DashboardSummary";

//Styling
import "./Dashboard.css";
import NestEggApi from "../../api/nesteggApi";

const Dashboard = (): React.JSX.Element => {
	const [budgets, setBudgets] = useState<[] | undefined>([]);
	const [allocations, setAllocations] = useState<[]>([]);
	const [categories, setCategories] = useState<[]>([]);
	const [subcategories, setSubcategories] = useState<[]>([]);

	const getBudgets = useCallback(async () => {
		try {
			let budgets: [] = await NestEggApi.findAllBudgets();
			setBudgets(budgets);
		} catch (err) {
			return err;
		}
	}, []);
	const getCategories = useCallback(async () => {
		try {
			let categories: [] = await NestEggApi.findAllCategories();
			setCategories(categories);
		} catch (err) {
			return err;
		}
	}, []);
	const getSubcategories = useCallback(async () => {
		try {
			let subcategories: [] = await NestEggApi.findAllSubcategories();
			setSubcategories(subcategories);
		} catch (err) {
			return err;
		}
	}, []);

	// const getSubcategories = useCallback(async () => {
	// 	try {
	// 		let subcategories: [] = await NestEggApi.findAllSubcategories();
	// 		setSubcategories(subcategories);
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }, []);

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
