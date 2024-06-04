import { Button } from "@mui/material"
import { redirect, useNavigate } from "react-router-dom";
import styles from "./forgotPassword.module.css";
import { useFormik, Formik, Form, Field, ErrorMessage } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { login, resetPassword } from "../../../utils/validationSchema";
import TextField from '@mui/material/TextField';
import { expensesAPI } from "../../../api/expenses-api";
import { TUserState, forgotPassword, getUserLoggedIn } from "../../user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { useGetUserData } from "../../../hooks/useGetUserData";
import emailjs from '@emailjs/browser';

export const ResetPassword = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const tempPassword = useAppSelector<string>(state => state.user.tempPassword);

    const resetPasswordHandler = () => {
        //dispatch(forgotPassword())
    }

    useEffect(() => {
        sendEmail();
    }, [tempPassword])

    const sendEmail = () => {
    
        emailjs
          .send('service_ucpx3he', 'template_3rpy7ic', { password: tempPassword }, {
            publicKey: '9R3tOsHxjiLhhhWdu',
          })
          .then(
            () => {
              console.log('SUCCESS!');
            },
            (error) => {
              console.log('FAILED...', error.text);
            },
          );
      };

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: resetPassword,
        onSubmit: async (values, actions) => {
            setEmail(formik.values.email);
            dispatch(forgotPassword({email: formik.values.email}))
            alert('Email with your password has been sent please check your emails')
            navigate("/login");
            actions.resetForm();

        },
    });
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={styles.title}>Reset Password</h3>
                <TextField
                    className={styles.formItem}
                    type="email"
                    id="email"
                    label="Email"
                    variant="standard"
                    {...formik.getFieldProps("email")}
                />
                <div className={styles.error}>{formik.touched.email && formik.errors.email}</div>

                <Button style={{ display: "flex", margin: "0 auto", marginBottom: "15px" }} type="submit" variant="contained">Confirm</Button>
                <Button style={{ display: "flex", margin: "0 auto" }} type="button" onClick={() => navigate("/login")} variant="text">Back</Button>
            </form>
        </div>

    );
};