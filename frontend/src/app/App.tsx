import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from '../features/auth/login/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUp } from '../features/auth/signup/signup';
import { User } from '../features/user/user';
import { EPath } from '../constants/constants';
import { Header } from '../components/header/header';
import { ChangePassword } from '../features/user/changePassword/changePassword';
import { Expenses } from '../features/expenses/expenses';
import { forgotPassword } from './../features/user/userSlice';
import { ResetPassword } from '../features/auth/forgotPassword/forgotPassword';

function App() {
  return (<BrowserRouter>
    <Header />
    <Routes>
      <Route path={EPath.LOGIN} element={<Login />}></Route>
      <Route path={EPath.SIGNUP} element={<SignUp />}></Route>
      <Route path={EPath.USER} element={<User />}></Route>
      <Route path={EPath.CHANGE_PASSWORD} element={<ChangePassword />}></Route>
      <Route path={EPath.RESET_PASSWORD} element={<ResetPassword />}></Route>
      <Route path={EPath.EXPENSES} element={<Expenses />}></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
