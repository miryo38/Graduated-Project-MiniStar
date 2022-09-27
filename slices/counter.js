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
    //   if(state.value<5){
    //     state.value = state.value+action.payload;
    //     console.log('현재 카운트',state.value);
    //   } else {
    //     state.value = initialState.value;
    //     firestore()
    //     .collection('users')
    //     .doc(firebase.auth().currentUser.uid)
    //     .get()
    //     .then(documentSnapshot => {
    //       if (documentSnapshot.exists) {
    //         firestore()
    //         .collection('users')
    //         .doc(firebase.auth().currentUser.uid)
    //         .update({
    //           point: documentSnapshot.data().point + 300,
    //     });
    //       }
    //     });
    //   }
    // },
    down:(state, action)=> {
      state.value = state.value-action.payload;
    },
  },  
});
export default counterSlice;
export const {up} = counterSlice.actions;