//redux/toolkit import
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { EStatus, EUserData } from "../../constants/constants"
import { TUserData, TUserLoginData, TUserPasswordChange } from "../../types/user"
import { expensesAPI } from "../../api/expenses-api"

//constants import

const initialState: TUserState = {
    userId: +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string),
    name: JSON.parse(localStorage.getItem(EUserData.NAME) as string),
    email: JSON.parse(localStorage.getItem(EUserData.EMAIL) as string),
    error: null,
    status: EStatus.IDLE,
    isLoggedIn: !!localStorage.getItem(EUserData.IS_LOGGED_IN),
    tempPassword: '',
}


const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserStatusAC: (state, action: PayloadAction<{ status: AppStatusType }>) => {
            state.status = action.payload.status
        },
        setUserErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setUserDataAC: (state, action: PayloadAction<{ name: string | null }>) => {
            state.name = action.payload.name;
            state.error = null;
            state.status = EStatus.SUCCESS;
            state.isLoggedIn = true;
        },
        resetUserDataAC: (state) => {
            state.name = null;
            state.error = null;
            state.status = EStatus.IDLE;
            state.isLoggedIn = false;
        },
        setTempPasswordAC: (state, action: PayloadAction<{ password: string }>) => {
            state.tempPassword = action.payload.password;
            state.status = EStatus.SUCCESS;
        }
    }
})


export const userSlice = slice.reducer

export const { setUserStatusAC, setUserErrorAC, setUserDataAC, resetUserDataAC, setTempPasswordAC } = slice.actions

export type TUserState = {
    userId: number | null;
    name: string | null;
    email: string | null;
    error: string | null;
    status: AppStatusType;
    isLoggedIn: boolean;
    tempPassword: string;
}

export type AppStatusType = 'idle' | 'loading' | 'failed' | "success"

//userSlice thunks
export const getUserLoggedIn = (userLoginData: TUserLoginData) => async (dispatch: Dispatch) => {
    dispatch(setUserStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.login(userLoginData);
        const { error, name, email, isLoggedIn, userId } = response.data
        if (!error && isLoggedIn) {
            dispatch(setUserDataAC({ name }));
            localStorage.setItem(EUserData.NAME, JSON.stringify(name));
            localStorage.setItem(EUserData.EMAIL, JSON.stringify(email));
            localStorage.setItem(EUserData.IS_LOGGED_IN, "true");
            localStorage.setItem(EUserData.USER_ID, String(userId));
        } else {
            dispatch(setUserErrorAC({ error }))
        }
    } catch (error: any) {
        dispatch(setUserErrorAC({ error }))
    }
}
export const getUserLoggedOut = (userLoginData: {userId: number}) => async (dispatch: Dispatch) => {
    dispatch(setUserStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.logout(userLoginData);
        const { error, userId } = response.data
        if (!error) {
            dispatch(resetUserDataAC());
            localStorage.removeItem(EUserData.NAME);
            localStorage.removeItem(EUserData.EMAIL);
            localStorage.removeItem(EUserData.IS_LOGGED_IN);
            localStorage.removeItem(EUserData.USER_ID);
        } else {
            dispatch(setUserErrorAC({ error }))
        }
    } catch (error: any) {
        dispatch(setUserErrorAC({ error }))
    }
}
export const updateUserData = (userLoginData: Omit<TUserData, "password">) => async (dispatch: Dispatch) => {
    dispatch(setUserStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.updateUserData(userLoginData);
        const userData = await expensesAPI.getUserData({userId: userLoginData.userId})
        dispatch(setUserDataAC({ name: userData.data.name }));
        localStorage.setItem(EUserData.NAME, JSON.stringify(userData.data.name));
    } catch (error: any) {
        dispatch(setUserErrorAC({ error }))
    }
}
export const changePasswordTC = (userData: TUserPasswordChange) => async (dispatch: Dispatch) => {
    dispatch(setUserStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.changePassword(userData);
        const userDataResponse = await expensesAPI.getUserData({userId: userData.userId})
        dispatch(setUserDataAC({ name: userDataResponse.data.name }));
        localStorage.setItem(EUserData.NAME, JSON.stringify(userDataResponse.data.name));
    } catch (error: any) {
        dispatch(setUserErrorAC({ error }))
    }
}
export const forgotPassword = ({email}:{email: string}) => async (dispatch: Dispatch) => {
    dispatch(setUserStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.forgotPassword(email);
        dispatch(setTempPasswordAC({ password: response.data.password }));
    } catch (error: any) {
        dispatch(setUserErrorAC({ error }))
    }
}