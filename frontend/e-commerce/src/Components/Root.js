import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import {selectCart, loadCart} from '../store/cartSlice';


function Root() {
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCart());
    }, []);


    return (
        <div>
            <div className='nav-bar'>
                {/* <p>Shop Online</p> */}
                <NavLink to='/' className='mainLink'>Shop Online</NavLink>
                <div className='nav-links'>
                    <NavLink to='/profile' className='rootLink'>Profile</NavLink>
                    <NavLink to='/login' className='rootLink'>Log in</NavLink>
                    <NavLink to='/logout' className='rootLink'>Log out</NavLink>
                    <NavLink to='/search'><SearchIcon className="searchIcon" /></NavLink>
                    <div className="cartInfo">
                        <NavLink to='/cart' className='rootLink' > <ShoppingCartIcon className='cartIcon'/> </NavLink>
                        <p className="AmountItemsCart">{cart.length}</p>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;