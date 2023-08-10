import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {archiveSpecificProduct} from '../Api';
import { useEffect, useState, useMemo } from "react";
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
    const [cartInsert, setCartInsert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);


    const amountOptions = useMemo(() => {
        const temp = []
        for (let i = 0; i <= props.el.inventory_quantity; i++) {
            temp.push({value: i, label:i});
        }
        return temp;
    }, [props.el]);
    const changeHandler = value => {
        setAmount(value);
    };

    const priceCalc = useMemo(() => (props.el.discount_percentage ? props.el.price * (1 - (props.el.discount_percentage / 100)) : props.el.price).toFixed(2), [props.el]);

    async function archive(e) {
        e.preventDefault();
        try {
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
        props.setLoading(true);
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
                props.setIsError(false);
                props.setLoading(false);
            } else if (result.status === 401){
                navigate('/login');
                setShowForm(false);
                props.setLoading(false);
            } else if (result.status === 400) {
                props.setIsError(true);
                props.setLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    async function insertToCart() {
        if (amount.value > 0) {
            try {
                const result = await addToCart({ product_id: props.el.id, quantity: amount.value });
                if (result.status === 200) {
                    dispatch(loadProducts(props.el.category_id));
                    dispatch(loadCart());
                } else if (result.status === 401) {
                    navigate('/login');
                }
            } catch (e) {
                navigate('/error');
            }
        } else {
            setCartInsert(true);
        }
    };

    return (
        <>
            <div className='productCardContainer'>
                <Card sx={{ minWidth: 375 }} className='productCard' style={{ backgroundImage: props.el.imagename ? `url(${baseURL}/image/${props.el.imagename})` : '' }}>
                    <div className={props.el.discount_percentage ? 'discountPercentage' : ''}>
                        <p>{props.el.discount_percentage ? props.el.discount_percentage + '% discount' : ''}</p>
                    </div>
                </Card>
                <CardContent>
                    <Typography sx={{ fontSize: 24 }} gutterBottom className='productName'>
                        {props.el.product_name}
                    </Typography>
                    <Typography sx={{ fontSize: 24 }} gutterBottom className='productPrice'>
                        <div className='priceBeforeDiscount'>{props.el.discount_percentage ? props.el.price.toFixed(2)+'$' : ''}</div>
                        {priceCalc}$
                    </Typography>
                    <Select options={amountOptions} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount" />
                    <Button size="small" className='addToCart' onClick={insertToCart}>Add to cart</Button>
                </CardContent>
                <CardActions className='productCardButtons'>
                    {props.admin ? <Button size="small" onClick={() => setShowForm(!showForm)} className='productCardActionButtons'><EditIcon /></Button> : ''}
                    {props.admin ? <Button size="small" onClick={archive} className='productCardActionButtons'>{props.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}</Button> : ''}
                </CardActions>
            </div>
            {deleteFailed === false ? '' : 'Could not archive product'}
            {cartInsert === false ? '' : 'Cannot add to cart without choosing quantity'}
            {showForm ? <ProductAddUpdate onProductSubmit={onProductSubmit} product={props.el} /> : ''}
        </>
    );
};

