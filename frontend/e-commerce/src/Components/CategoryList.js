import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCategories, loadCategories} from '../store/categorySlice';
import FadeLoader from 'react-spinners/FadeLoader';
import Category from './Category';
import AddIcon from '@mui/icons-material/Add';
import {selectProfile} from '../store/profileSlice';
import CategoryAddUpdate from "./CategoryAddUpdate";


function CategoryList() {
    const categories = useSelector(selectCategories);
    const { hasError, isLoading } = useSelector((state) => state.categories);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [showForm, setShowForm] = useState(false);
    

    useEffect(() => {
        dispatch(loadCategories());
    }, []);


    function showAddCategory (e) {
        setShowForm(!showForm);
    };


    return (
        <div className="categoryContainer">
            {profile.is_admin ?
                <div className="addCategory">
                    <button className='add_category' onClick={showAddCategory}><AddIcon /></button>
                    {showForm === false ? '' : <CategoryAddUpdate />}
                </div> : ''}
            <div className="categories">
                <ul>
                    {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : categories.map((el, ind) => <Category el={el} ind={ind} admin={profile.is_admin} />))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList;