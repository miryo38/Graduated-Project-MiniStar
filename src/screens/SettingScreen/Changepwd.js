import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormButton_2 from '../../components/shared/FormButton_2';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../utils/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import useStore from '../../../store/store';

const Changepwd = () => {
  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');


  const navigation = useNavigation();
  
  const {placeX,setplaceX} = useStore();

  const onprofile = () => {
    navigation.navigate('ProfileScreen');
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

  const handleUpdate = async() => {
  
    
    firestore()
    .collection('users')
    .doc(user.uid)
    .update({
    
    
      password : password,
    
    })
    .then(() => {
      console.log('업데이트');
      navigation.navigate('SettingScreen');
      Alert.alert(
        '비밀번호가 변경되었습니다!',
        '당신의 비밀번호가 성공적으로 바뀌었습니다!',
        
      );
    })
  }

  

  useEffect(() => {
    getUser();
  }, []);

  



  return (
    <View style={styles.container}>
     
      <View
        style={{
          margin: 20,
         
        }}> 
          
          
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : userData
                    ? userData.userImg  ||
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                    : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 15}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  
                  
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 10, fontSize: 18,fontFamily : 'Jalnan'}}>
            {userData ? userData.name : ''}
          </Text>
         
        </View>

        <View style={styles.action}>
          <FontAwesome name="lock" color="#333333" size={20} />
          <TextInput
          fontFamily = 'Jalnan'
            placeholder="비밀번호 변경"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#333333" size={20} />
          <TextInput
          fontFamily = 'Jalnan'
            placeholder="비밀번호 변경 확인"
            placeholderTextColor="#666666"
            value={confirmPassword}
            onChangeText={(userPassword) => setConfirmPassword(userPassword)}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
      

     
        <FormButton_2 buttonTitle="업데이트" onPress={handleUpdate} />
      </View>
    </View>
  );
};

export default Changepwd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    fontFamily : 'Jalnan'

  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
    fontFamily : 'Jalnan'

  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    color: 'white',
    fontFamily : 'Jalnan'
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#696969',
  },
});
