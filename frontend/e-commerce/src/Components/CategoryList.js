import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCategories, loadCategories} from '../store/categorySlice';
import FadeLoader from 'react-spinners/FadeLoader';
import Category from './Category';


function CategoryList() {
    const categories = useSelector(selectCategories);
    const { hasError, isLoading } = useSelector((state) => state.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCategories());
    }, []);

    return (
        <div className="categoryContainer">
            <ul>
                {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : categories.map((el, ind) => <Category el={el} ind={ind} />))}
            </ul>
        </div>
    );
};

export default CategoryList;