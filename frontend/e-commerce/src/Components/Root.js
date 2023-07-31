import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';
import TextField from "@mui/material/TextField";
import { useState } from 'react';
import SearchList from "./SearchList";
import SearchIcon from '@mui/icons-material/Search';


function Root() {
    const [userInput, setUserInput] = useState('');

    function inputHandler(e) {
        const lowerCase = e.target.value.toLowerCase();
        setUserInput(lowerCase);
    };


    return (
        <div>
            <div className='nav-bar'>
                <p>Shop Online</p>
                <div className='nav-links'>
                    <NavLink to='/category' className='rootLink'>Categories</NavLink>
                    <NavLink to='/profile' className='rootLink'>Profile</NavLink>
                    <NavLink to='/cart' className='rootLink'>Cart</NavLink>
                    <NavLink to='/login' className='rootLink'>Log in</NavLink>
                    <NavLink to='/logout' className='rootLink'>Log out</NavLink>
                    <NavLink to='/search'><SearchIcon className="searchIcon" /></NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;