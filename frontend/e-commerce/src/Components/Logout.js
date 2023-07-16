import { useState, useEffect } from "react";
import {logout} from '../Api';
import { useNavigate } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';


function Logout() {
    const navigate = useNavigate();

    async function loggingOut() {
        try {
            const result = await logout();
            if (result.status === 200) {
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