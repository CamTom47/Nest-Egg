import React, {useContext} from 'react';
import { useNavigate} from 'react-router'
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikErrors,
} from 'formik';

//Context
import UserContext from '../../../context/UserContext';


//Styling
import './RegisterForm.css';

interface FormValues {
  username: string;
  password: string;
}

const RegisterForm = (): React.JSX.Element => {
    
    const {register} = useContext(UserContext)
    const navigate = useNavigate()

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.username) errors.username = 'Username Required';
        if (!values.password) errors.password = 'Password Required';
        if (values.password.length < 8) errors.password = 'Password must be at least 8 characters long';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S/.test(values.password)) errors.password = 'Password does not meet the minimum requirements';

        return errors;
      }}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        register({
            username: values.username,
            password: values.password
        })
        setTimeout(() => {
          navigate("/dashboard")
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="RegisterForm">
          <div className="RegisterFormInputDiv">
            <label htmlFor="username">Username:</label>
            <Field className="RegisterFormInput" type="username" name="username" />
          </div>
          <div className="RegisterFormErrorDiv"></div>
          <div className="RegisterFormInputDiv">
            <label htmlFor="password">Password:</label>
            <Field className="RegisterFormInput" type="password" name="password" />
          </div>
          <div>
            <p>- Password must be at least 8 characters long</p>
            <p>- Password must contain at least one uppercase letter</p>
            <p>- Password must contain at least one number </p>
            <p>- Password must contain at least one special character </p>
          </div>

          <div className="RegisterFormInputDiv">
            <button
              className="RegisterFormButton"
              type="submit"
              disabled={isSubmitting}
            >
              Signup
            </button>
          </div>
          <div className="RegisterFormErrorDiv">
            <ErrorMessage
              className="ErrorMessage"
              name="username"
              component="div"
            />
            <ErrorMessage
              className="ErrorMessage"
              name="password"
              component="div"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;