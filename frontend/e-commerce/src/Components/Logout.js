import { useState, useEffect } from "react";
import {logout} from '../Api';
import { useNavigate } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import { useDispatch } from 'react-redux';
import {loggedOutProfile} from '../store/profileSlice';


function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function loggingOut() {
        try {
            const result = await logout();
            if (result.status === 200) {
                dispatch(loggedOutProfile());
                navigate('/login?logout=1');
            } else {
                navigate('/error');
            }
        } catch (e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        loggingOut();
    }, []);

    return (
        <div>
            <FadeLoader color={'#3c0c21'} size={150} className='loader' />
        </div>
    );
};

export default Logout;