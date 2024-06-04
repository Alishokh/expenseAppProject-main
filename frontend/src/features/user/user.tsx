import { ChangeEvent, useEffect, useState } from "react";
import { TUserState, updateUserData } from "./userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate } from 'react-router-dom';
import { EPath, EUserData } from "../../constants/constants";
import styles from "./user.module.css"
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { EditableRow } from "../../components/editableRow/editableRow";
import { UserDataRow } from "../../components/userDataRow/userDataRow";
import { useDispatch } from "react-redux";
import { TUserData } from "../../types/user";

export const User = () => {
    const user = useAppSelector<TUserState>(state => state.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate(EPath.LOGIN)
        }
    }, []);

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(JSON.parse(localStorage.getItem(EUserData.EMAIL) as string));
    const [edit, setEdit] = useState(false);
    const [nameError, setNameError] = useState("");


    useEffect(() => {
        if (!name) {
            setNameError("Name is required");
        }
        else {
            setNameError("");
        }
    }, [name])

    const editNnameHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.currentTarget.value)
    }

    const userData = {
        name,
        email,
        userId: +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string),
    }

    const saveUserDataHandler = () => {
        dispatch(updateUserData(userData as Omit<TUserData, "password">));
        setEdit(false);
    }
    console.log(email)

    return (
        <div className={styles.container}>
            <div className={styles.userData}>
                <h3 style={{ textAlign: "center" }}>Hello {user.name}</h3>
                <div>
                    {edit ?
                        <EditableRow
                            label={"Name"}
                            value={name ? name : ""}
                            onChangeCallback={setName} /> :
                        <UserDataRow
                            title={"Name"}
                            value={name ? name : ""} />
                    }
                    <div className={styles.error}>{nameError}</div>

                </div>
                <div>
                    {edit ?
                        <EditableRow
                            label={"Email"}
                            value={email ? email : ""}
                            onChangeCallback={setEmail}
                            disabled={true} /> :
                        <UserDataRow
                            title={"Email"}
                            value={email ? email : ""} />
                    }
                </div>
                <div className={styles.btn}>
                    {
                        edit ?
                            <Button
                                variant="contained"
                                size="small"
                                style={{ fontSize: "10px", height: "25px" }}
                                onClick={saveUserDataHandler}
                                disabled={!!nameError}
                            >
                                Save
                            </Button> : <Button
                                variant="contained"
                                size="small"
                                style={{ fontSize: "10px", height: "25px" }}
                                onClick={() => setEdit(true)}>
                                Edit
                            </Button>
                    }
                </div >
                <div className={styles.btn}>
                    {
                        edit ?
                            <Button
                                variant="text"
                                size="small"
                                style={{ fontSize: "10px", height: "25px", marginTop: "10px" }}
                                onClick={() => setEdit(false)}>
                                Back
                            </Button> : <Button
                                variant="text"
                                size="small"
                                style={{ fontSize: "10px", height: "25px", marginTop: "10px" }}
                                onClick={() => navigate(EPath.CHANGE_PASSWORD)}>
                                Change Password
                            </Button>
                    }
                </div>

            </div>
        </div>);
}