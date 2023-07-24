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


const fetchData = (payload) => {
    const data = payload.map(el => {
        return {
            id: el.id,
            categoryName: el.category_name,
            is_archived: el.is_archived,
            imagename: el.imagename,
            image_id: el.image_id
        };
    });
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
            const data = fetchData(action.payload);
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
