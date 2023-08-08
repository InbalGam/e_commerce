import { useState } from 'react';
import {  Link, useNavigate } from "react-router-dom";
import {searchDB} from '../Api';
import FadeLoader from 'react-spinners/FadeLoader';
import ProductCard from "./ProductCard";
import {selectProfile} from '../store/profileSlice';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Styles/Search.css';


function SearchList() {
    const [products, setProducts] = useState([]);
    const profile = useSelector(selectProfile);
    const [isLoading, setIsLoading] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const navigate = useNavigate();

    function handleWordChange(e) {
        setSearchWord(e.target.value);
    };


    async function onSearchSubmit(e) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const result = await searchDB({searchWord});
            const jsonData = await result.json();
            if (result.status === 200) {
                if (jsonData.msg) {
                    setProducts([jsonData.msg]);
                    setIsLoading(false);
                } else {
                    setProducts(jsonData);
                    setIsLoading(false);
                }
            } else if (result.status === 401){
                navigate('/login');
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            navigate('/error');
        }
    };



    return (
        <div className='searchDiv'>
            <div>
                <input placeholder='Search' id='search' className='searchInput' value={searchWord} onChange={handleWordChange}/>
                <button onClick={onSearchSubmit} className='searchButton'><SearchIcon /></button>
            </div>
            <h2>Search Results</h2>
            <ul>
                {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : (products[0] === 'no matching products' ? 'There are no matching products' : products.map((el, ind) => el.is_archived ? '' : <ProductCard el={el} ind={ind} admin={profile.is_admin} isArchived={el.is_archived}/>))}
            </ul>
        </div>
    )
}

export default SearchList;