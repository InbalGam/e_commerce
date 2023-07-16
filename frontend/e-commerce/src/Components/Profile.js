import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {selectProfile, loadProfile} from '../store/profileSlice';
import FadeLoader from 'react-spinners/FadeLoader';
import EditIcon from '@mui/icons-material/Edit';


function Profile() {
    const profile = useSelector(selectProfile);
    const { hasError, isLoading } = useSelector((state) => state.profile);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadProfile());
    }, []);

    return (
        <div> {hasError ? 'Could not fetch profile, try again' : (isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader' /> : <div>
            <h2>Welcome {profile[0].nickname}!</h2>
            <p>{profile[0].first_name} {profile[0].last_name}</p>
            <p>{profile[0].address}<EditIcon className="editIcon"/></p>
            <p>{profile[0].phone}<EditIcon className="editIcon"/></p>
        </div>)}
        </div>
    );
};

export default Profile;