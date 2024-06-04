import { EPath } from "../../constants/constants";

export enum EHeaderTitle {
    PROFILE = 'profile',
    LOGOUT = 'logout',
    EXPENSES = 'expenses',
}

export const headerItems = [
    {
        id: EHeaderTitle.PROFILE,
        title: EHeaderTitle.PROFILE,
        path: EPath.USER,
    },
    {
        id: EHeaderTitle.EXPENSES,
        title: EHeaderTitle.EXPENSES,
        path: EPath.EXPENSES,
    },
]