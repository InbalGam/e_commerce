import fetch from 'cross-fetch';
import {baseURL} from './apiKey';

// Auth
async function login(username, password) {
    const url = `${baseURL}/login`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });

    return response.status === 200;
};

///////////////////////////////////////////
async function getAllCategories() {
    const url = `${baseURL}/category`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};

export {login, getAllCategories};
