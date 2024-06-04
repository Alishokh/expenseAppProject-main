import React, { useEffect, useState } from 'react'
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material"
import { FilterAltOff, Search } from "@mui/icons-material"
import { useSearchParams } from "react-router-dom"
import s from './customSearch.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { EExpenseType, ExpenseChargeCategory, ExpenseIncomeCategory, ExpenseTypeData } from '../../features/expenses/expenseModal/config'
import { setQueryParamsAC } from '../../features/expenses/expenseSlice';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { styled } from '@mui/system';

export const CustomSearch = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const queryType = searchParams.get('type')
    const queryCategory = searchParams.get('category')
    const queryTitle = searchParams.get('title')
    const queryMinAmount = searchParams.get('minAmount')
    const queryMaxAmount = searchParams.get('maxAmount')
    const page = useAppSelector<number>(state => state.expenses.queryParams.page);
    let timer: number
    const dispatch = useAppDispatch()
    const [title, setTitle] = useState(queryTitle ? queryTitle : '')
    const [type, setType] = useState(queryType ? queryType : '')
    const [category, setCategory] = useState(queryCategory ? queryCategory : '')
    const [minAmount, setMinAmount] = useState(queryMinAmount ? +queryMinAmount : null)
    const [maxAmount, setMaxAmount] = useState(queryMaxAmount ? +queryMaxAmount : null)
    const [date, setDate] = useState<Dayjs | Date | null>(null)
    const openModal = useAppSelector(state => state.expenses.openModal)

    const changeSearchInputHandler = (newTitle: string) => setTitle(newTitle)

    useEffect(() => {

        //set data into url (status params)
        if (type) {
            searchParams.set('type', type)
            setSearchParams(searchParams)
        } else {
            searchParams.delete('type')
            setSearchParams(searchParams)
        }

        //set data into url (species params)
        if (category) {
            searchParams.set('category', category)
            setSearchParams(searchParams)
        } else {
            searchParams.delete('category')
            setSearchParams(searchParams)
        }

        //set data into url (name params)
        if (title) {
            searchParams.set('title', title)
            setSearchParams(searchParams)
        } else {
            searchParams.delete('title')
            setSearchParams(searchParams)
        }

        //set data into url (name params)
        if (minAmount) {
            searchParams.set('minAmount', String(minAmount))
            setSearchParams(searchParams)
        } else {
            searchParams.delete('minAmount')
            setSearchParams(searchParams)
        }

        //set data into url (name params)
        if (maxAmount) {
            searchParams.set('maxAmount', String(maxAmount))
            setSearchParams(searchParams)
        } else {
            searchParams.delete('maxAmount')
            setSearchParams(searchParams)
        }

        //debounce delay to change the query params
        timer = window.setTimeout(() => {
            dispatch(setQueryParamsAC({ queryParams: { category, title, type, minAmount, maxAmount, page, date } }))
        }, 400)

        return () => clearTimeout(timer)

    }, [type, category, title, minAmount, maxAmount, date])

    const changeTypeHandler = (event: SelectChangeEvent<string>) => {
        const type = event.target.value
        setType(type)
        setCategory('')
    }

    const changeCategoryHandler = (event: SelectChangeEvent<string>) => {
        const category = event.target.value
        setCategory(category)
    }

    const resetAllFiltersHandler = () => {
        //dispatch(updateQueryParams({...initialCharactersState.queryParams}))
        if (!openModal) {
            setTitle('')
            setType('')
            setCategory('')
            setMinAmount(null)
            setMaxAmount(null)
            setDate(null)

            searchParams.delete('page')
            setSearchParams(searchParams)
        }
    }

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



    const onOpenMobileModalStyle = { margin: '10px 0', width: "100%", backgroundColor: 'rgba(0, 0, 0, 0.25)' }
    const onOpenModalStyle = { backgroundColor: 'rgba(0, 0, 0, 0.25)' }

    const formItemStyles = mobileView ?
        openModal ?
            onOpenMobileModalStyle
            : { margin: '10px 0' }
        : openModal ? onOpenModalStyle : { height: '40px'};

    return (
        <div className={s.mainContainer}>
            <div className={s.searchContainer}>
                <FormControl sx={{
                    "& .MuiFormControl-root customSearch_speciesInput__JlTIW css-1nrlq1o-MuiFormControl-root": {height: '40px'}
                }} style={formItemStyles} className={s.nameInput} variant="outlined" size='small'>
                    <OutlinedInput
                        disabled={openModal}
                        id="outlined-adornment-password"
                        type='text'
                        startAdornment={
                            <InputAdornment position="start">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        }
                        onChange={(e) => changeSearchInputHandler(e.currentTarget.value)}
                        value={title}
                    />
                </FormControl>

                <FormControl sx={{
                    "& .MuiFormControl-root customSearch_statusInput__eAQHD css-1x83xy3-MuiFormControl-root": {height: '40px'}
                }} style={formItemStyles} className={s.statusInput}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        disabled={openModal}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name={'type'}
                        label="type"
                        onChange={changeTypeHandler}
                        value={type}
                        size='small'
                    >
                        {ExpenseTypeData.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{
                    "& .MuiFormControl-root customSearch_speciesInput__JlTIW css-1nrlq1o-MuiFormControl-root": {height: '40px'}
                }} style={formItemStyles} className={s.speciesInput} disabled={type ? false : true}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        disabled={openModal}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name={'category'}
                        label="category"
                        onChange={changeCategoryHandler}
                        value={category}
                        size='small'
                    >
                        {type === EExpenseType.CHARGE ? ExpenseChargeCategory.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        )) :
                            ExpenseIncomeCategory.map((option, i) => (
                                <MenuItem key={i} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>


                <div className={s.date}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline css-1d3z3hw-MuiOutlinedInput-notchedOutline": { border: '0px solid black', backgroundColor: 'white', zIndex: '-1', height: '50px', paddingTop: '-5px'},
                                    "& .MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary Mui-error MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-1jy569b-MuiFormLabel-root-MuiInputLabel-root": { color: 'black' },
                                    "& .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root.Mui-error": { color: 'black' },
                                    "& .css-10o2lyd-MuiStack-root>.MuiTextField-root": { height: '100px' },
                                    "& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": { border: '0px solid black', backgroundColor: 'white', zIndex: '-1', height: '50px', paddingTop: '-5px'},
                                    "& .MuiFormControl-root MuiTextField-root customSearch_date__kimn3 css-1qzuwof-MuiFormControl-root-MuiTextField-root": { border: '0px solid black', backgroundColor: 'white', zIndex: '-1', height: '50px', paddingTop: '-5px'}
                                }}
                                className={s.date}
                                label="Date"
                                value={dayjs(date)}
                                onChange={(value: any) => setDate(value?.$d.toISOString())}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>



                <TextField
                    disabled={openModal}
                    style={formItemStyles}
                    className={s.speciesInput}
                    id="outlined-number"
                    size='small'
                    label="Min Amount"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={minAmount || ''}
                    onChange={(e) => setMinAmount(+e.currentTarget.value)}
                />
                <TextField
                    disabled={openModal}
                    style={formItemStyles}
                    className={s.speciesInput}
                    id="outlined-number"
                    size='small'
                    label="Max Amount"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={maxAmount || ''}
                    onChange={(e) => setMaxAmount(+e.currentTarget.value)}
                />


                <div style={mobileView ?
                    openModal ?
                        onOpenMobileModalStyle
                        : { margin: '10px 0' }
                    : openModal ? onOpenModalStyle : {}} className={s.resetAllFilters} onClick={resetAllFiltersHandler}>
                    <FilterAltOff />
                </div>
            </div>
        </div>

    )
}