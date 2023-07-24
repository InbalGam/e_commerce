import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectProducts, loadProducts} from '../store/productSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import AddIcon from '@mui/icons-material/Add';
import {selectProfile} from '../store/profileSlice';
import {loadCategoryImage, insertNewCategory} from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
import Product from "./Product";


function ProductsList() {
    const products = useSelector(selectProducts);
    const { hasError, isLoading } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const { categoryId } = useParams();
    

    useEffect(() => {
        dispatch(loadProducts(categoryId));
    }, []);


    function showAddProduct (e) {
        setShowForm(!showForm);
    };

    return (
        <div className="productsContainer">
            {profile.is_admin ?
                <div className="addProduct">
                    <button className='add_product' onClick={showAddProduct}><AddIcon /></button>
                    {showForm === false ? '' : 'ADD COMPONENET to add update product'}
                </div> : ''}
            <div className="currentProducts">
                <p>Current Products</p>
                <ul>
                    {hasError ? 'Could not fetch products, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : products.map((el, ind) => el.is_archived ? '' 
                                                                                                                                                                        : <Product el={el} ind={ind} admin={profile.is_admin} isArchived={false}/>))}
                </ul>
            </div>
            {profile.is_admin ? 
            <div className="archivedProducts">
                <p>Archived Products</p>
                <ul>
                    {hasError ? 'Could not fetch products, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : products.map((el, ind) => el.is_archived ?
                                                                                                                                                        <Product el={el} ind={ind} admin={profile.is_admin} isArchived={false}/> : '' ))}
                </ul>
            </div> : '' }
        </div>
    );
};

export default ProductsList;