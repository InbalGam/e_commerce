import FadeLoader from 'react-spinners/FadeLoader';
import { useEffect } from "react";
import {getAllCategories} from '../Api';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/Home.css';


function Home() {
    const navigate = useNavigate();

    async function getCategories() {
        try {
            const result = await getAllCategories();
            if (result.status === 200) {
                navigate('/category');
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