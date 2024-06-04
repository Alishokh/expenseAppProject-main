import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import styles from "./expenseModal.module.css"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { addExpense, changePassword } from "../../../utils/validationSchema";
import { EExpenseType, ExpenseChargeCategory, ExpenseIncomeCategory, ExpenseTypeData } from "./config";
import { addExpenseTC, editExpenseTC } from "../expenseSlice";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { EUserData } from "../../../constants/constants";

type TExpenseModal = {
    closeModal: () => void;
    expenseId?: number | null;
    expType?: string;
    expCategory?: string;
    expAmount?: string;
    expTitle?: string;
    expDate?: Dayjs | Date | null;
}

export const ExpenseModal = ({
    closeModal,
    expenseId = null,
    expType = '',
    expCategory = '',
    expAmount = '',
    expTitle = '',
    expDate = null,
}: TExpenseModal) => {
    const dispatch = useAppDispatch();
    const userId = +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string);
    const [date, setDate] = useState<Dayjs | Date | null>(expDate)

    console.log('Date: ', date)

    const [mobileView, setMobileView] = useState(false)

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setMobileView(true)
        } else {
            setMobileView(false)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', showButton);
        showButton();
    }, []);


    const formik = useFormik({
        initialValues: {
            expenseType: expType,
            expenseCategory: expCategory,
            expenseAmount: expAmount,
            expenseTitle: expTitle,
            expenseDate: expDate,
        },
        validationSchema: addExpense,
        onSubmit: async (values, actions) => {
            const { expenseType, expenseCategory, expenseAmount, expenseTitle } = values;

            if (expenseId) {
                dispatch(editExpenseTC({
                    expenseId,
                    title: expenseTitle,
                    type: expenseType,
                    category: expenseCategory,
                    amount: +expenseAmount,
                    userId: userId as number,
                    date,
                }))
            } else {
                dispatch(addExpenseTC({
                    title: expenseTitle,
                    type: expenseType,
                    category: expenseCategory,
                    amount: +expenseAmount,
                    userId: userId as number,
                    date,
                }))
            }

            actions.resetForm();
            closeModal();
        },
    });

    const [disabled, setDisabled] = useState(true);

    const { expenseAmount, expenseCategory, expenseTitle, expenseType } = formik.errors;
    const {
        expenseAmount: expenseAmountValue,
        expenseCategory: expenseCategoryValue,
        expenseTitle: expenseTitleValue,
        expenseType: expenseTypeValue
    } = formik.values;


    useEffect(() => {
        
        if (expenseAmountValue && expenseCategoryValue && expenseTitleValue && expenseTypeValue) {
            if (!expenseAmount && !expenseCategory && !expenseTitle && !expenseType) {
                
                    setDisabled(false);
                
            }
            else {
                setDisabled(true);
            }
        } else {
            setDisabled(true);
        }

        if(!date){
            setDisabled(true);
        }
    }, [expenseAmountValue, expenseCategoryValue, expenseTitleValue, expenseTypeValue, date, expenseAmount, expenseCategory, expenseTitle, expenseType])

    return (
        <div className={mobileView ? styles.mobileContainer : styles.container}>
            <form className={mobileView ? styles.mobileForm : styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={styles.title}>Add Expense</h3>

                <div className={styles.formItem}>
                    <TextField
                        style={{ width: "100%" }}
                        type="text"
                        id="expenseTitle"
                        label="Title"
                        variant="standard"
                        {...formik.getFieldProps("expenseTitle")}
                    />
                    <p className={styles.error}>{formik.touched.expenseTitle && formik.errors.expenseTitle}</p>
                </div>

                <div className={styles.formItem}>
                    <FormControl variant="standard" sx={{ m: 0, minWidth: 280 }} size="small">
                        <InputLabel id="demo-simple-select-helper-label">Expense Type</InputLabel>
                        <Select
                            style={mobileView ? { width: '75%' } : {}}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Type"
                            {...formik.getFieldProps("expenseType")}
                        >
                            {
                                ExpenseTypeData.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)
                            }
                        </Select>
                        <FormHelperText style={{ color: "red" }}>{formik.touched.expenseType && formik.errors.expenseType}</FormHelperText>
                    </FormControl>
                </div>

                <div className={styles.formItem}>
                    <FormControl variant="standard" sx={{ m: 0, minWidth: 280 }} size="small" disabled={formik.values.expenseType ? false : true}>
                        <InputLabel id="demo-simple-select-helper-label">Expense Category</InputLabel>
                        <Select style={mobileView ? { width: '75%' } : {}}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Type"
                            {...formik.getFieldProps("expenseCategory")}
                        >
                            {
                                formik.values.expenseType === EExpenseType.CHARGE ?
                                    ExpenseChargeCategory.map((val, i, arr) => <MenuItem key={i} value={val}>{val}</MenuItem>) :
                                    ExpenseIncomeCategory.map((val, i, arr) => <MenuItem key={i} value={val}>{val}</MenuItem>)
                            }
                        </Select>
                        <FormHelperText style={{ color: "red" }}>{formik.touched.expenseCategory && formik.errors.expenseCategory}</FormHelperText>
                    </FormControl>
                </div>

                <div className={styles.formItem}>
                    <TextField
                        style={{ width: "100%" }}
                        type="text"
                        id="expenseAmount"
                        label="Amount"
                        variant="standard"
                        {...formik.getFieldProps("expenseAmount")}
                    />
                    <p className={styles.error}>{formik.touched.expenseAmount && formik.errors.expenseAmount}</p>
                </div>

                <div className={styles.formItem}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Date"
                                value={dayjs(date)}
                                onChange={(value: any) => {
                                    const date = new Date(value?.$d.toISOString())
                                    //date.setDate(date.getDate() + 1)
                                    console.log('Datttte: ', value?.$d.toISOString(), value?.$d, date)
                                    setDate(date)
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>

                <div className={styles.btnContainer}>
                    <Button disabled={disabled} className={styles.btn} type="submit" variant="contained">Confirm</Button>

                </div>
                <div className={styles.btnContainer}>
                    <Button className={styles.btn} type="button" onClick={closeModal} variant="text">Back</Button>

                </div>
            </form>
        </div>
    )
}