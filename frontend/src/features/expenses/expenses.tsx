import { Button } from "@mui/material"
import styles from "./expenses.module.css"
import { useEffect, useState, useMemo } from "react"
import { ExpenseModal } from "./expenseModal/expenseModal"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { TUserState } from "../user/userSlice"
import { EPath, EUserData, expenseTableHead } from "../../constants/constants"
import { ExpenseTable } from "../../components/customTable/customTable"
import { TExpense, TQueryParams, deleteExpenseTC, getPDFData, setOpenModalAC, updateQueryParams } from "./expenseSlice"
import { CustomSearch } from "../../components/customSearch/customSearch"
import { CustomPagination } from "../../components/customPagination/CustomPagination"
import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'
import dayjs from "dayjs"

export const Expenses = () => {
    const user = useAppSelector<TUserState>(state => state.user);
    const queryParams = useAppSelector<TQueryParams>(state => state.expenses.queryParams);
    const rows = useAppSelector<TExpense[]>(state => state.expenses.expenseData);
    const pdfData = useAppSelector<TExpense[]>(state => state.expenses.expensePDFData);
    const userId = +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [expenseModal, setExpenseModal] = useState(false)
    const [expenseId, setExpenseId] = useState<null | number>(null)

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate(EPath.LOGIN)
        } else {
            if (userId) {
                dispatch(updateQueryParams(queryParams , userId));
                dispatch(getPDFData(queryParams, userId));
            }
        }
    }, [expenseModal, queryParams]);


    const editExpenseHandler = (id: number) => {
        dispatch(setOpenModalAC({ openModal: true }))
        setExpenseModal(true);
        setExpenseId(id)
    }
    const deleteExpenseHandler = (id: number) => {
        dispatch(deleteExpenseTC(id));
        if (userId) {
            dispatch(updateQueryParams(queryParams, userId));
        }
    }
    const onCloseModalHandler = () => {
        dispatch(setOpenModalAC({ openModal: false }))
        setExpenseModal(false);
        setExpenseId(null)
    }
    const modalExpenseData = rows.filter(({ expense_id }) => expenseId === expense_id)

    const pdfDataRows = useMemo(() => pdfData.map(({title, type, category, date, amount }) => [title, type, category, date, amount]), [pdfData]);
    
    const downloadPdfExspense = () => {

        const doc = new jsPDF('p', 'pt', 'a4')
        doc.text('Expense report', 250, 60);
        doc.text(`Total: ${pdfData.reduce((prev, curr) => curr.type === 'income' ? prev + curr.amount: prev - curr.amount, 0)}`, 30, 90);
        autoTable(doc, {
            head: [expenseTableHead],
            body: pdfDataRows as RowInput[],
            margin: { top: 110 },
        })
        

        doc.save('table.pdf')
    }

    return (

        <div style={expenseModal ? { backgroundColor: "rgba(0, 0, 0, 0.5)" } : {}} className={styles.container} >
            <h3 style={{ width: "100%", textAlign: "center" }}>Expenses</h3>
            <div className={styles.btnContainer}>
                <Button disabled={expenseModal} style={{marginRight: '8px'}} className={styles.btn} onClick={() => {
                    dispatch(setOpenModalAC({ openModal: true }))
                    setExpenseModal(true)
                }} type="button" variant="contained">Add Expense</Button>
                <Button disabled={expenseModal} className={styles.btn} onClick={downloadPdfExspense} type="button" variant="contained">Export to pdf</Button>
           
            </div>
            <CustomSearch />
            {expenseModal ? null : <ExpenseTable rows={rows} onDeleteCallback={deleteExpenseHandler} onEditCallback={editExpenseHandler} />}
            <CustomPagination />
            {expenseModal ? <ExpenseModal
                expenseId={expenseId}
                expAmount={modalExpenseData.length ? String(modalExpenseData[0].amount) : ''}
                expTitle={modalExpenseData.length ? modalExpenseData[0].title : ''}
                expType={modalExpenseData.length ? modalExpenseData[0].type : ''}
                expCategory={modalExpenseData.length ? modalExpenseData[0].category : ''}
                expDate={modalExpenseData.length && modalExpenseData[0].date ? new Date(modalExpenseData[0].date) : null}
                closeModal={onCloseModalHandler}
            /> : null}

        </div>

    )
}