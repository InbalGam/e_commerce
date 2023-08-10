import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectProducts, loadProducts} from '../store/productSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import AddIcon from '@mui/icons-material/Add';
import {selectProfile} from '../store/profileSlice';
import {loadImage, insertNewProduct} from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
//import Product from "./Product";
import ProductAddUpdate from "./ProductAddUpdate";
import styles from './Styles/ProductsList.css';
import ProductCard from "./ProductCard";

function ProductsList() {
    const products = useSelector(selectProducts);
    const { hasError, isLoading } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    

    useEffect(() => {
        dispatch(loadProducts(categoryId));
    }, []);


    function showAddProduct (e) {
        setShowForm(!showForm);
    };

    async function onProductSubmit(productData, productImg) {
        setLoading(true);
        let imgId;
        const data = new FormData();
        data.append('image', productImg );
        try {
            if (productImg) {
                const imgResult = await loadImage(data);
                const jsonData = await imgResult.json();
                imgId = jsonData.id;
            } else {
                imgId = null;
            }
            productData.imgId = imgId;
            productData.categoryId = categoryId;
            const result = await insertNewProduct(categoryId, productData);
            if (result.status === 200) {
                dispatch(loadProducts(categoryId));
                setShowForm(false);
                setIsError(false);
                setLoading(false);
            } else if (result.status === 401){
                navigate('/login');
                setShowForm(false);
                setLoading(false);
            } else if (result.status === 400) {
                setIsError(true);
                setLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <div>
            {loading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                <div>{profile.is_admin ?
                    <div className="addProduct">
                        <button className='add_product' onClick={showAddProduct}><AddIcon /></button>
                        {showForm === false ? '' : <ProductAddUpdate onProductSubmit={onProductSubmit} />}
                        {isError === false ? '' : 'Enter a product name - must be different from existing names'}
                    </div> : ''}
                    <div className="productsContainer">
                        <div className="products">
                            <ul>
                                {hasError ? 'Could not fetch products, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                                    products.length > 0 ? (products.map((el, ind) => el.is_archived ? '' : <li key={ind}><ProductCard el={el} ind={ind} admin={profile.is_admin} isArchived={false} setLoading={setLoading} setIsError={setIsError}/></li>)) : 'There are no products yet')}
                            </ul>
                        </div>
                        {profile.is_admin ?
                            <div className="products">
                                <p>Archived Products</p>
                                <ul>
                                    {hasError ? 'Could not fetch products, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                                        products.length > 0 ? (products.map((el, ind) => el.is_archived ? <li key={ind}><ProductCard el={el} ind={ind} admin={profile.is_admin} isArchived={true} setLoading={setLoading} setIsError={setIsError}/></li> : '')) : 'There are no products yet')}
                                </ul>
                            </div> : ''}
                    </div></div>}
        </div>
    );
};

export default ProductsList;