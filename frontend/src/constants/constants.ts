export const expenseTableHead = [ 'Title', 'Type', 'Category', 'Date', 'Amount']


export enum EPath {
    HOME = "/",
    SIGNUP = "/signup",
    LOGIN = "/login",
    USER = "/user",
    CHANGE_PASSWORD = "/changePassword",
    RESET_PASSWORD = "/resetPassword",
    EXPENSES = "/expenses",
}

export enum EStatus {
    IDLE = "idle",
    LOADING = "loading",
    FAILED = "failed",
    SUCCESS = "success",
}

export enum EUserData {
    USER_ID = "userId",
    EMAIL = "email",
    NAME = "name",
    IS_LOGGED_IN = "isLoggedIn",
    PASSWORD = "password",
}