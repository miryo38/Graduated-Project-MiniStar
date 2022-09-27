import { View, Text,TouchableOpacity,StyleSheet,Image,SafeAreaView,Button,Dimensions,ScrollView} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import React,{useState,useEffect} from 'react'
import firebase  from '@react-native-firebase/app';
import useStore from '../../../../store/store';

const MinipatInven = () => {
  const usersCollection = firestore().collection('Inventory').doc(firebase.auth().currentUser.uid).collection('minipat');
  const addBackground = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid);
  const {setisMinipat,BuyItem,setcountItem} = useStore();
  const [tool, setTool] = useState();
   
  const getShopData = async () => {
    try {
      const data = await usersCollection.get();
      setTool(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateMinime = async(newaddress1,newaddress2,newaddress3,newaddress4,newaddress5,newaddress6,) => {
    const patPromise = await addBackground
    .collection('minipat')
    .doc(firebase.auth().currentUser.uid+ 'mid')
    .update({
      address1:newaddress1,
      address2:newaddress2,
      address3:newaddress3,
      address4:newaddress4,
      address5:newaddress5,
      address6:newaddress6,
      count:0});
    setcountItem();
    //setisMinipat(newaddress1);
  };
  useEffect(() => {
    getShopData();
  }, [BuyItem]);

  return (
    <ScrollView>
    <View style={styles.container}>
      {
        tool?.map((row, idx) => {
          {
            return  <TouchableOpacity onPress={()=>{updateMinime(
              row.address1,
              row.address2,
              row.address3,
              row.address4,
              row.address5,
              row.address6
              )}}>
            <Image source ={{uri:row.address1}} style={{width:70,height:70,}} resizeMode="contain" resizeMethod = 'resize' ></Image>
            </TouchableOpacity>;} 
      })
      }
    </View>
    
    </ScrollView>
  )
}
export default MinipatInven;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 혹은 'column'
    padding: 20,
    alignItems: 'center',
    flexWrap:"wrap",
},
});

