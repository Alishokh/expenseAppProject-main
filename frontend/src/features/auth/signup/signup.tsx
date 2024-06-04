import { Button } from "@mui/material"
import styles from "./signup.module.css";
import { useFormik, Formik, Form, Field, ErrorMessage } from "formik";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { signup } from "../../../utils/validationSchema";
import TextField from '@mui/material/TextField';
import { expensesAPI } from "../../../api/expenses-api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Login } from './../login/login';
import { EPath } from "../../../constants/constants";
const initialValues = {
    name: '',
    email: '',
    password: '',
}

export const SignUp = () => {

    let timer: number
    const error = "email already in use";
    const [emailIsUsed, setEmailIsUsed] = useState(false);
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues,
        validationSchema: signup,
        onSubmit: async (values, actions) => {
           
            const res = await expensesAPI.signUp(values);
            actions.resetForm();
            navigate(EPath.LOGIN);
        },
    });

    const onEmailChange2 = async (email: string) => {
        const res = await expensesAPI.validateEmail(email);
        if(res.data.errorMessage){
            setEmailIsUsed(true);
            formik.setErrors({...formik.errors, email: res.data.errorMessage});
        }else{
            setEmailIsUsed(false);
        }
    }

    useEffect( () => {
        timer = window.setTimeout(() => {
            onEmailChange2(formik.values.email);
          }, 800)
      
          return () => clearTimeout(timer)
        
    }, [formik.values.email])

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={styles.title}>Sign Up</h3>
                <TextField
                    className={styles.formItem}
                    id="name"
                    label="First Name"
                    variant="standard"
                    {...formik.getFieldProps("name")}
                    
                />
                <div className={styles.error}>{formik.touched.name && formik.errors.name}</div>

                <TextField
                    className={styles.formItem}
                    type="email"
                    id="email"
                    label="Email"
                    variant="standard"
                    {...formik.getFieldProps("email")}
                />
                <div className={styles.error}>{emailIsUsed ? error : formik.touched.email && formik.errors.email }</div>

                <TextField
                    className={styles.formItem}
                    type="password"
                    id="password"
                    label="Password"
                    variant="standard"
                    {...formik.getFieldProps("password")}
                />
                <p className={styles.error}>{formik.touched.password && formik.errors.password}</p>

                <Button style={{ display: "flex", margin: "0 auto" }} disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || emailIsUsed} type="submit" variant="contained">Submit</Button>
                <p className={styles.title}>Already have an account?</p>
                <Link style={{all: "unset"}} to={EPath.LOGIN}><Button style={{ display: "flex", margin: "0 auto" }} type="button" variant="text">Login</Button></Link>
            </form>
        </div>

    );
};