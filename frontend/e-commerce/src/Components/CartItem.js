import Select from 'react-select';
import { useEffect, useState, useMemo } from "react";
import {updateProductCart, deleteProductInCart} from '../Api';
import { useDispatch } from 'react-redux';
import {loadCart} from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {baseURL} from '../apiKey';
import Typography from '@mui/material/Typography';
import styles from './Styles/CartItem.css';

function CartItem(props) {
    const [amount, setAmount] = useState({value: props.el.quantity, label: props.el.quantity});
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const amountOptions = [];
    useMemo(() => {
        for (let i = 0; i <= props.el.inventory_quantity; i++) {
            amountOptions.push({ value: i, label: i });
        }
    }, [props.el]);

    const changeHandler = value => {
        setAmount(value);
    };

    const priceCalc = useMemo(() => (props.el.discount_percentage ? props.el.price * props.el.quantity * (1 - (props.el.discount_percentage / 100)) : props.el.price * props.el.quantity).toFixed(2), [props.el]);


    async function updateProductInCart(e) {
        if (amount.value === 0) {
            deleteProduct(e);
        } else {
            try {
                const result = await updateProductCart(props.el.id, {product_id: props.el.id, quantity: amount.value});
                if (result.status === 200) {
                    dispatch(loadCart());
                } else if (result.status === 401){
                    navigate('/login');
                }
            } catch(e) {
                navigate('/error');
            }
        }
    };


    async function deleteProduct(e) {
        e.preventDefault();
        try {
            const result = await deleteProductInCart(props.el.id);
            if (result.status === 200) {
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
                    <div className='productNameDelete'>
                    <Typography sx={{ fontSize: 24 }} gutterBottom className='productName'>
                        {props.el.product_name}
                    </Typography>
                    <CardActions className='productCardButtons'>
                        <Button className='cartActionButton' onClick={deleteProduct}><DeleteIcon /></Button>
                    </CardActions>
                    </div>
                    <Typography sx={{ fontSize: 20 }} gutterBottom className='productQuantity'>
                        Quantity:
                    </Typography>
                        {props.el.inventory_quantity > props.el.quantity ? <Select options={amountOptions} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount" /> :
                            <Select options={[]} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount" />}
                        {amount.value !== props.el.quantity ? <Button className='updateCart' onClick={updateProductInCart}>Submit</Button> : ''}
                    <Typography sx={{ fontSize: 20 }} gutterBottom className='productPrice'>
                        Price: {priceCalc}$
                    </Typography>
                </CardContent>
            </div>
        </>
    );

};

export default CartItem;