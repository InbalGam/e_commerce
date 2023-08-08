import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getUserOrders} from '../Api';
import { useNavigate } from 'react-router-dom';



export const loadOrdersDetails = createAsyncThunk(
    'orders/loadOrders',
    async () => {
        const results = await getUserOrders();
        const jsonData = await results.json();
        return jsonData;
    }
);


const fetchData = (payload) => {
    const data = payload.map(el => {
        return {
            orderId: el.id,
            orderTotal: el.total,
            shippedTo: el.shipping_address,
            contactPhone: el.phone,
            createdAt: el.created_at
        };
    });
    return data;
};


export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        ordersIsLoading: false,
        ordersHasError: false
    },
    reducers: {},
    extraReducers: {
        [loadOrdersDetails.pending]: (state, action) => {
            state.ordersIsLoading = true;
            state.ordersHasError = false;
        },
        [loadOrdersDetails.fulfilled]: (state, action) => {
            const data = fetchData(action.payload);
            state.orders = data;
            state.ordersIsLoading = false;
            state.ordersHasError = false;
        },
        [loadOrdersDetails.rejected]: (state, action) => {
            state.ordersIsLoading = false;
            state.ordersHasError = true;
        }
    }
});

export const selectOrders = state => state.orders.orders;
export default ordersSlice.reducer;
