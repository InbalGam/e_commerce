import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getAllCategoryProducts} from '../Api';
import { useNavigate } from 'react-router-dom';



export const loadProducts = createAsyncThunk(
    'products/loadProducts',
    async (categoryId) => {
        try {
            const results = await getAllCategoryProducts(categoryId);
            const jsonData = await results.json();
            if (results.status === 200) {
                return jsonData;
            } else {
                return [];
            }
        } catch (e) {
            useNavigate('/error');
        }
    }
);


const fetchData = (payload) => {
    let data = [];
    if (payload) {
        data = payload.map(el => {
            return {
                id: el.id,
                product_name: el.product_name,
                is_archived: el.is_archived,
                inventory_quantity: el.inventory_quantity,
                price: el.price,
                discount_percentage: el.discount_percentage,
                imagename: el.imagename,
                image_id: el.image_id,
                category_id: el.category_id
            };
        });
    }
    return data;
};


export const productSlice = createSlice({
    name: 'categories',
    initialState: {
        products: [],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        [loadProducts.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [loadProducts.fulfilled]: (state, action) => {
            const data = fetchData(action.payload);
            state.products = data;
            state.isLoading = false;
            state.hasError = false;
        },
        [loadProducts.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const selectProducts = state => state.products.products;
export default productSlice.reducer;
