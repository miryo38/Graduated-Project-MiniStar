import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ImageBackground,
  Alert,
  Pressable,
} from 'react-native';
import ToolInven from './ToolInven';
import MinimiInven from './MinimiInven';
import BackgroundInven from './BackgroundInven';
import MinipatInven from './MinipatInven';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';

import MiniroomBox from '../../../components/MiniroomBox/MiniroomBox';
import MinimeBox from '../../../components/MiniroomBox/MinimeBox';
import MinipatBox from '../../../components/MiniroomBox/MinipatBox';
import useStore from '../../../../store/store';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import ViewShot from 'react-native-view-shot';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import HeaderLeftGoBack from '../../../components/HeaderLeftGoBack';
import {useDispatch, useSelector} from 'react-redux';
import Config from 'react-native-config';
const initial =
  'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/Background%2Fbackground1.png?alt=media&token=f59b87fe-3a69-46b9-aed6-6455dd80ba45';
const Tab = createMaterialTopTabNavigator();

const Miniroom = () => {
  const dispatch = useDispatch();
  const count = useSelector(state => {
    return state.count.value;
  });
  const useruid = useSelector(state => {
    return state.user.uid;
  });
  const navigation = useNavigation();
  const captureRef = useRef();

  const {Backaddress, countItem} = useStore();
  const {Minimeaddress} = useStore();
  const [Back, setBack] = useState(null);
  const [Minipat, setMinipat] = useState(null);
  const [MinipatCount, setMinipatCount] = useState(0);
  const [userData, setUserData] = useState(null);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => HeaderLeftGoBack(navigation),
    });
  }, [navigation]);

  const usersBackgroundCollection = firestore()
    .collection('miniroom')
    .doc(firebase.auth().currentUser.uid)
    .collection('room')
    .doc(firebase.auth().currentUser.uid)
    .collection('background')
    .doc(firebase.auth().currentUser.uid + 'mid');

  const usersMinipatCollection = firestore()
    .collection('miniroom')
    .doc(firebase.auth().currentUser.uid)
    .collection('room')
    .doc(firebase.auth().currentUser.uid)
    .collection('minipat')
    .doc(firebase.auth().currentUser.uid + 'mid');

  useEffect(() => {
    getBackgroundData();
    getMinipat();
    getUser();
  }, [countItem, Minimeaddress, Backaddress, Minipat]);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
  const uploadImage = async () => {
    const uploadUri = await getPhotoUri();

    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);

    const storageRef = storage().ref(`miniRoomImage/${filename}`);
    const task = storageRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      console.log('uri', url);

      setUploading(false);
      setImage(null);
      firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          miniRoom: url,
        });
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const getPhotoUri = async () => {
    const uri = await captureRef.current.capture();

    return uri;
  };

  const onSave = async () => {
    const uri = await getPhotoUri();
    const imageuri = await uploadImage();
    showToast();
  };

  const getBackgroundData = async () => {
    try {
      const data = await usersBackgroundCollection.get();
      setBack(data._data.address);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getMinipat = async () => {
    try {
      const data = await usersMinipatCollection.get();
      setMinipat(data._data.address);
      setMinipatCount(data._data.count);
    } catch (error) {
      console.log(error.message);
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '저장완료!',
      text2: `정상적으로 저장했습니다!👋`,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}>
      <Pressable
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#3b5998',
        }}
        onPress={() => {
          onSave();
        }}>
        <Text style={{fontFamily: 'Jalnan', color: 'white'}}>저장버튼</Text>
      </Pressable>
      <View style={{height: 200}}>
        <ViewShot
          style={{flex: 1}}
          ref={captureRef}
          options={{format: 'jpg', quality: 0.9}}>
          <View style={styles.Backimg}>
            <ImageBackground
              style={styles.background}
              source={{uri: `${Back ? Back : initial}`}}
              resizeMethod="resize"></ImageBackground>
          </View>

          <View style={styles.item}>
            <MiniroomBox></MiniroomBox>
            <MinimeBox></MinimeBox>
            <MinipatBox></MinipatBox>
          </View>
        </ViewShot>
      </View>

      <View style={styles.miniroom}>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: 'orange',
            inactiveTintColor: 'gray',
            labelStyle: {
              fontSize: 15,
              fontFamily: 'Jalnan',
            },
          }}>
          <Tab.Screen name="가구" component={ToolInven} />
          <Tab.Screen name="미니미" component={MinimiInven} />
          <Tab.Screen name="배경" component={BackgroundInven} />
          <Tab.Screen name="미니펫" component={MinipatInven} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default Miniroom;
const styles = StyleSheet.create({
  miniroom: {
    flex: 1,
    height: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'stretch',
    position: 'absolute',
    height: '100%',
    weight: '100%',
    opacity: 0.8,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  item: {
    position: 'absolute',
  },
  minime: {
    resizeMode: 'stretch',
    position: 'absolute',
    transform: [{translateX: 150}, {translateY: 90}],
    width: 100,
    height: 100,
  },
  minipat: {
    resizeMode: 'stretch',
    position: 'absolute',
    transform: [{translateX: 310}, {translateY: 90}],
    width: 100,
    height: 100,
  },
  Backimg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    //paddingBottom: '56.25%',
    //position: 'relative'
  },
});
