import { useState } from "react";
import {register} from '../Api';
import FadeLoader from 'react-spinners/FadeLoader';
import {validateEmail} from '../utils';
import { useNavigate} from 'react-router-dom';
import styles from './Styles/Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validNickname, setValidNickname] = useState(true);
    const [registerAuth, setRegisterAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const[msg, setMsg] = useState('');
    const [fieldsFilled, setFieldsFilled] = useState(true);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    function handleNicknameChange(e) {
        setNickname(e.target.value);
    };

    function handleFirstNameChange(e) {
        setFirstName(e.target.value);
    };

    function handleLastNameChange(e) {
        setLastName(e.target.value);
    };

    function handleAddressChange(e) {
        setAddress(e.target.value);
    };

    function handlePhoneChange(e) {
        setPhone(e.target.value);
    };



    async function submitForm(e) {
        e.preventDefault();
        setValidPassword(password.length >= 8);
        setValidNickname(nickname.length >= 3);
        setValidUsername(validateEmail(username));

        if (!firstName || !lastName) {
            setFieldsFilled(false);
        } else {
            setFieldsFilled(true);
        }

        if ((password.length >= 8) && (nickname.length >= 3) && (validateEmail(username)) && firstName && lastName){
            const form = {username, password, nickname, firstName, lastName, address, phone};
            try {
                setIsLoading(true);
                const result = await register(form);
                const jsonData = await result.json();
                setMsg(jsonData.msg);
                if (result.status === 201) {
                    setUsername('');
                    setPassword('');
                    setNickname('');
                    setFirstName('');
                    setLastName('');
                    setAddress('');
                    setPhone('');
                    setValidNickname(true);
                    setValidPassword(true);
                    setValidUsername(true);
                    navigate('/login?register=1');
                    setIsLoading(false);
                } else {
                    setRegisterAuth(true);
                    setIsLoading(false);
                }
            } catch (e) {
                navigate('/error');
            }
        }
    };


    return (
    <div className="register_container">
        <h2>Welcome to Shop Online!</h2>
        <form onSubmit={submitForm} className='registerForm'>
            <label htmlFor='username'>Email</label>
            <input id='username' type='text' name='username' value={username} placeholder={'Enter your email here'} onChange={handleUsernameChange} />
            {validUsername ? '' : 'The username needs to be a valid email'}
            <label htmlFor='password'>Password</label>
            <input id='password' type='password' name='password' value={password} placeholder={'Enter your password here'} onChange={handlePasswordChange} />
            {validPassword ? '' : 'Your password must be at least 8 characters'}
            <label htmlFor='nickname'>Nickname</label>
            <input id='nickname' type='text' name='nickname' value={nickname} placeholder={'Enter your nickname here'} onChange={handleNicknameChange} />
            {validNickname ? '' : 'Your nickname must be at least 3 characters'}
            <label htmlFor='firstName'>First name</label>
            <input id='firstName' type='text' name='firstName' value={firstName} placeholder={'Enter your first name here'} onChange={handleFirstNameChange} />
            <label htmlFor='lastName'>Last name</label>
            <input id='lastName' type='text' name='lastName' value={lastName} placeholder={'Enter your last name here'} onChange={handleLastNameChange} />
            <label htmlFor='address'>Address</label>
            <input id='address' type='text' name='address' value={address} placeholder={'Enter your address here'} onChange={handleAddressChange} />
            <label htmlFor='phone'>Phone number</label>
            <input id='phone' type='text' name='phone' value={phone} placeholder={'Enter your phone here'} onChange={handlePhoneChange} />
            {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='loader'/> : <button type="submit" value="Submit" className="submitButton">Register</button>}
            {registerAuth ? 'Could not register' : ''}
            {msg ? msg : ''}
            {fieldsFilled ? '' : 'There are missing fields'}
        </form>
    </div>
    );
};

export default Register;