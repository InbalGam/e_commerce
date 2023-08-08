import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getAllCategories} from '../Api';
import { useNavigate } from 'react-router-dom';



export const loadCategories = createAsyncThunk(
    'categories/loadCategories',
    async () => {
        try {
            const results = await getAllCategories();
            const jsonData = await results.json();
            return jsonData;
        } catch (e) {
            useNavigate('/error');
        }
    }
);


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
            state.categories = action.payload;
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
