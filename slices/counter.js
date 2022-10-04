import {createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
const initialState = {
  name: '',
  value : 0,
};
const counterSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    up:(state, action)=> {
      state.value = state.value+action.payload;
      console.log(state.value)
    },
    down:(state, action)=> {
      state.value = action.payload;
      console.log(state.value)
    },
  },  
});
export default counterSlice;
export const {up} = counterSlice.actions;