import { Link } from 'react-router-dom';
import { useState } from "react";
import {login} from '../Api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authFailed, setAuthFailed] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    async function submitLogin(e) {
        setIsLoading(true);
        e.preventDefault();
        setAuthFailed(false);
        try {
            const result = await login(username, password);
            if (result === true) {
                navigate('/profile');
                setIsLoading(false);
            } else {
                setAuthFailed(true);
                setIsLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };

    return (
        <div className={'login_container'}>
            <p className={'messages'}>{searchParams.get("register") ? 'Succefully registered, you can log in' : ''}</p>
            <h1 className='loginH1'>Shop Online</h1>
            <p className={'loginHeadline'}>Log in below</p>
            <form onSubmit={submitLogin} className={'loginForm'}>
                <label for='username'>Username</label>
                <input id='username' type='text' name='username' value={username} placeholder={'username'} onChange={handleUsernameChange} />
                <label for='password'>Password</label>
                <input id='password' type='password' name='password' value={password} placeholder={'password'} onChange={handlePasswordChange} />
                {isLoading ? <FadeLoader color={'#3c0c21'} size={150} className='submitLoader'/> : <button type="submit" value="Submit">Log in</button>}
            </form>
            <div className={'authStatus'}>
                {authFailed ? 'Username or Password are incorrect, try again' : ''}
            </div>
            <p className={'registrationHeadline'}>Not registered yet?</p>
            <Link to='/register' className={'registrationLink'} >Register here</Link>
        </div>
    );
};

export default Login;