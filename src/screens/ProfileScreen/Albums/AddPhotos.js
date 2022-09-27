import React, {useState, useEffect, useContext,useCallback} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import useStore from '../../../../store/store'

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../../../../styles/AddPost';

import { AuthContext } from '../../../utils/AuthProvider';

const AddPhotos = ({route}) => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const {setPhotoName,SetBody,SetPost} = useStore();

  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState([null]);
  const [body, setBody] = useState(null);
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
  const submitPost = async () => {
    const currentPhotoId = Math.floor(100000 + Math.random() * 9000).toString();
    const currentuserId = firebase.auth().currentUser.uid
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
    .collection('Albums')
    .doc(firebase.auth().currentUser.uid)
    .collection('groups').doc(route.params.foldername).collection('photos').doc(currentPhotoId)
    .set({
      uid : user.uid,
      postid : currentPhotoId,
      post: post,
      body: body,
      img: imageUrl,
      folder : route.params.foldername,
      postTime: firestore.Timestamp.fromDate(new Date()),
      likescount : 0,
      commentcount : 0,
      
    })
    .then(() => {
        firestore()
        .collection('Albums')
        .doc(firebase.auth().currentUser.uid)
        .collection('groups').doc('전체사진').collection('photos').doc(currentPhotoId)
        .set({
          uid : user.uid,
          postid : currentPhotoId,
          post: post,
          body: body,
          img: imageUrl,
          folder : route.params.foldername,
          likescount : 0,
          commentcount : 0,
          postTime: firestore.Timestamp.fromDate(new Date()),
          
        })
        .then(() => {
         
            firestore()
            .collection('users')
            .doc(user.uid)
            .update({
              point :  userData.point + 10
            })
        })
        navigation.goBack();
      console.log('Post Added!');
      Alert.alert(
        '사진 업데이트 완료!',
      );
      setPhotoName(imageUrl);
      SetBody(body);
      SetPost(post);
      setDeleted(true);
      setPost(null);
      
      
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

    const storageRef = storage().ref(`AlbumPhotos/${filename}`);
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
          fontFamily = "Jalnan"
          placeholder="사진의 제목을 작성하세요!"
          multiline
          numberOfLines={3}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        </View>
        <InputField
          fontFamily = "Jalnan"
          placeholder="게시물 내용을 작성하세요!"
          multiline
          numberOfLines={2}
          value={body}
          onChangeText={(content) => setBody(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}    >
            <SubmitBtnText>Post </SubmitBtnText>
            
          </SubmitBtn>
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

export default AddPhotos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
