import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {userProfile} from '../Api';
import { useNavigate } from 'react-router-dom';


export const loadProfile = createAsyncThunk(
    '/profile',
    async () => {
        const results = await userProfile();
        const jsonData = await results.json();
        return jsonData;
    }
);


export const loggedOutProfile = createAsyncThunk(
    '/loggedOutProfile',
    async () => {
        try {
            return {};
        } catch (e) {
            useNavigate('/error');
        }
    }
);


export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: {},
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        [loadProfile.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [loadProfile.fulfilled]: (state, action) => {
            state.profile = action.payload[0];
            state.isLoading = false;
            state.hasError = false;
        },
        [loadProfile.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        },



        [loggedOutProfile.pending]: (state, action) => {
            
        },
        [loggedOutProfile.fulfilled]: (state, action) => {
            state.profile = {};
            
        },
        [loggedOutProfile.rejected]: (state, action) => {
            
        }
    }
});

export const selectProfile = state => state.profile.profile;
export default profileSlice.reducer;
