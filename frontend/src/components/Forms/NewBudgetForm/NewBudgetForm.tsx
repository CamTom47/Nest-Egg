import React, { useContext } from "react";
import { useNavigate } from "react-router";
import NestEggApi from "../../../api/nesteggApi";
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikErrors, FieldArray, insert } from "formik";
import $ from "jquery";

//Context
import UserContext from "../../../context/UserContext";

//Styling
import "./NewBudgetForm.css";

interface FormValues {
	name: string;
	description: string;
	incomes: [{ name: string; amount: number }];
	expenses: [{ name: string; subcategory: number; amount: number }];
}

interface Props {
	toggle: () => void;
	categories: { id:number, name: string; description: string }[];
	subcategories: { id:number, name: string; categoryId: number }[];
	createBudget: (param: FormValues) => void;
}

const NewBudgetForm = ({ toggle, categories, subcategories, createBudget }: Props): React.JSX.Element => {
	const navigate = useNavigate();
	
	const incomeCategory: {id: number, name: string, description: string} | undefined = categories.find( category => category.name === "Income");
	let incomeCategoryId;
	if(incomeCategory){
		incomeCategoryId = incomeCategory.id;
	}


	const handleClick = (e: any): void => {
		if ($(e.target).hasClass("removeButton")) removeIncomeInput(e.target);
		if ($(e.target).hasClass("addButton")) addIncomeInput();
	};
	const addIncomeInput = (): void => {
		const $incomeSources = $(`.incomeSection .sources`);
		$incomeSources.append(`<div>
            <p class="removeButton">X</p>
                                    <input type='text' name='income' id='' placeholder='Source' />
									<input type='number' name='income' id='' placeholder='$0.00' />
								</div>`);
	};
	const removeIncomeInput = (e: any): void => {
		const $incomeSource = $(e).parent();
		$incomeSource.remove();
	};
	const addeExpenseInput = (): void => {
		const $incomeSources = $(`.incomeSection .sources`);
		$incomeSources.append(`<div>
            <p class="removeButton">X</p>
                                    <input type='text' name='category' id='' placeholder='Source' />
									<input type='number' name='category' id='' placeholder='$0.00' />
								</div>`);
	};
	const removeExpenseInput = (e: any): void => {
		const $incomeSource = $(e).parent();
		$incomeSource.remove();
	};

	const switchBudgetSection = (e: any): void => {
		if (e.target.id === "budgetButtonNext") {
			$(`.budgetSection`).toggleClass("hidden");
			$(`.incomeSection`).toggleClass("hidden");
			$(`.budgetSection`).toggleClass("active");
			$(`.incomeSection`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(1)`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(2)`).toggleClass("active");
		}
		if (e.target.id === "incomeButtonBack") {
			$(`.budgetSection`).toggleClass("hidden");
			$(`.incomeSection`).toggleClass("hidden");
			$(`.budgetSection`).toggleClass("active");
			$(`.incomeSection`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(1)`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(2)`).toggleClass("active");
		}
		if (e.target.id === "incomeButtonNext") {
			$(`.incomeSection`).toggleClass("hidden");
			$(`.expenseSection`).toggleClass("hidden");
			$(`.incomeSection`).toggleClass("active");
			$(`.expenseSection`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(2)`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(3)`).toggleClass("active");
		}
		if (e.target.id === "expenseButtonBack") {
			$(`.incomeSection`).toggleClass("hidden");
			$(`.expenseSection`).toggleClass("hidden");
			$(`.incomeSection`).toggleClass("active");
			$(`.expenseSection`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(2)`).toggleClass("active");
			$(`.progressTrackers :nth-of-type(3)`).toggleClass("active");
		}
	};

	return (
		<>
			<div id='NewBudgetForm-background' />

			<Formik
				initialValues={{
					name: "",
					description: "",
					incomes: [{ name: "", amount: 0 }],
					expenses: [{ name: "", subcategory: 0, amount: 0 }],
				}}
				validate={(values: FormValues) => {
					const errors: FormikErrors<FormValues> = {};
					if (!values.name) errors.name = "Name Required";
					if (!values.description) errors.description = "Brief Description Required";

					return errors;
				}}
				onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
					setTimeout(() => {
						createBudget({
							name: values.name,
							description: values.description,
							incomes: values.incomes,
							expenses: values.expenses,
						});
					}, 400);
				}}>
				{({ isSubmitting, values }) => (
					<Form className='NewBudgetForm'>
						<div className='budgetSection active'>
							<div className='NewBudgetFormInputDiv'>
								<label htmlFor='name'>Name:</label>
								<Field className='NewBudgetFormInput' type='name' name='name' />
							</div>
							<div className='NewBudgetFormInputDiv'>
								<label htmlFor='description'>Description:</label>
								<Field className='NewBudgetFormInput' type='description' name='description' />
							</div>
							<div className='errorMessageDiv'>
								<ErrorMessage className='ErrorMessage' name='name' component='div' />
								<ErrorMessage className='ErrorMessage' name='description' component='div' />
							</div>
							<div id='budgetButtons' className='viewButtons'>
								<button type='button' onClick={toggle}>
									Cancel
								</button>
								<button type='button' id='budgetButtonNext' onClick={switchBudgetSection}>
									Next
								</button>
							</div>
						</div>
						<div className='categories'>
							<FieldArray name='incomes'>
								{({ insert, remove, push }) => (
									<div className='incomeSection hidden'>
										<button className='plusButton' type='button' onClick={() => push({ name: "", amount: 0 })}>
											+
										</button>
										<div className='sources'>
											<div>
												<label>Name</label>
												<label>Amount</label>
											</div>

											{values.incomes.length > 0 &&
												values.incomes.map((income, index) => (
													<div>
														<button onClick={() => remove(index)}>x</button>
														<div className=''>
															<Field name={`income.${index}name`} />
															<Field name={`income.${index}.amount`} />
														</div>
													</div>
												))}
										</div>

										<div className='viewButtons'>
											<button type='button' id='incomeButtonBack' onClick={switchBudgetSection}>
												Back
											</button>
											<button type='button' id='incomeButtonNext' onClick={switchBudgetSection}>
												Next
											</button>
										</div>
									</div>
								)}
							</FieldArray>
							<FieldArray name='expenses'>
								{({ insert, remove, push }) => (
									<div>
										<div className='expenseSection hidden'>
											<div className='test'>
												<div>
													<label htmlFor='category-select'>Category</label>
													<label htmlFor=''>Subcategory</label>
												</div>
												<div className='inputs'>
													{values.expenses.length > 0 &&
														values.expenses.map((expense, index) => (
															<div>
																<div>
																	<select name='categories' id='category-select'>
																		{categories.map((category) => (
																			<option value={category.name}>{category.name}</option>
																		))}
																	</select>
																	<select>
																		<option>Create Subcategory</option>
																		{subcategories.map((subcategory) => (
																			<option value={subcategory.name}>{subcategory.name}</option>
																		))}
																	</select>
																	<Field type='text' name={`expense.${index}.name`} />
																</div>
																<label htmlFor=''>Amount</label>
																<Field type='number' name={`expense.${index}.amount`} />
															</div>
														))}
												</div>
											</div>
											<div className='plusButton' onClick={() => push({ name: "", subcategory: null, amount: 0 })}>
												<p>+</p>
											</div>
											<div className='viewButtons'>
												<button type='button' id='expenseButtonBack' onClick={switchBudgetSection}>
													Back
												</button>
												<button className='NewBudgetFormButton' type='submit' disabled={isSubmitting}>
													Create Budget
												</button>
											</div>
										</div>
										<div className='bottomSection '>
											<div className='progressTrackers'>
												<div className='progressTracker active'></div>
												<div className='progressTracker'></div>
												<div className='progressTracker'></div>
											</div>
										</div>
									</div>
								)}
							</FieldArray>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default NewBudgetForm;
