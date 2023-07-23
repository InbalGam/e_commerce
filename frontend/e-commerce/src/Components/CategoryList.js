import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCategories, loadCategories} from '../store/categorySlice';
import FadeLoader from 'react-spinners/FadeLoader';
import Category from './Category';
import AddIcon from '@mui/icons-material/Add';
import {selectProfile} from '../store/profileSlice';
import CategoryAddUpdate from "./CategoryAddUpdate";
import {loadCategoryImage, insertNewCategory} from '../Api';
import { useNavigate } from 'react-router-dom';


function CategoryList() {
    const categories = useSelector(selectCategories);
    const { hasError, isLoading } = useSelector((state) => state.categories);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        dispatch(loadCategories());
    }, []);


    function showAddCategory (e) {
        setShowForm(!showForm);
    };


    async function onCategorySubmit(categoryName, categoryImg) {
        let imgId;
        const data = new FormData();
        data.append('image', categoryImg );
        try {
            if (categoryImg) {
                const imgResult = await loadCategoryImage(data);
                const jsonData = await imgResult.json();
                imgId = jsonData.id;
            } else {
                imgId = null;
            }
            const result = await insertNewCategory(categoryName, imgId);
            if (result.status === 200) {
                dispatch(loadCategories());
            } else if (result.status === 401){
                navigate('/login');
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <div className="categoryContainer">
            {profile.is_admin ?
                <div className="addCategory">
                    <button className='add_category' onClick={showAddCategory}><AddIcon /></button>
                    {showForm === false ? '' : <CategoryAddUpdate onCategorySubmit={onCategorySubmit} />}
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