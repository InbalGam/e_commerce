import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import {selectCart, loadCart} from '../store/cartSlice';
import {selectProfile} from '../store/profileSlice';


function Root() {
    const cart = useSelector(selectCart);
    const profile = useSelector(selectProfile);
    const dispatch = useDispatch();
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        dispatch(loadCart());
    }, []);

    function showSearchForm(e) {
        e.preventDefault();
        setShowSearch(!showSearch);
    };

    return (
        <div>
            <div className='nav-bar'>
                {/* <p>Shop Online</p> */}
                <NavLink to='/' className='mainLink'>Shop Online</NavLink>
                <div className='nav-links'>
                    <button onClick={showSearchForm} className="searchbar"><SearchIcon className="searchIcon" /></button>
                    {showSearch ? 
                    <form action="/search">
                        <input type="text" id="query" name="query" />
                        <input type="submit" value="Submit" className="searchbarSubmit"/>
                    </form> : ''}
                    {profile.username ?
                        <>
                            <NavLink to='/profile' className='rootLink'>Profile</NavLink>
                            <NavLink to='/logout' className='rootLink'>Log out</NavLink>
                        </> : <NavLink to='/login' className='rootLink'>Log in</NavLink>}
                    <div className="cartInfo">
                        <NavLink to='/cart' className='rootLink' > <ShoppingCartIcon className='cartIcon' /> </NavLink>
                        <p className="AmountItemsCart">{cart.length}</p>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;