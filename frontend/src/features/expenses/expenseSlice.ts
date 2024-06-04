//redux/toolkit import
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { EStatus, EUserData } from "../../constants/constants"
import { TExpenseData, TUserData, TUserLoginData, TUserPasswordChange } from "../../types/user"
import { expensesAPI } from "../../api/expenses-api"
import { Dayjs } from "dayjs"

//constants import

const initialState: TExpenseState = {
    status: EStatus.IDLE,
    expenseData: [],
    expensePDFData: [],
    openModal: false,
    queryParams: {
        page: 1,
        type: '',
        minAmount: null,
        maxAmount: null,
        title: '',
        category: '',
        date: null
    },
    pages: null,
}


const slice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setExpenseStatusAC: (state, action: PayloadAction<{ status: AppStatusType }>) => {
            state.status = action.payload.status;
        },
        setExpensesAC: (state, action: PayloadAction<{ expenses: TExpense[] }>) => {
            state.expenseData = action.payload.expenses;
            state.status = EStatus.SUCCESS;
        },
        setExpensePDFDataAC: (state, action: PayloadAction<{ expensePdf: TExpense[] }>) => {
            state.expensePDFData = action.payload.expensePdf;
            state.status = EStatus.SUCCESS;
        },
        setQueryParamsAC: (state, action: PayloadAction<{ queryParams: TQueryParams }>) => {
            state.queryParams = action.payload.queryParams
        },
        setPagesAC: (state, action: PayloadAction<{ pages: number }>) => {
            state.pages = action.payload.pages
        },
        setOpenModalAC: (state, action: PayloadAction<{ openModal: boolean }>) => {
            state.openModal = action.payload.openModal
        },
    }
})

export const expenseSlice = slice.reducer

export const { setExpenseStatusAC, setExpensesAC, setQueryParamsAC, setPagesAC, setOpenModalAC, setExpensePDFDataAC } = slice.actions

export type TExpense = {
    expense_id: number;
    title: string;
    category: string;
    type: string;
    amount: number;
    date: string | Date | null
}

export type TQueryParams = {
    page: number;
    type: string;
    minAmount: number | null;
    maxAmount: number | null;
    title: string;
    category: string;
    date: Date | Dayjs | null;
};

export type TExpenseState = {
    openModal: boolean;
    status: AppStatusType;
    expenseData: Array<TExpense>;
    expensePDFData: Array<TExpense>;
    queryParams: TQueryParams;
    pages: number | null;
}

export type AppStatusType = 'idle' | 'loading' | 'failed' | "success"


export const addExpenseTC = (expenseData: TExpenseData & { userId: number }) => async (dispatch: Dispatch) => {
    dispatch(setExpenseStatusAC({ status: EStatus.LOADING }));
    try {
        console.log('expenseData: ', expenseData)
        const response = await expensesAPI.addExpense(expenseData);
        if (response.data.status) {
            dispatch(setExpenseStatusAC({ status: EStatus.SUCCESS }));
        } else {
            dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
        }

    } catch (error) {
        dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
    }

}

export const editExpenseTC = (
    expenseData: TExpenseData & { userId: number, expenseId: number }) =>
    async (dispatch: Dispatch) => {
        dispatch(setExpenseStatusAC({ status: EStatus.LOADING }));
        try {
            const response = await expensesAPI.editExpense(expenseData);
            if (response.data.status) {
                dispatch(setExpenseStatusAC({ status: EStatus.SUCCESS }));
            } else {
                dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
            }

        } catch (error) {
            dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
        }

    }

export const deleteExpenseTC = (expenseId: number) => async (dispatch: Dispatch) => {
    dispatch(setExpenseStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.deleteExpense(expenseId);
        if (response.data.status) {
            dispatch(setExpenseStatusAC({ status: EStatus.SUCCESS }));
        } else {
            dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
        }

    } catch (error) {
        dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
    }

}

export const updateQueryParams = (queryParams: TQueryParams, userId: number) => async (dispatch: Dispatch) => {
    dispatch(setQueryParamsAC({ queryParams }));
    dispatch(setExpenseStatusAC({ status: EStatus.LOADING }));
    try {
        console.log('queryParams: ', queryParams)
        const pagesResponse = await expensesAPI.getUserExpensePageAmount(queryParams, userId);
        dispatch(setPagesAC({ pages: pagesResponse.data.pages}))

        const response = await expensesAPI.getUserExpenses(queryParams, userId);
        dispatch(setExpensesAC({ expenses: response.data.expenses.length ? response.data.expenses : []}))
        console.log('response: ', response);
    } catch (error) {
        dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
    }

}

export const getPDFData = (queryParams: TQueryParams, userId: number) => async (dispatch: Dispatch) => {
    dispatch(setQueryParamsAC({ queryParams }));
    dispatch(setExpenseStatusAC({ status: EStatus.LOADING }));
    try {
        const response = await expensesAPI.getUserPDFDataExpenses(queryParams, userId);
        dispatch(setExpensePDFDataAC({ expensePdf: response.data.expenses.length ? response.data.expenses : []}))


    } catch (error) {
        dispatch(setExpenseStatusAC({ status: EStatus.FAILED }));
    }

}