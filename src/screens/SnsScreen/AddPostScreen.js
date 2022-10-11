import React, {useState, useEffect, useContext,useCallback} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../../../styles/AddPost';

import { AuthContext } from '../../utils/AuthProvider';
import useStore from '../../../store/store';

const AddPostScreen = () => {

  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const tags = ["인물", "배경", "음식", "동물", "물건", "문화"]
  const {user, logout} = useContext(AuthContext);
  const {Post,SetPost} = useStore(); //0522새로고침용 

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState([null]);
  const [userData, setUserData] = useState(null);

  const [tag, setTag] = useState(null);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

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

  const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  const currentPhotoId = Math.floor(100000 + Math.random() * 9000).toString();

  const submitPost = async () => {
    const currentuserId = firebase.auth().currentUser.uid
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);
    SetPost(post);
    firestore()
    .collection('posts')
    .doc(currentPhotoId)
    .set({
      name : userData.name,
      uid: user.uid,
      post: post,
      tag: tag,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      likes: 0,
      comments: 0,
      postid : currentPhotoId,
    })
    .then(() => {
      firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        point :  userData.point + 10
      })
      console.log('Post Added!');
      Alert.alert(
        '게시물 업데이트 완료!',
      );

      setDeleted(true);


      setPost(null);
      navigation.goBack()
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  useEffect(() => {
    setDeleted(false);
    getUser();
  }, [deleted,refreshing]);

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

    const storageRef = storage().ref(`posts/${filename}`);
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

  return (
    
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <View style={styles.row}>
        <InputField
        style={{textAlign: 'left',fontSize:18}}
          fontFamily="Jalnan"
          placeholder="게시물 내용을 작성하세요!"
          multiline
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        </View>
        <View style={{alignItems:'center',width:'100%',}}>
        <Text style={{marginTop : 20,marginBottom : 20,fontFamily : "Jalnan",}}>게시물의 주제를 선택하세요</Text>
       
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
        
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <View style={{marginTop : 20}}>
          <SubmitBtn onPress={submitPost}    >
            <SubmitBtnText styles>작성 </SubmitBtnText>
            
          </SubmitBtn>
          </View>
        )}
      </InputWrapper>
      <ActionButton buttonColor="#FF6347">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="사진 촬영"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="갤러리에서 선택"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
   
        
    </View>
    
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    alignItems: 'center'
},

});