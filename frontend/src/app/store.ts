//redux vs redux/toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { userSlice } from '../features/user/userSlice'
import { expenseSlice } from '../features/expenses/expenseSlice'

// //slices imports
// import { appSlice } from 'app/appSlice'
// import {charactersSlice} from 'features/allCharactersPage/charactersSlice'
// import {characterSlice} from 'features/characterInformation/characterSlice'

const rootReducer = combineReducers({
  user: userSlice,
  expenses: expenseSlice,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch