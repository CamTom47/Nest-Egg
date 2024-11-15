import React, { useCallback, useState, useContext, useEffect } from "react";
import { useParams } from "react-router";

//Components

//Context
import UserContext from "../../context/UserContext";

//Styling
import "./Budget.css";
import NestEggApi from "../../api/nesteggApi";

interface Budget {
	id: number;
	userId: number;
	name: string;
	description: string;
}
const Budget = (): React.JSX.Element => {
	const [budget, setBudget] = useState<{}>({});
	const [allocations, setAllocations] = useState<[]>([]);
	const [categories, setCategories] = useState<[]>([]);
	const [subcategories, setSubcategories] = useState<[]>([]);
	const {currentUser} = useContext(UserContext);
	let { budgetId } = useParams();

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
	const getAllocations = useCallback(async () => {
		try {
			let allocations: [] = await NestEggApi.findAllAllocations({userId: currentUser.id});
			setAllocations(allocations);
		} catch (err) {
			return err;
		}
	}, []);

	useEffect(() => {
		getAllocations();
	}, [getAllocations]);
	useEffect(() => {
		getCategories();
	}, [getCategories]);
	useEffect(() => {
		getSubcategories();
	}, [getSubcategories]);

  const generateIncomeSection = (allocations, contributors, frequencies, categories, subcategories ) => {
  };

  const incomeSectionComponents =  (
    <div className='bg-sky-300 mx-2 my-3 rounded-xl p-3 shadow-lg'>
					<h5 className='text-3xl m-3'>Incomes</h5>
					<div>
						{/* Overall grid */}
						<div className='grid grid-cols-12 gap-x-0 bg-sky-200 rounded-lg p-5'>
							<div></div>
							<div>Frequency</div>
							<div>Cont 1</div>
							<div>Cont 2</div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div>Total</div>

							<div className='bg-sky-500'>Salary</div>
							<div className='bg-sky-500'>Yearly</div>
							<input className='bg-sky-500' type='text' value='$100.00' />
							<input className='bg-sky-500' type='text' value='$100.00' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' type='text' value='$200.00' />

							<div className='bg-sky-500'>Airbnb</div>
							<div className='bg-sky-500'>Yearly</div>
							<input className='bg-sky-500' type='text' value='$500.00' />
							<input className='bg-sky-500' type='text' value='500.00' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' />
							<input className='bg-sky-500' type='text' value='$1000.00' />

							<div>Total</div>
							<div></div>
							<div>$600.00</div>
							<div>$600.00</div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div>$1200.00</div>
							<button className='bg-sky-500 rounded-md'>New Allocation</button>
						</div>
						<button className='bg-gray-500 text-white p-1 m-1 rounded-md'>New Category</button>
					</div>
				</div>
  )

  const expenseSectionComponent = (
    <div className='bg-orange-300 mx-2 my-3 rounded-xl p-3'>
					<h5 className='text-3xl m-3'>Expenses</h5>
					<div>
						{/* Overall grid */}
            <p>Housing</p>
						<div className='grid grid-cols-12 gap-x-0 bg-orange-200 rounded-lg p-5'>
							<div></div>
							<div>Frequency</div>
							<div>Expense Type</div>
							<div>Cont 1</div>
							<div>Cont 2</div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div>Total</div>

							<div className='bg-orange-500'>Mortage</div>
							<div className='bg-orange-500'>Monthly</div>
							<input className='bg-orange-500' value="Need"/>
							<input className='bg-orange-500' type='text' value='$100.00' />
							<input className='bg-orange-500' type='text' value='$100.00' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' type='text' value='$200.00' />

							<div className='bg-orange-500'>Insurance</div>
							<div className='bg-orange-500'>Monthly</div>
							<input className='bg-orange-500' value="Want"/>
							<input className='bg-orange-500' type='text' value='$500.00' />
							<input className='bg-orange-500' type='text' value='500.00' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' />
							<input className='bg-orange-500' type='text' value='$1000.00' />

							<div>Total</div>
							<div></div>
							<div></div>
							<div>$600.00</div>
							<div>$600.00</div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div>$1200.00</div>
							<button className='bg-orange-500 rounded-md'>New Allocation</button>
						</div>
						<button className='bg-gray-500 text-white p-1 m-1 rounded-md'>New Category</button>
					</div>
				</div>
  )

	return (
		<div className='flex flex-row justify-center'>
			<div className='flex-col'>
        {incomeSectionComponents}
        {expenseSectionComponent}
			</div>
		</div>
	);
};

export default Budget;
