import {View ,StyleSheet,Animated,PanResponder,Image,Text} from 'react-native';
import React,{useRef, useState,useEffect} from 'react'
import useStore from '../../../store/store';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Draggable from 'react-native-draggable';
import { useSelector } from 'react-redux';

const MinipatBox =({}) => {
  const [Minipat, setMinipat] = useState()
  const [Patarr, setPatarr] = useState();
  const addminipat = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('minipat');
  const {countItem,isMinipat} = useStore();
  const count = useSelector(state => {return state.count.value});
  
  const getMinipat = async() => {
    try {
      const datatool = await addminipat.get();
      setMinipat(datatool._docs[0]._data);
      console.log(Minipat);
      
      let strArr = Object.keys(Minipat).map(item => Minipat[item]);
      let newstrArr = strArr.sort();
      setPatarr(newstrArr.slice(1,7));
    } catch (error) { 
      console.log(error.message);
    }
  };
  useEffect(() => {
    getMinipat();
    return () => {
    }
  }, [countItem,isMinipat,count]);
    return(
      <View style={{position:'absolute',borderWidth:1,}}>
        {
          Patarr ?
           <Draggable x={320} y={110}z={0} renderSize={80} imageSource={{uri:`${Patarr[count]}`}}shouldReverse={true}></Draggable>
           :
           <Text>asdasds</Text>
        }
                  
        </View>
        )
    }

    const styles =StyleSheet.create({
        box:{
            height: 70,
            width: 70,
            position:'absolute'
          },
    });
    export default MinipatBox