import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Button,
  Dimensions,
  ScrollView,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import React, {useState, useEffect} from 'react';
import {DraxView, DraxProvider, DraxList} from 'react-native-drax';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import useStore from '../../../../store/store';
import MiniroomBox from '../../../components/MiniroomBox/MiniroomBox';
import {renderNode} from 'react-native-elements/dist/helpers';

const gestureRootViewStyle = {flex: 1};
const BackgroundInven = () => {
  const {Backaddress, setBacksaddress, BuyItem} = useStore();
  const usersCollection = firestore()
    .collection('Inventory')
    .doc(firebase.auth().currentUser.uid)
    .collection('background');
  const addBackground = firestore()
    .collection('miniroom')
    .doc(firebase.auth().currentUser.uid)
    .collection('room')
    .doc(firebase.auth().currentUser.uid);
  const [tool, setTool] = useState();
  const navigation = useNavigation();

  const getShopData = async () => {
    try {
      const data = await usersCollection.get();
      setTool(data._docs.map(doc => ({...doc.data(), id: doc.id})));
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getShopData();
  }, [BuyItem]);
  const AddBackground = newaddress => {
    addBackground
      .collection('background')
      .doc(firebase.auth().currentUser.uid + 'mid')
      .update({address: newaddress});
    //addBackground.collection('background').add({address:newaddress});
    console.log('저장완료');
    console.log(newaddress);
    setBacksaddress(newaddress);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        {tool?.map((row, idx) => {
          {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CheckItem', {tool, idx});
                  //updateMinime(row.address, row.name, row.size);
                  // console.log(tool);
                }}>
                <Image
                  source={{uri: row.address}}
                  style={{width: 70, height: 70}}
                  resizeMode="contain"
                  resizeMethod="resize"></Image>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </ScrollView>
  );
};
export default BackgroundInven;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 혹은 'column'
    padding: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  draggable: {
    width: 70,
    height: 70,
    borderWidth: 1,
  },
  receiver: {
    width: 70,
    height: 70,
    backgroundColor: 'green',
  },
  draggableBox: {
    height: Dimensions.get('window').width / 4 - 12,
    borderRadius: 80,
    width: Dimensions.get('window').width / 4 - 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderWidth: 1,
    flex: 1,
  },
});
