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

async function userProfile() {
    const url = `${baseURL}/profile`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};

async function logout() {
    const url = `${baseURL}/logout`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
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

export {login, userProfile, logout, getAllCategories};
