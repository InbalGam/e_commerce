import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getCart} from '../Api';
import { useNavigate } from 'react-router-dom';



export const loadCart = createAsyncThunk(
    'cart/loadCart',
    async () => {
        try {
            const results = await getCart();
            const jsonData = await results.json();
            return jsonData;
        } catch (e) {
            useNavigate('/error');
        }
    }
);


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        [loadCart.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [loadCart.fulfilled]: (state, action) => {
            state.cart = action.payload;
            state.isLoading = false;
            state.hasError = false;
        },
        [loadCart.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const selectCart = state => state.cart.cart;
export default cartSlice.reducer;
