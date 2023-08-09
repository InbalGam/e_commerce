import { useEffect, useState } from 'react';
import {  Link, useNavigate, useSearchParams } from "react-router-dom";
import {searchDB} from '../Api';
import FadeLoader from 'react-spinners/FadeLoader';
import ProductCard from "./ProductCard";
import {selectProfile} from '../store/profileSlice';
import { useSelector } from 'react-redux';
import styles from './Styles/Search.css';
import SearchIcon from '@mui/icons-material/Search';


function SearchList() {
    const [products, setProducts] = useState([]);
    const profile = useSelector(selectProfile);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showSearch, setShowSearch] = useState(false);


    useEffect(() => {
        onSearchSubmit(searchParams.get("query"));
    }, []);


    async function onSearchSubmit(searchWord) {
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
    

    function showSearchForm(e) {
        e.preventDefault();
        setShowSearch(!showSearch);
    };


    return (
        <div className='searchDiv'>
            <div className='searchForm'>
                <button onClick={showSearchForm} className='searchButton'><SearchIcon /></button>
                {showSearch ?
                    <form action="/search">
                        <input type="text" id="query" name="query" className='searchInput'/>
                        <input type="submit" value="Submit" className="searchbarSubmit" />
                    </form> : ''}
            </div>
            <h2>Search Results for: {searchParams.get("query")}</h2>
            <ul>
                {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : (products[0] === 'no matching products' ? 'There are no matching products' : products.map((el, ind) => el.is_archived ? '' : <ProductCard el={el} ind={ind} admin={profile.is_admin} isArchived={el.is_archived} />))}
            </ul>
        </div>
    )
}

export default SearchList;