import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import NestEggApi from "../../api/nesteggApi";

//Components

//Styling
import "./DashboardSummary.css";

//Context
import UserContext from "../../context/UserContext";

interface Budget {
	id: number;
	userId: number;
	name: string;
	description: string;
}
interface FormProps {
	categories: [];
	subcategories: [];
}

const DashboardSummary = ({ categories, subcategories }: FormProps): React.JSX.Element => {
	const [budgets, setBudgets] = useState<{}[]>([]);

	const navigate = useNavigate();
	const {currentUser} = useContext(UserContext);

	const createBudget = async () => {
		let budget: Budget = await NestEggApi.createBudget({ userId: currentUser.id, name: "", description: "" });
		navigate(`/budget/${budget.id}`);

		//need to make a income subcategory creation and new allocation

		// need to make an expense subcategory and new allocation
		// let subcategories = await NestEggApi.createSubcategory()
		// let allocations =

		// setBudgets([{ ...budgets, budget }]);
	};

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
				<button onClick={createBudget}>Create New Budget</button>
			</div>
		</div>
	);
};

export default DashboardSummary;
