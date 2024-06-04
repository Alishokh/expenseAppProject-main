import React, { useState, useEffect } from 'react'

//icons imports
import menuIcon from '../../assets/icons/burger-bar.png'
import closeIcon from '../../assets/icons/close.png'
import user from '../../assets/images/user.png'

//react-router-dom import
import { Link, useNavigate } from "react-router-dom"

//constants import


//style import
import s from './header.module.css'
import { EPath, EUserData } from '../../constants/constants'
import { EHeaderTitle, headerItems } from './config'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { getUserLoggedOut } from '../../features/user/userSlice'
import { Dispatch } from '@reduxjs/toolkit';

export const Header = () => {
  const [click, setClick] = useState(false)
  const [iconMenu, setIconMenu] = useState(true)
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const userId = +JSON.parse(localStorage.getItem(EUserData.USER_ID) as string);
  const toMainPageHandler = () => navigate(EPath.USER)
  const isUserLoggedIn = useAppSelector<boolean>(state => state.user.isLoggedIn);
  const handleClick = () => {
    setClick(!click);
  }
  const menuImage = <img onClick={handleClick} className={s.menuIcon} src={click ? closeIcon : menuIcon} alt="menu" />

  const closeMobileMenu = () => setClick(false)
  const logoutHandler = () => {
    closeMobileMenu();
    dispatch(getUserLoggedOut({userId: userId as number}))
    navigate(EPath.LOGIN);
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setIconMenu(false)
    } else {
      setIconMenu(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', showButton)
    showButton();
  }, []);

  useEffect(() => {
    if(!isUserLoggedIn){
      navigate(EPath.LOGIN)
    }
  }, [isUserLoggedIn]);

  return (
    <header className={s.header}>
      <div className={s.headerContainer}>
        <div className={s.menuContainer}>
          <img onClick={toMainPageHandler} src={user} alt="logo" className={s.logo_img} />
          <h2 className={s.logo} onClick={toMainPageHandler}>Expense Reports</h2>
          <nav>
            <ul className={click ? `${s.navMenu} ${s.navMenuActive}` : s.navMenu}>
              {
                isUserLoggedIn ?
                  <li key={EHeaderTitle.LOGOUT} onClick={logoutHandler} className={s.navItem}>
                    <Link className={s.navLink} to={EPath.LOGIN}>{EHeaderTitle.LOGOUT}</Link>
                  </li> : null
              }
              {
                headerItems.map(({ id, title, path }) =>
                  <li key={id} onClick={closeMobileMenu} className={s.navItem}>
                    <Link className={s.navLink} to={path}>{title}</Link>
                  </li>)
              }

            </ul>
          </nav>

        </div>

        <div className={s.actionContainer}>
          {
            iconMenu ? '' : menuImage
          }
        </div>

      </div>
    </header>
  )
}