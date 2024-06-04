import axios from "axios";
import { TExpenseData, TUserCreateData, TUserData, TUserLoginData, TUserPasswordChange } from "../types/user";
import { TExpense, TQueryParams } from "../features/expenses/expenseSlice";

const instance = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
})

export const expensesAPI = {
    signUp(userData: TUserCreateData){
        return instance.post<any>("signup", userData);
    },
    login(userData: TUserLoginData){
        return instance.post<TUserLoginResponse>("login", userData);
    },
    logout(userData: {userId: number}){
        return instance.post<TUserLoginResponse>("logout", userData);
    },
    validateEmail(email: string){
        return instance.post<any>("validateEmail", {email});
    },
    updateUserData(userData: Omit<TUserData, "password">){
        return instance.post<any>("updateUserData", userData);
    },
    changePassword(userData: TUserPasswordChange){
        return instance.post<{ userId: number | null }>("changePassword", userData);
    },
    getUserData(userData: {userId: number | null }){
        return instance.post<TUserDataResponse>("getUserData  ", userData);
    },
    getUserExpenses(queryParams: TQueryParams, userId: number | null ){
        const {category, maxAmount, minAmount, page, title, type, date} = queryParams;
        return instance.get<{expenses: TExpense[]}>(`expenses/${userId}?page=${page}${title ? `&title=${title}`: ''}${category ? `&category=${category}`: ''}${type ? `&type=${type}`: ''}${maxAmount ? `&maxAmount=${maxAmount}` : ''}${minAmount ? `&minAmount=${minAmount}` : ''}${date ? `&date=${date}` : ''}`);
    },
    getUserPDFDataExpenses(queryParams: TQueryParams, userId: number | null ){
        const {category, maxAmount, minAmount, page, title, type, date} = queryParams;
        return instance.get<{expenses: TExpense[]}>(`pdfDataExpenses/${userId}?page=${page}${title ? `&title=${title}`: ''}${category ? `&category=${category}`: ''}${type ? `&type=${type}`: ''}${maxAmount ? `&maxAmount=${maxAmount}` : ''}${minAmount ? `&minAmount=${minAmount}` : ''}${date ? `&date=${date}` : ''}`);
    },
    getUserExpensePageAmount(queryParams: TQueryParams, userId: number | null ){
        const {category, maxAmount, minAmount, page, title, type, date} = queryParams;
        return instance.get<{pages: number}>(`expensePages/${userId}?page=${page}${title ? `&title=${title}`: ''}${category ? `&category=${category}`: ''}${type ? `&type=${type}`: ''}${maxAmount ? `&maxAmount=${maxAmount}` : ''}${minAmount ? `&minAmount=${minAmount}` : ''}${date ? `&date=${date}` : ''}`);
    },
    forgotPassword(email: string ){
        return instance.get<{password: string}>(`forgotPassword/${email}`);
    },
    addExpense(expenseData: TExpenseData){
        console.log('API: ', expenseData)
        return instance.post<{status: boolean}>("addExpense  ", expenseData);
    },
    editExpense(expenseData: TExpenseData & { expenseId: number }){
        return instance.post<{status: boolean}>("editExpense  ", expenseData);
    },
    deleteExpense(expenseId: number){
        return instance.post<{status: boolean}>("deleteExpense  ", {expenseId});
    }

}

type TExpenseParams = {
    page: number;
    type: string;
    minAmount: number;
    maxAmount: number;
    title: string;
    category: string;
}


type TUserDataResponse = {
    userId: number | null;
    error: string | null;
    name: string | null;
    email: string | null;
}

type TChangePasswordResponse = Omit<TUserDataResponse , "name" | "email" | "password">

type TUserLoginResponse = TUserDataResponse & {
    isLoggedIn: boolean;
}