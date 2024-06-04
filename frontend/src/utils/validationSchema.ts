import * as yup from 'yup'

const email = yup
    .string()
    .email('Enter a valid email')
    .max(50, 'Enter a valid email')
    .required('Email is required')
const password = yup
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(30, 'Password is too long')
    .required('Enter your password')
const confirmPassword = yup
    .string()
    .oneOf([yup.ref('password')], 'Password does not match')
    .required('Confirm your password')
const name = yup
    .string()
    .max(50, 'First Name should be less then 50 characters')
    .required('First Name is required')
const question = yup
    .string()
    .max(100, 'Question should be less then 100 characters')
    .required('Question is required')
const answer = yup
    .string()
    .max(100, 'Answer should be less then 100 characters')
    .required('Answer is required')
const packName = yup
    .string()
    .max(100, 'Name should be less then 100 characters')
    .required('Pack name is required')

const expenseType = yup.string().required('Expense type is required')
const expenseCategory = yup.string().required('Expense Category type is required')
const expenseAmount = yup.string().required('Expense Amount is required')
const expenseTitle = yup.string().max(20, 'Expense title is too long').required('Expense title is required')

export const signup = yup.object({ email, password, name })
export const login = yup.object({ email, password })
export const resetPassword = yup.object({ email })
export const user = yup.object({ email, name })
export const changePassword = yup.object(
    {
        current_password: password,
        new_password: password,
        confirm_password: password
    })
export const addExpense = yup.object(
    {
        expenseType,
        expenseCategory,
        expenseAmount,
        expenseTitle
    })

export const registration = yup.object({ email, password, confirmPassword })

export const newPassword = yup.object({ password })

export const forgotPassword = yup.object({ email })

export const newCardText = yup.object({ question, answer })

export const newPackText = yup.object({ name: packName })