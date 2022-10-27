import React,{ useState,useEffect,useContext} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions
  ,TouchableOpacity
  ,Alert
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from '../../StoreScreen/colors';
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../utils/AuthProvider';
import FormButton_2 from '../../../components/shared/FormButton_2';
import SelectDropdown from 'react-native-select-dropdown'

import {

  AddImage,

} from '../../../../styles/AddPost';
const width = Dimensions.get('window').width / 2 - 30;

const AddStore = ({navigation}) => {
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [about, setAbout] = useState(null);
  const [tag, setTag] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const tags = ["벽지", ,"가구","미니미", "미니펫", ]

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };
  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`shops/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
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
      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };
  const submitItem = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    firestore()
    .collection('shops')
    .doc('shopitems')
    .collection(tag)
    .add({
  
      name: name,
      price: price,
      type: tag,
      address: imageUrl,
      about : about
    })
    .then(() => {
     
      
      Alert.alert(
        '아이템 업데이트 완료!',
      );

      
      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  return (
    
    <View style={{flex: 1, backgroundColor : "#fff"}}>
      <View style={{alignItems : "center",marginTop : 10}}>
      
      {image != null ? <AddImage source={{uri: image}} /> : null}
      
      </View>
      <TouchableOpacity style={{}} onPress={() => choosePhotoFromLibrary()}> 
      <Text style={{alignSelf : "flex-end", fontFamily : "Jalnan", marginRight : 10, fontSize : 20}}>이미지 추가</Text>
      </TouchableOpacity> 
      <View style={style.action}>
          <TextInput
          fontFamily = 'Jalnan'
            placeholder="아이템 이름"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={name}
            onChangeText={(content) => setName(content)}
            style={style.textInput}
          />
          </View>
          <View style={style.action}>
          <TextInput
          fontFamily = 'Jalnan'
            placeholder="아이템 가격"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={price}
            onChangeText={(content) => setPrice(content)}
            style={style.textInput}
          />
          </View>
          <View style={style.action}>
          <TextInput
          fontFamily = 'Jalnan'
            placeholder="아이템 설명"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={about}
            onChangeText={(content) => setAbout(content)}
            style={style.textInput}
          />
          </View>
          <View style={style.action}>
          <Text
          fontFamily = "Jalnan"
          style={style.textInput}
          >아이템 카테고리</Text>
          
          </View>
          <SelectDropdown
           data={tags}
           onSelect={(selectedItem, index) => {
            setTag(selectedItem)
           }}
           buttonTextAfterSelection={(selectedItem, index) => {
      // text represented after item is selected
      // if data array is an array of objects then return selectedItem.property to render after item is selected
      return selectedItem
   }}
   rowTextForSelection={(item, index) => {
      // text represented for each item in dropdown
      // if data array is an array of objects then return item.property to represent item in dropdown
      return item
   }}
/>
          <FormButton_2 buttonTitle="업데이트" onPress={submitItem}  />
    </View>

     
  
      
     
  )
};

const style = StyleSheet.create({
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#696969',
    fontFamily: "Jalnan"
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryText: {fontSize: 16, color: 'grey', fontFamily: "Jalnan", },
  categoryTextSelected: {
    color: COLORS.orange,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.orange,
  },
  card: {
    height: 225,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 20,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 45,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Jalnan",
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 40,
    width: 0,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AddStore;