import { Link} from 'react-router-dom';
import dateFormat, { masks } from "dateformat";


function Orders(props) {

    return (
        <li key={props.el.ind}>
           <Link to={`/myOrders/${props.el.orderId}`} className={'orderLink'}><div>
                <p>Order id {props.el.orderId} submitted on {dateFormat(new Date(props.el.createdAt), "mmmm dS, yyyy")}</p>
                <p>Total of {props.el.orderTotal}$</p>
                <p>Shipping address {props.el.shippedTo}</p>
                <p>Contact number {props.el.contactPhone}</p>
            </div></Link>
        </li>
    );
};

export default Orders;