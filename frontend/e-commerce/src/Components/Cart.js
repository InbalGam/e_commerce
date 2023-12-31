import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCart, loadCart} from '../store/cartSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import {selectProfile} from '../store/profileSlice';
import { useNavigate, Link } from 'react-router-dom';
import CartItem from "./CartItem";
import {addOrder, deleteUserCart} from '../Api';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Styles/Cart.css';


function Cart() {
    const cart = useSelector(selectCart);
    const { hasError, isLoading } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const navigate = useNavigate();
    const [address, setAddress] = useState(profile.address);
    const [phone, setPhone] = useState(profile.phone);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showPhoneForm, setShowPhoneForm] = useState(false);

    function calculateCartTotal(data) {
        return data.map(el => {
            return el.discount_percentage ? el.price * el.quantity * (1 - (el.discount_percentage/100)) : el.price * el.quantity;
        }).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
    };

    let total = useMemo(() => calculateCartTotal(cart), [cart]);

    useEffect(() => {
        dispatch(loadCart());
    }, []);


    function showEditAddress(e) {
        setShowAddressForm(!showAddressForm);
    };

    function showEditPhone(e) {
        setShowPhoneForm(!showPhoneForm);
    };

    function handleAddressChange(e) {
        setAddress(e.target.value);
    };

    function handlePhoneChange(e) {
        setPhone(e.target.value);
    };


    async function submitOrder(e) {
        e.preventDefault();
        try {
            const data = {address: address, phone: phone};
            const result = await addOrder(data);
            await deleteUserCart();
            if (result.status === 200) {
                dispatch(loadCart());
                navigate('/profile');
            } else if (result.status === 401){
                navigate('/login');
            }
        } catch(e) {
            navigate('/error');
        }
    };

    return (
        <>
            {hasError ? 'Could not fetch cart, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                <div className="shoppingCartInfo">
                    <div className="cartProducts">
                        <ul>
                            {cart.map((el, ind) => <li key={ind}><CartItem el={el} ind={ind} /></li>)}
                        </ul>
                    </div>
                    <div className="cartSummary">
                        <p className="cartTotal">Total: {total}$</p>
                        {!profile.username ? <Link to='/login'>Login to place an order</Link> :
                            <div className="shippingInfo">
                                <h3>Shipping information</h3>
                                <div className="shippingDetails">
                                    <p>Shipping address:</p>
                                    {showAddressForm === false ? <p>{address}</p> :
                                        <div>
                                            <input id='address' type='text' name='address' value={address} placeholder={address} onChange={handleAddressChange} />
                                        </div>}
                                    <button className='editIcon' onClick={showEditAddress}><EditIcon /></button>
                                </div>
                                <div className="shippingDetails">
                                    <p>Contact phone:</p>
                                    {showPhoneForm === false ? <p>{phone}</p> :
                                        <div>
                                            <input id='phone' type='text' name='phone' value={phone} placeholder={phone} onChange={handlePhoneChange} />
                                        </div>}
                                    <button className='editIcon' onClick={showEditPhone}><EditIcon /></button>
                                </div>
                                <button type="submit" value="Submit" onClick={submitOrder} className='placeOrder'>Place Order</button>
                            </div>}
                    </div>
                </div>)}
        </>
    );
};

export default Cart;