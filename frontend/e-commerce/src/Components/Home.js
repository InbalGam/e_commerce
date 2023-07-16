import FadeLoader from 'react-spinners/FadeLoader';
import { useEffect } from "react";
import {getAllCategories} from '../Api';
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

    async function getCategories() {
        try {
            const result = await getAllCategories();
            if (result.status === 200) {
                navigate('/category');
            } else if (result.status === 401) {
                navigate('/login');
            }
        } catch (e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        getCategories();
    },[]);

    return (
        <FadeLoader color={'#3c0c21'} size={150} className='loader' />
    );
};

export default Home;