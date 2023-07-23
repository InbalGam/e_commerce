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
            <div className="currentCategories">
                <p>Current Categories</p>
                <ul>
                    {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : categories.map((el, ind) => el.is_archived ? '' 
                                                                                                                                                                        : <Category el={el} ind={ind} admin={profile.is_admin} isArchived={false} />))}
                </ul>
            </div>
            <div className="archivedCategories">
                <p>Archived Categories</p>
                <ul>
                    {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : categories.map((el, ind) => el.is_archived ?
                                                                                                                                                                                    <Category el={el} ind={ind} admin={profile.is_admin} isArchived={true}/> : '' ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList;