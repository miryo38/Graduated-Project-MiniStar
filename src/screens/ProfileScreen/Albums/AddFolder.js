import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions,Alert} from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import firestore from '@react-native-firebase/firestore'
import firebase  from '@react-native-firebase/app';
import useStore from '../../../../store/store'


const AddFolder = ({navigation,route}) => {
const rname = route.params.name
const [name, setName] = useState(null);
const {FolderName,setFolderName} = useStore();
const {uid} = route.params

const SubmitFolder = async () => {
    
    

    firestore()
    .collection('Albums').doc(firebase.auth().currentUser.uid).collection('groups').doc(name)
    .set({
  
      name : name,
      postTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
      console.log('Groups Added!');
      setFolderName(name);
      navigation.navigate('Album', {uid : uid, name : rname});
     
        
   

      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={styles.title}>
            <Text style = {{color : 'black', fontFamily : "Jalnan",fontSize:20}}>폴더 이름</Text>
        </View>    
        <View style={{flexDirection : 'row'}}>
        <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={(text) => {setName(text)}}
            placeholder="폴더 이름을 입력해주세요."
          />
          <TouchableOpacity onPress={() => SubmitFolder()}>
          <Text style ={{color : 'black', fontFamily : "Jalnan" ,fontSize:20 ,paddingHorizontal: 10, marginTop : 10}}>추가</Text>
          </TouchableOpacity>
          </View>
    </View>
  );
};

export default AddFolder;

const styles = StyleSheet.create({
  serach: {
    marginTop: 10,
    marginBottom: 10,

    
  },

  title : {
    margin:15,
    
  },

  textInput: {
    marginLeft : 30,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
    width : 300,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    fontFamily:"Jalnan",
    fontSize:16
  },
  showText: {
    marginTop: 10,
    fontSize: 25,
  }
  
});
