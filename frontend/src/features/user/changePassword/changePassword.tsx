
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { changePassword, login } from '../../../utils/validationSchema';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import styles from "./changePassword.module.css"
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { changePasswordTC } from '../userSlice';
import { EPath, EUserData } from '../../../constants/constants';


export const ChangePassword = () => {


    const isUserLoggedIn = useAppSelector<boolean>(state => state.user.isLoggedIn);

    const userId = +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState("");

    const formik = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
        validationSchema: changePassword,
        onSubmit: async (values, actions) => {
            const { current_password, new_password } = values;
            dispatch(changePasswordTC({ currentPassword: current_password, newPassword: new_password, userId: userId as number }))
            actions.resetForm();
            navigate(EPath.USER);
        },
    });

    useEffect(() => {
        if(!isUserLoggedIn){
            navigate(EPath.LOGIN);
        }
        
        if (formik.values.new_password !== formik.values.confirm_password) {
            setError("passwords does not match");
            setDisabled(true);
        } else {
            setError("");
            setDisabled(false);
        }
    }, [formik.values.new_password, formik.values.confirm_password])

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={styles.title}>Change Password</h3>
                <div className={styles.formItem}>
                    <TextField
                        style={{ width: "100%" }}
                        type="password"
                        id="current_password"
                        label="Current Password"
                        variant="standard"
                        {...formik.getFieldProps("current_password")}
                    />
                    <p className={styles.error}>{formik.touched.current_password && formik.errors.current_password}</p>
                </div>

                <div className={styles.formItem}>
                    <TextField
                        style={{ width: "100%" }}
                        type="text"
                        id="new_password"
                        label="New Password"
                        variant="standard"
                        {...formik.getFieldProps("new_password")}
                    />
                    <p className={styles.error}>{formik.touched.new_password && formik.errors.new_password}</p>

                </div>
                <div className={styles.formItem}>
                    <TextField
                        style={{ width: "100%" }}
                        type="text"
                        id="confirm_password"
                        label="Confirm Password"
                        variant="standard"
                        {...formik.getFieldProps("confirm_password")}
                    />
                    <p className={styles.error}>{error ? error : formik.touched.confirm_password && formik.errors.confirm_password}</p>
                </div>

                <div className={styles.btnContainer}>
                    <Button disabled={disabled} className={styles.btn} type="submit" variant="contained">Change Password</Button>

                </div>
                <div className={styles.btnContainer}>
                    <Button className={styles.btn} type="button" onClick={() => navigate("/user")} variant="text">Back</Button>

                </div>
            </form>
        </div>

    );
};