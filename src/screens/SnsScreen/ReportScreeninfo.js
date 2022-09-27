import React, {useEffect, useState,useCallback} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FormButton_2 from '../../components/shared/FormButton_2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import  firebase from '@react-native-firebase/app';
import useStore from '../../../store/store';
import Loading from '../../utils/Loading';
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown'
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';


const ReportScreeninfo = ({route,navigation}) => {


const [tag, setTag] = useState(null);

const tags = ["무분별한 게시물 도배", ,"선정적인 음란 게시물","심한 욕설", "개인정보 침해", "기타 불량한 게시물" ]

  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const {Post,SetPost} = useStore(); // 0522새로고침용
  const [ready, setReady] = useState(true)
  const [userData, setUserData] = useState(null);
  const isFocused = useIsFocused();
  const [state, setState] = useState(0);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
    


  const fetchPosts = async () => {
    try {
      const list = [];

      
      await firestore()
        
      .collection("posts")
      .orderBy('postTime', 'desc')
      .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              post,
              uid,
              postImg,
              postTime,
              likes,  
              comments,
              postid,
            } = doc.data();
            list.push({
              id: doc.id,
              uid,
              postTime: postTime,
              postImg,
              post,
              liked: false,
              likes,
              postid,
              comments,
            });
          });
        });

      setPosts(list);
      
      if (loading) {
        setLoading(false);
      }

    
    } catch (e) {
      console.log(e);
    }
  };
  var radio_props = [
    {label: '무분별한 게시물 도배', value: 0 },
    {label: '선정적인 음란 게시물', value: 1 },
    {label: '심한 욕설', value: 2 },
    {label: '개인정보 침해', value: 3 },
    {label: '기타 불량한 게시물', value: 4 },
  ];
   
  var RadioButtonProject = ({
    getInitialState: function() {
      return {
        value,
      }
    },
    render: function() {
      return (
        <View>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            onPress={(value) => {setState({value:value})}}
          />
        </View>
      );
    }
  });

  const submitPost = async () => {
    
    
          firestore()
      .collection('ReportPost')
      .doc(route.params.postid)
      .set({
    
        uid: route.params.uid,
        userimg: userData
        ? userData.userImg ||
          'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
        : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
        post: route.params.name,
        postimg: route.params.img,
        name: userData ? userData.name || '' : '',
        postid: route.params.postid,
        report: tag,
        postTime : firestore.Timestamp.fromDate(new Date()),
      })
      
         
      Alert.alert(
        '게시물 신고 완료!',
      );

 


     
  
    
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
      
          setUserData(documentSnapshot.data());
        }
      });
  };
  useEffect(() => {
    setTimeout(()=>{
      setReady(false)
      },1000)   
    fetchPosts();
    getUser();
    setDeleted(false);
    
  }, [deleted,refreshing,Post,isFocused]);

  
 
  return (
    ready ? <Loading/> :  (
      <View style={{flex : 1 , backgroundColor : 'white'}}>
<ScrollView>
      
      <View style={Styles.container}>
      <View style={Styles.nameContainer}>
        <Image
          source={{uri: userData
            ? userData.userImg ||
              'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
        }}
          style={Styles.personImage}
        />
        <View>
        <TouchableOpacity>
          <Text style={Styles.personName}> {userData ? userData.name || 'Test' : 'Test'}{' '} </Text>
          
          </TouchableOpacity>
        </View>
        
        
        
      </View>
      
      </View>
      <Image source={{uri: route.params.img}} style={Styles.postImg} />
      <View style={{marginTop : 10,marginLeft : 10}}>
      <Text style={{fontFamily : "Jalnan"}}>{route.params.name}</Text>
      </View>
      <View style={{marginTop : 40 ,alignItems: 'center'}}>
        
      <Text
          fontFamily = "Jalnan"
          style={Styles.textInput}
          >신고 사유</Text>
          
          
          <SelectDropdown
          fontFamily = "Jalnan"
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
</View>
<View style={{marginTop : 20}}>
<FormButton_2 buttonTitle="신고하기" onPress={submitPost}  />
</View>
        </ScrollView>
        </View>
    )
  );
};

export default ReportScreeninfo;
const Styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 6,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },
  
  nameContainer: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personImage: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  postImg: {
    height: Dimensions.get('screen').height / 3,
    width: Dimensions.get('screen').width,
    
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    marginBottom : 20,
    paddingLeft: 10,
    color: 'orange',
    fontFamily: "Jalnan",
    fontSize : 20
  },

  personName: {
    color: 'red',
    marginStart: 10,
    fontFamily : 'Jalnan'
  },
  
});