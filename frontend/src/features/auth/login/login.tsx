import { Button } from "@mui/material"
import { redirect, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { useFormik, Formik, Form, Field, ErrorMessage } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { login } from "../../../utils/validationSchema";
import TextField from '@mui/material/TextField';
import { expensesAPI } from "../../../api/expenses-api";
import { TUserState, forgotPassword, getUserLoggedIn } from "../../user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { useGetUserData } from "../../../hooks/useGetUserData";

export const Login = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isUserLoggedIn = useAppSelector<boolean>(state => state.user.isLoggedIn);

    useEffect(() => {
        if (isUserLoggedIn) {
            navigate("/user");
        }
    }, [isUserLoggedIn])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: login,
        onSubmit: async (values, actions) => {
            dispatch(getUserLoggedIn(values))
            actions.resetForm();
        },
    });
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={styles.title}>Login</h3>
                <TextField
                    className={styles.formItem}
                    type="email"
                    id="email"
                    label="Email"
                    variant="standard"
                    {...formik.getFieldProps("email")}
                />
                <div className={styles.error}>{formik.touched.email && formik.errors.email}</div>


                <TextField
                    className={styles.formItem}
                    type="password"
                    id="password"
                    label="Password"
                    variant="standard"
                    {...formik.getFieldProps("password")}
                />
                <p className={styles.error}>{formik.touched.email && formik.errors.password}</p>


                <Button style={{ display: "flex", margin: "0 auto", marginBottom: "15px" }} type="submit" variant="contained">Login</Button>
                <Button style={{ display: "flex", margin: "0 auto", marginBottom: "15px" }} type="submit" variant="text" onClick={() => navigate("/resetPassword")} >Forgot Password</Button>
                <Button style={{ display: "flex", margin: "0 auto" }} type="button" onClick={() => navigate("/signup")} variant="text">Create Account</Button>
            </form>
        </div>

    );
};