import React, {ChangeEvent} from 'react'

//mui import
import { Pagination } from '@mui/material'



//react-router-dom import
import {useSearchParams} from "react-router-dom"

//style import
import s from './CustomPagination.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { updateQueryParams } from '../../features/expenses/expenseSlice'
import { EUserData } from '../../constants/constants'

export const CustomPagination = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const totalPageCount = useAppSelector(state => state.expenses.pages)
  const queryParams = useAppSelector(state => state.expenses.queryParams)
  const userId = +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string);
  const queryPage = searchParams.get('page')
  const currentPage = queryPage ? queryPage : '1'

  const dispatch = useAppDispatch()


  const onchangePage = (event: ChangeEvent<unknown>, page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
    if(userId){
      dispatch(updateQueryParams({...queryParams, page}, userId))
    }
  }

  return (
    <div className={s.mainContainer}>
      <Pagination
        count={totalPageCount ? totalPageCount : 1}
        shape="rounded"
        color="primary"
        page={+currentPage}
        onChange={onchangePage}
      />
    </div>
  )
}