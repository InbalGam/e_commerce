import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import ProductAddUpdate from "./ProductAddUpdate";
import {loadImage, updateProduct, addToCart} from '../Api';
import Select from 'react-select';
import {loadCart} from '../store/cartSlice';
import styles from './Styles/ProductCard.css';


export default function ProductCard(props) {
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
        <>
            <div className='productCardContainer'>
                    <Card sx={{ minWidth: 375 }} className='productCard' style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
                    </Card>
                    <CardContent>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='productName'>
                            {props.el.product_name}
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='productPrice'>
                            {props.el.price}$
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='productPrice'>
                            {props.el.discount ? props.el.discount+'% discount' : ''}
                        </Typography>
                        <Select options={amountOptions} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount"/>
                        <Button size="small" className='addToCart' onClick={insertToCart}>Add to cart</Button>
                    </CardContent>
                <CardActions className='productCardButtons'>
                    {props.admin ? <Button size="small" onClick={() => setShowForm(!showForm)} className='productCardActionButtons'><EditIcon /></Button> : ''}
                    {props.admin ? <Button size="small" onClick={archive} className='productCardActionButtons'>{props.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}</Button> : ''}
                </CardActions>
            </div>
            {deleteFailed === false ? '' : 'Could not archive product'}
            {showForm ? <ProductAddUpdate onProductSubmit={onProductSubmit} product={props.el}/> : ''}
        </>
    );
};

