import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectProfile, loadProfile} from '../store/profileSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import EditIcon from '@mui/icons-material/Edit';


function Profile() {
    const profile = useSelector(selectProfile);
    const { hasError, isLoading } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        dispatch(loadProfile());
    }, []);


    function showEditForm(e) {
        setShowForm(!showForm);
    };

    return (
        <div> 
        {hasError ? 'Could not fetch profile, try again' : 
        (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : 
            <div>
                <h2>Welcome {profile.nickname}!</h2>
                <p>{profile.first_name} {profile.last_name}</p>
                <div className="editContainer">
                    <p>{profile.address}</p>
                    <button className='editIcon' onClick={showEditForm}><EditIcon /></button>
                </div>
                <div className="editContainer">
                    <p>{profile.phone}</p>
                    <button className='editIcon' onClick={showEditForm}><EditIcon /></button>
                </div>
            </div>
        )}
        </div>
    );
};

export default Profile;