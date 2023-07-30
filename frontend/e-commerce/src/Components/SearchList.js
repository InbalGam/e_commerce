import { useState } from 'react';
import {  Link, useNavigate } from "react-router-dom";
import {searchDB} from '../Api';
import FadeLoader from 'react-spinners/FadeLoader';
import Product from './Product';
import {selectProfile} from '../store/profileSlice';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';


function SearchList(props) {
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
        console.log(searchWord);
        try {
            setIsLoading(true);
            const result = await searchDB({searchWord});
            const jsonData = await result.json();
            if (result.status === 200) {
                setProducts(jsonData);
                setIsLoading(false);
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
        <div>
            <input placeholder='Search' id='search' className='searchInput' value={searchWord} onChange={handleWordChange}/>
            <button onClick={onSearchSubmit}><SearchIcon /></button>
            <h2>Search Results</h2>
            <ul>
                {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : products.map((el, ind) => el.is_archived ? '' : <Product el={el} ind={ind} admin={profile.is_admin} isArchived={el.is_archived}/>)}
            </ul>
        </div>
    )
}

export default SearchList;