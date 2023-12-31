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


async function archiveSpecificCategory(categoryId, status) {
    const url = `${baseURL}/category/${categoryId}/archive`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status})
    });
    return response;
};


async function insertNewCategory(categoryName, imgId) {
    const url = `${baseURL}/category`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({categoryName, imgId})
    });

    return response;
};

async function updateCategory(categoryId, categoryName, imgId) {
    const url = `${baseURL}/category/${categoryId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({categoryName, imgId})
    });

    return response;
};

async function getAllCategoryProducts(categoryId) {
    const url = `${baseURL}/category/${categoryId}/products`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function archiveSpecificProduct(categoryId, productId, status) {
    const url = `${baseURL}/category/${categoryId}/products/${productId}/archive`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status})
    });
    return response;
};


async function insertNewProduct(categoryId, data) {
    const url = `${baseURL}/category/${categoryId}`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response;
};


async function updateProduct(categoryId, productId, data) {
    const url = `${baseURL}/category/${categoryId}/products/${productId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response;
};


async function loadImage(data) {
    const url = `${baseURL}/image`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Accept': 'application/json'},
        body: data
    });

    return response;
};


async function getCart() {
    const url = `${baseURL}/cart`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function addToCart(data) {
    const url = `${baseURL}/cart`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response;
};


async function updateProductCart(productId, data) {
    const url = `${baseURL}/cart/${productId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response;
};


async function deleteUserCart() {
    const url = `${baseURL}/cart`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    return response;
};


async function deleteProductInCart(productId) {
    const url = `${baseURL}/cart/${productId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    return response;
};


async function getUserOrders() {
    const url = `${baseURL}/order`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};

async function getSpecificOrder(orderId) {
    const url = `${baseURL}/order/${orderId}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};

async function addOrder(data) {
    const url = `${baseURL}/order`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return response;
};


async function searchDB(word) {
    const url = `${baseURL}/search`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(word)
    });

    return response;
};


export {register, login, userProfile, logout, updateProfile,
    getAllCategories, archiveSpecificCategory, insertNewCategory, updateCategory, loadImage,
    getAllCategoryProducts, archiveSpecificProduct, insertNewProduct, updateProduct,
    getCart, addToCart, updateProductCart, deleteUserCart, deleteProductInCart,
    addOrder, getUserOrders, getSpecificOrder, searchDB};
