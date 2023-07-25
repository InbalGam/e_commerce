import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCart, loadCart} from '../store/cartSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import {selectProfile} from '../store/profileSlice';
import { useNavigate } from 'react-router-dom';
import CartItem from "./CartItem";


function Cart() {
    const cart = useSelector(selectCart);
    const { hasError, isLoading } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const navigate = useNavigate();

    const initialValue = 0;
    const total = cart.map(el => el.calculated_price).reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);

    useEffect(() => {
        dispatch(loadCart());
    }, []);

    return (
        <div className="cartContainer">
            {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                <div className="cartInfo">
                    <ul>
                        {cart.map((el, ind) => <CartItem el={el} ind={ind} />)}
                    </ul>
                    <p className="cartTotal">Total: {total}$</p>
                </div>)}
        </div>
    );
};

export default Cart;