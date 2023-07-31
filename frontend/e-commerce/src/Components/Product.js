import {archiveSpecificProduct} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loadProducts} from '../store/productSlice';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import {baseURL} from '../apiKey';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Styles/Product.css';
import ProductAddUpdate from "./ProductAddUpdate";
import {loadImage, updateProduct, addToCart} from '../Api';
import Select from 'react-select';
import {loadCart} from '../store/cartSlice';


function Product(props) {
    const [deleteFailed, setDeleteFailed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);


    const amountOptions = [];
    for (let i = 0; i <= props.el.inventory_quantity; i++) {
        amountOptions.push({value: i, label:i});
    }
    const changeHandler = value => {
        setAmount(value);
    };


    async function archive(e) {
        e.preventDefault();
        try {
            console.log(props.el.id);
            const result = await archiveSpecificProduct(props.el.category_id, props.el.id, !props.isArchived);
            if (result.status === 401) {
              navigate('/login');
            } else {
              if (result.status === 200) {
                dispatch(loadProducts(props.el.category_id));
                setDeleteFailed(false);
              } else {
                setDeleteFailed(true);
              }
            }
          } catch (e) {
            navigate('/error');
          }
    };

    async function onProductSubmit(productData, productImg) {
        let imgId;
        const data = new FormData();
        data.append('image', productImg );
        try {
            if (productImg) {
                const imgResult = await loadImage(data);
                const jsonData = await imgResult.json();
                imgId = jsonData.id;
            } else {
                imgId = props.el.image_id;
            }
            productData.imgId = imgId;
            productData.categoryId = props.el.category_id;
            const result = await updateProduct(props.el.category_id, props.el.id, productData);
            if (result.status === 200) {
                dispatch(loadProducts(props.el.category_id));
                setShowForm(false);
            } else if (result.status === 401){
                navigate('/login');
                setShowForm(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    async function insertToCart() {
        try {
            const result = await addToCart({product_id: props.el.id, quantity: amount.value});
            if (result.status === 200) {
                dispatch(loadProducts(props.el.category_id));
                dispatch(loadCart());
            } else if (result.status === 401){
                navigate('/login');
            }
        } catch(e) {
            navigate('/error');
        }
    };


    return (
        <li key={props.ind}>
            <div className="product" style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
                <h3>{props.el.product_name}</h3>
                {props.admin ? 
                    <div> 
                        <button onClick={archive} className='archiveButton'>{props.isArchived ? <UnarchiveIcon/> : <ArchiveIcon/>}</button>
                        <button className='editButton' onClick={() => setShowForm(!showForm)}><EditIcon/></button>
                    </div> : ''}
                <div className='productInfo'>
                    <p>{props.el.price}$</p>
                    <p>{props.el.discount ? props.el.discount+'% discount' : ''}</p>
                    <Select options={amountOptions} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount"/>
                    <button className='addToCart' onClick={insertToCart}>Add to cart</button>
                </div>
                {deleteFailed === false ? '' : 'Could not archive product'}
                {showForm ? <ProductAddUpdate onProductSubmit={onProductSubmit} product={props.el}/> : ''}
            </div>
        </li>
    );
};

export default Product;