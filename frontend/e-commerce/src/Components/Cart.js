import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectCart, loadCart} from '../store/cartSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import {selectProfile} from '../store/profileSlice';
import { useNavigate } from 'react-router-dom';
import CartItem from "./CartItem";
import {addOrder, deleteUserCart} from '../Api';
import EditIcon from '@mui/icons-material/Edit';


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

    const initialValue = 0;
    const total = cart.map(el => el.calculated_price).reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);

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
            const products = cart.map(el => {return {product_id: el.product_id, quantity: el.quantity, price: el.calculated_price}})
            const data = {total: total,
                address: address,
                phone: phone,
                products: products}
            const result = await addOrder(data);
            await deleteUserCart();
            if (result.status === 200) {
                dispatch(loadCart());
                console.log('placed order');
            } else if (result.status === 401){
                navigate('/login');
            }
        } catch(e) {
            navigate('/error');
        }
    };

    return (
        <div className="cartContainer">
            {hasError ? 'Could not fetch categories, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> :
                <div className="cartInfo">
                    <ul>
                        {cart.map((el, ind) => <CartItem el={el} ind={ind} />)}
                    </ul>
                    <p className="cartTotal">Total: {total}$</p>
                    <h3>Shipping information</h3>
                    <p>Shipping address:</p>
                    <button className='editIcon' onClick={showEditAddress}><EditIcon/></button>
                    {showAddressForm === false ?  <p>{address}</p> : 
                    <div>
                        <input id='address' type='text' name='address' value={address} placeholder={address} onChange={handleAddressChange}/> 
                    </div>}
                    <p>Contact phone:</p>
                    <button className='editIcon' onClick={showEditPhone}><EditIcon/></button>
                    {showPhoneForm === false ?  <p>{phone}</p> : 
                    <div>
                        <input id='phone' type='text' name='phone' value={phone} placeholder={phone} onChange={handlePhoneChange}/> 
                    </div>}
                    <button type="submit" value="Submit" onClick={submitOrder} >Place Order</button>
                </div>)}
        </div>
    );
};

export default Cart;