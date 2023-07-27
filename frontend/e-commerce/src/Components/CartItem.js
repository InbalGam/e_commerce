import Select from 'react-select';
import { useEffect, useState } from "react";
import {updateProductCart, deleteProductInCart} from '../Api';
import { useDispatch } from 'react-redux';
import {loadCart} from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';


function CartItem(props) {
    const [amount, setAmount] = useState({value: props.el.quantity, label: props.el.quantity});
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const amountOptions = [];
    for (let i = 0; i <= props.el.inventory_quantity; i++) {
        amountOptions.push({value: i, label:i});
    }
    const changeHandler = value => {
        setAmount(value);
    };


    async function updateProductInCart(e) {
        if (amount.value === 0) {
            deleteProduct(e);
        } else {
            try {
                const result = await updateProductCart(props.el.product_id, {product_id: props.el.product_id, quantity: amount.value});
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
            const result = await deleteProductInCart(props.el.product_id);
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
        <li key={props.el.ind}>
            <div>
                <button className='deleteIcon' onClick={deleteProduct}><DeleteIcon/></button>
                <p>{props.el.product_name}</p>
                <p>Quantity:</p>
                {props.el.inventory_quantity > props.el.quantity ? <Select options={amountOptions} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount" /> : 
                <Select options={[]} value={amount} onChange={changeHandler} placeholder='select amount' className="selectAmount" />}
                {amount.value !== props.el.quantity ? <button className='updateCart' onClick={updateProductInCart}>Submit</button> : ''}
                <p>Price: {props.el.calculated_price}$</p>
            </div>
        </li>
    );
};

export default CartItem;