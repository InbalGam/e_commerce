import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getAllCategories} from '../Api';
import { useNavigate } from 'react-router-dom';



export const loadCategories = createAsyncThunk(
    '/category',
    async () => {
        try {
            const results = await getAllCategories();
            const jsonData = await results.json();
            console.log(jsonData);
            return jsonData;
        } catch (e) {
            useNavigate('/error');
        }
    }
);


const fetchData = (payload) => {
    console.log(payload);
    const data = payload.map(el => {
        return {
            id: el.id,
            categoryName: el.category_name
        };
    });
    console.log(data);
    return data;
};


export const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        [loadCategories.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [loadCategories.fulfilled]: (state, action) => {
            console.log(action.payload);
            const data = fetchData(action.payload);
            console.log(data);
            state.categories = data;
            state.isLoading = false;
            state.hasError = false;
        },
        [loadCategories.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const selectCategories = state => state.categories.categories;
export default categorySlice.reducer;
