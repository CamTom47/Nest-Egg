import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikErrors } from "formik";

//Context
import UserContext from "../../../context/UserContext";

//Styling
import "./LoginForm.css";

interface FormValues {
	username: string;
	password: string;
}

const LoginForm = (): React.JSX.Element => {
	const { login } = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<Formik
			initialValues={{ username: "", password: "" }}
			validate={(values: FormValues) => {
				const errors: FormikErrors<FormValues> = {};
				if (!values.username) {
					errors.username = "Username Required";
				}
				if (!values.password) {
					errors.password = "Password Required";
				}
				return errors;
			}}
			onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
				setTimeout(() => {
					setSubmitting(false);
					login({
						username: values.username,
						password: values.password,
					});
					navigate("/dashboard");
				}, 2000);
			}}>
			{({ isSubmitting }) => (
				<Form className='LoginForm'>
					<div className='LoginFormInputDiv'>
						<label htmlFor='username'>Username:</label>
						<Field className='LoginFormInput' type='username' name='username' />
					</div>
					<div className='LoginFormErrorDiv'></div>
					<div className='LoginFormInputDiv'>
						<label htmlFor='password'>Password:</label>
						<Field className='LoginFormInput' type='password' name='password' />
					</div>

					<div className='LoginFormInputDiv'>
						<button className='LoginFormButton' type='submit' disabled={isSubmitting}>
							Login
						</button>
					</div>
					<div className='LoginFormErrorDiv'>
						<ErrorMessage className='ErrorMessage' name='username' component='div' />
						<ErrorMessage className='ErrorMessage' name='password' component='div' />
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
