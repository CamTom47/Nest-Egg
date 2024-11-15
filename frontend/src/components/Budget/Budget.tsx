import React, { useCallback, useState, useContext } from "react";
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

	const currentUser = useContext(UserContext);

	let { budgetId } = useParams();

	const getBudgetInformation = useCallback(async () => {
		let budget: Budget = await NestEggApi.findBudget({ budgetId: Number(budgetId), userId: currentUser.id });
		setBudget(budget);
	}, []);

	return (
		<div className='Budget'>
			<div>
				<div className='Budget-incomeSection'>
					<h5>Incomes</h5>
					<div className='incomeSectionBody'>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>Frequency</th>
									<th>Contributor 1</th>
									<th>Contributor 2</th>
									<th className='totalColumn'>Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colSpan={4}>Work</td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td>120</td>
									<td>241</td>
								</tr>
								<tr>
									<td>Add category</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td>Total</td>
									<td>Sum Above</td>
									<td>Sum Above</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
				<div className='Budget-expenseSection'>
					<h5>Expenses</h5>
					<div className='expenseSectionBody'>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit iste aliquam aut eligendi quo
							recusandae, dicta ullam officia ea dignissimos natus. Corrupti harum rerum fuga optio quod quos autem
							voluptatum.
						</p>
					</div>
				</div>
			</div>
			<div>
				<div className='Budget-breakdownSection'>
					<p>Breakdown</p>
				</div>
			</div>
		</div>
	);
};

export default Budget;
