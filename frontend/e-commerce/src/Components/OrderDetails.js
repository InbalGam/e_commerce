import { useParams, useNavigate} from 'react-router-dom';
import {getSpecificOrder} from '../Api';
import { useEffect, useState } from "react";
import FadeLoader from 'react-spinners/FadeLoader';


function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getOrder() {
        try {
            setIsLoading(true);
            const result = await getSpecificOrder(orderId);
            if (result.status === 200) {
                const jsonData = await result.json();
                setOrder(jsonData);
                setIsLoading(false);
            } else {
                navigate('/login');
                setIsLoading(false);
            }
        } catch(e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        getOrder();
    }, [])

    return (
        <div>
           {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : 
           <ul>
                {order.map((el,ind) => 
                <li key={ind}> 
                    <p>{el.product_name}</p>
                    <p>quantity purchased: {el.quantity}</p>
                    <p>final price for item: {el.price.toFixed(2)}$</p>
                </li>)}
            </ul>}
        </div>
    );
}

export default OrderDetails;