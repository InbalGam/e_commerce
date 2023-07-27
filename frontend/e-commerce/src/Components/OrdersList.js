import {selectOrders, loadOrdersDetails} from '../store/ordersSlice';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate} from 'react-router-dom';
import Orders from './Orders';


function OrdersList() {
    const orders = useSelector(selectOrders);
    const { ordersHasError, ordersIsLoading } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadOrdersDetails());
    }, []);


    return (
        <div>
            {ordersHasError ? 'Could not fetch profile, try again' : 
            (ordersIsLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : 
            <div>
                <ul>
                    {orders.map((el, ind) => <Orders el={el} ind={ind} />)}
                </ul>
            </div>)}
        </div>
    );
};

export default OrdersList;