import fetch from 'cross-fetch';
import {baseURL} from './apiKey';

// Auth
async function register(form) {
    const url = `${baseURL}/register`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
    });

    return response;
};


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


async function updateProfile(data) {
    const url = `${baseURL}/profile`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response.status === 200;
};

///////////////////////////////////////////
// Categories
async function getAllCategories() {
    const url = `${baseURL}/category`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function deleteSpecificCategory(categoryId) {
    const url = `${baseURL}/category/${categoryId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    console.log(response);
    return response;
};

export {register, login, userProfile, logout, updateProfile, getAllCategories, deleteSpecificCategory};
