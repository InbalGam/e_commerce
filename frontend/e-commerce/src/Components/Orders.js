import { Link} from 'react-router-dom';
import dateFormat, { masks } from "dateformat";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './Styles/Orders.css';


function Orders(props) {

    return (
        <>
            <Link to={`/myOrders/${props.el.orderId}`} className={'orderLink'}>
                <Card sx={{ minWidth: 375 }} className='orderCard'>
                    <CardContent>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='orderDataId'>
                            Order id {props.el.orderId}
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='orderData'>
                            submitted on {dateFormat(new Date(props.el.createdAt), "mmmm dS, yyyy")}
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='orderData'>
                            Total of {props.el.orderTotal.toFixed(2)}$
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='orderData'>
                            Shipping address {props.el.shippedTo}
                        </Typography>
                        <Typography sx={{ fontSize: 24 }} gutterBottom className='orderData'>
                            Contact number {props.el.contactPhone}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        </>
    );
};

export default Orders;