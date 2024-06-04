import React from 'react'

//react-router-dom import
import { useNavigate } from "react-router-dom"

//style import
import s from './MobileViewTableCells.module.css'
import { TExpenseTable } from '../customTable'
import dayjs from 'dayjs'
import { Button } from '@mui/material';

export const MobileViewTableCells = ({ rows, onEditCallback, onDeleteCallback }: TExpenseTable) => {

  const navigate = useNavigate()

  const openCharacterInfoHandler = (id: number) => {
    //navigate(`${PATH.CHARACTER_INFO}/${id}`)
  }

  const body = rows.map(({ type, amount, category, title, expense_id, date }) => (
    <div key={expense_id} className={s.cellContainer}>
      <p><b>Title:</b> {title}</p>
      <p><b>Type:</b> {type}</p>
      <p><b>Category:</b> {category}</p>
      <p><b>Date:</b> {String(dayjs(date))}</p>
      <p><b>Amount:</b> {amount}</p>
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
      
    </div>
  ))

  return (
    <div className={s.mainContainer}>
      {body}
    </div>
  )
}