import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, Button } from '@mui/material'
import { useNavigate } from "react-router-dom"
import s from './customTable.module.css'
import { useAppSelector } from '../../hooks/reduxHooks'
import { EStatus, expenseTableHead } from '../../constants/constants'
import { TExpense } from '../../features/expenses/expenseSlice'
import dayjs from 'dayjs'

export type TExpenseTable = {
    rows: TExpense[];
    onEditCallback: (id: number) => void;
    onDeleteCallback: (id: number) => void;
}


export const ExpenseTable = ({ rows, onEditCallback, onDeleteCallback }: TExpenseTable) => {

    const rows2 = useAppSelector<TExpense[]>(state => state.expenses.expenseData);

    let appStatus = EStatus.SUCCESS;
    const navigate = useNavigate()

    const [mobileView, setMobileView] = useState(false)

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setMobileView(true)
            appStatus = EStatus.LOADING;
        } else {
            setMobileView(false)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', showButton);
        showButton();
    }, []);

    const head = expenseTableHead.map((item, i) => <TableCell key={i} align={i === 0 ? "left" : 'right'}><span
        className={s.table_head_item}>{item}</span></TableCell>)

    const body = rows.map(({ type, amount, category, title, expense_id, date }) => (
        <TableRow
            key={expense_id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="right">{title}</TableCell>
            <TableCell component="th" scope="row">{type}</TableCell>
            <TableCell align="right">{category}</TableCell>
            <TableCell align="right">{date ? String(dayjs(date).format('YYYY-MM-DD')) : 'null'}</TableCell>
            <TableCell align="right">
                {amount}
                <Button
                    size='small'
                    style={{ fontSize: '0.5rem', marginLeft: '5px' }}
                    onClick={() => onEditCallback(expense_id)}
                    type="button"
                    variant="contained">edit
                </Button>
                <Button
                    size='small'
                    style={{ fontSize: '0.5rem', marginLeft: '5px' }}
                    onClick={() => onDeleteCallback(expense_id)}
                    type="button"
                    color='error'
                    variant="contained">delete
                </Button>
            </TableCell>
        </TableRow>
    ))

    return (
        <div className={s.table_container}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow className={s.table_head}>
                            {
                                head
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {body}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )
}