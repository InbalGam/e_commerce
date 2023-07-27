import { useParams, useNavigate} from 'react-router-dom';
import {getSpecificOrder} from '../Api';
import { useEffect, useState } from "react";


function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);

    async function getOrder() {
        try {
            const result = await getSpecificOrder(orderId);
            const jsonData = await result.json();
            setOrder(jsonData);
            console.log(jsonData);
        } catch(e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        getOrder();
    }, [])

    return (
        <div>
            <ul>
                {order.map((el,ind) => 
                <li key={ind}> 
                    <p>{el.product_name}</p>
                    <p>quantity purchased: {el.quantity}</p>
                    <p>final price for item: {el.price}$</p>
                </li>)}
            </ul>
        </div>
    );
}

export default OrderDetails;