import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';


function Root() {
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
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;