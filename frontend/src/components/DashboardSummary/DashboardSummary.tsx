import React, { useState, useContext } from "react";
import NestEggApi from "../../api/nesteggApi";

//Components
import NewBudgetForm from "../Forms/NewBudgetForm/NewBudgetForm";

//Styling
import "./DashboardSummary.css";

//Context
import UserContext from "../../context/UserContext";

interface BudgetCreation {
	name: string;
	description: string;
	incomes: {}[];
	expenses: {}[];
}
interface FormProps {
	categories: [];
	subcategories: [];
}

const DashboardSummary = ({ categories, subcategories }: FormProps): React.JSX.Element => {
	const [showNewBudgetForm, setShowNewBudgetForm] = useState<boolean>(false);
	const [budgets, setBudgets] = useState<{}[]>([]);

	const currentUser = useContext(UserContext)

	const toggleNewBudgetForm = () => {
		setShowNewBudgetForm((showNewBudgetForm) => !showNewBudgetForm);
	};

	const createBudget = async (formData: BudgetCreation) => {
		console.log(formData)
		//need to make a income subcategory creation and new allocation

		// need to make an expense subcategory and new allocation
		// let budget = await NestEggApi.createBudget({ userId: currentUser.id, name: formData.name, description: formData.description });
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
				<button onClick={toggleNewBudgetForm}>Create New Budget</button>
			</div>

			<div className={showNewBudgetForm === true ? "visible" : "hidden"}>
				<NewBudgetForm toggle={toggleNewBudgetForm} categories={categories} subcategories={subcategories} createBudget={createBudget} />
			</div>
		</div>
	);
};

export default DashboardSummary;
