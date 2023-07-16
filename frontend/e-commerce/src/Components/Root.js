import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';


function Root() {
    return (
        <div>
            <div className='nav-bar'>
                <p>Shop Online</p>
                <div className='nav-links'>
                    <NavLink to='/login' className='loginLink'>Log in</NavLink>
                    <NavLink to='/profile' className='profileLink'>Profile</NavLink>
                    <NavLink to='/logout' className='logoutLink'>Log out</NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;