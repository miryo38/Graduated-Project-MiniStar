import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Text,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import useStore from '../../../store/store';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Draggable from 'react-native-draggable';
import {useSelector} from 'react-redux';
import {resolvePlugin} from '@babel/core';
import Toast from 'react-native-toast-message';
const MinipatBox = ({}) => {
  const [Minipat, setMinipat] = useState();
  const [patCount, setpatCount] = useState(1);
  const addminipat = firestore()
    .collection('miniroom')
    .doc(firebase.auth().currentUser.uid)
    .collection('room')
    .doc(firebase.auth().currentUser.uid)
    .collection('minipat')
    .doc(firebase.auth().currentUser.uid + 'mid');
  const {countItem, isMinipat} = useStore();
  const count = useSelector(state => {
    return state.count.value;
  });

  const getMinipat = async () => {
    try {
      const datatool = await addminipat.get();
      setMinipat(datatool._data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '포인트 획득완료!',
      text2: `정상적으로 업데이트 했습니다!👋`,
    });
  };
  const TakePoint = () => {
    firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              point: documentSnapshot.data().point + 300,
            });
        }
      });
    showToast();
  };
  const ShortPress = () => {
    if (patCount < 6) {
      setpatCount(patCount + 1);
    } else {
      setpatCount(1);
      TakePoint();
    }
  };
  useEffect(() => {
    getMinipat();
    return () => {};
  }, [countItem, isMinipat, count]);
  return (
    <View style={{position: 'absolute', borderWidth: 1}}>
      {Minipat && (
        <Draggable
          x={320}
          y={110}
          z={0}
          renderSize={80}
          // imageSource={{uri: `${Minipat[count]}`}}
          imageSource={{uri: `${Minipat[patCount]}`}}
          onShortPressRelease={ShortPress}
          shouldReverse={true}></Draggable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 70,
    width: 70,
    position: 'absolute',
  },
});
export default MinipatBox;
