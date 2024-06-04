import { EUserData } from "../constants/constants";
import { useAppDispatch } from "./reduxHooks";

export const useGetUserData = () => {
    const dispatch = useAppDispatch();

    const userData = {
        name: localStorage.getItem(EUserData.NAME),
        email: localStorage.getItem(EUserData.EMAIL),
        isLoggedin: localStorage.getItem(EUserData.IS_LOGGED_IN),
    }
    return userData;
}