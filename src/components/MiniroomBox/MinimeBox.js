import {View ,StyleSheet,Animated,PanResponder,Image,Text} from 'react-native';
import React,{useRef, useState,useEffect} from 'react'
import useStore from '../../../store/store';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Draggable from 'react-native-draggable';

const MinimeBox =({}) => {
  const usersMinimeCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('minime').doc(firebase.auth().currentUser.uid+ 'mid');
  const addminiroom = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('minime');
  const {setMinimeaddress,setMinimegetx,setMinimegety,setMinimename} = useStore();
  const {Minimegetx,Minimegety,Minimeaddress,Minimename,countItem} = useStore();

  const [Minime] = useState();
  const getMinime = async () => {
    try {
      const data = await usersMinimeCollection.get();
      setMinimeaddress(data._data.address);
      setMinimename(data._data.name);
      setMinimegetx(data._data.getx);
      setMinimegety(data._data.gety);

    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getMinime();
    return () => {
    }
  }, [countItem]);
  const addItem = async(x,y,address,name) => {
    const rows = addminiroom.where('name', '==', name);  
    await rows.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            getx:x,
            gety:y,
            address:address,
            name:name,
          })
        });
      });
      console.log('----------------------');
      console.log('save complete');
  };
    return(
      <View style={{position:'absolute'}}>
                  <Draggable x={Minimegetx} y={Minimegety}z={0} renderSize={80} imageSource={{uri:`${Minimeaddress}`}} onDragRelease={(e,g,b) => {addItem(b.left,b.top,Minimeaddress,Minimename)}}  debug={true}></Draggable>
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
    export default MinimeBox