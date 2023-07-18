import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectProfile, loadProfile} from '../store/profileSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import EditIcon from '@mui/icons-material/Edit';
import {updateProfile} from '../Api';
import { useNavigate} from 'react-router-dom';


function Profile() {
    const profile = useSelector(selectProfile);
    const { hasError, isLoading } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showPhoneForm, setShowPhoneForm] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [address, setAddress] = useState(profile.address);
    const [phone, setPhone] = useState(profile.phone);
    const [fieldsFilled, setFieldsFilled] = useState(true);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        dispatch(loadProfile());
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


    function showEdit(e) {
        setShowForm(!showForm);
    };


    async function submitField(e) {
        e.preventDefault();
        console.log(address);
        console.log(phone);

        if (!address || !phone) {
            setFieldsFilled(false);
        } else {
            setFieldsFilled(true);
        }

        if (address && phone){
            const form = {address, phone};
            try {
                setLoading(true);
                const result = await updateProfile(form);
                if (result.status === 201) {
                    setShowAddressForm(false);
                    setShowPhoneForm(false);
                    setLoading(false);
                } else {
                    setShowAddressForm(false);
                    setShowPhoneForm(false);
                    setLoading(false);
                }
            } catch (e) {
                navigate('/error');
            }
        }
    };

    return (
        <div> 
        {hasError ? 'Could not fetch profile, try again' : 
        (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : 
            <div>
                <h2>Welcome {profile.nickname}!</h2>
                <p>{profile.is_admin ? 'You have an admin account' : ''}</p>
                <p>{profile.first_name} {profile.last_name}</p>
                <div className="editContainer">
                    <button className='editIcon' onClick={showEditAddress}><EditIcon /></button>
                    {showAddressForm === false ?  <p>{profile.address}</p> : 
                    <div>
                        <input id='address' type='text' name='address' value={address} placeholder={address} onChange={handleAddressChange}/> 
                        <button type="submit" value="Submit" className="submitButton" onClick={submitField}>submit</button>
                    </div>}
                </div>
                <div className="editContainer">
                    <button className='editIcon' onClick={showEditPhone}><EditIcon /></button>
                    {showPhoneForm === false ?  <p>{profile.phone}</p> : 
                    <div>
                        <input id='phone' type='text' name='phone' value={phone} placeholder={phone} onChange={handlePhoneChange}/>
                        <button type="submit" value="Submit" className="submitButton" onClick={submitField}>submit</button>
                    </div>}
                </div>
                {fieldsFilled ? '' : 'Address and phone needs to be filled'}
            </div>
        )}
        </div>
    );
};

export default Profile;