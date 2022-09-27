import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  uid : '',
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
    },
  },  
  extraReducers: builder => {},
});
export default userSlice;